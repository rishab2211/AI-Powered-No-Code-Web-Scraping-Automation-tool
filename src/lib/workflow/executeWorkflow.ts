import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/app/types/Workflows";
import { waitFor } from "../helper";
import { ExecutionPhase } from "@prisma/client";
import { CustomNode } from "@/app/types/appNode";
import { TaskRegistry } from "./task/Registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/app/types/executor";
import { TaskParamType } from "@/app/types/tasks";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/app/types/log";
import { createLogCollector } from "../log";

export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {


    const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
        include: { workflow: true, phases: true },
    });




    if (!execution) {
        throw new Error("Execution not found");
    }

    const edges = JSON.parse(execution.workflow.definition).edges as Edge[]

    //  Setup execution environment

    const environment: Environment = {
        phases: {},
    }




    // initialize the workflow execution
    await intializeWorkflowExecution(executionId, execution.workflowId, nextRunAt);



    // initialize phases status
    await initializePhaseStatuses(execution);





    // credits to be consumed
    let creditsConsumed = 0;
    let executionFailed = false;
    for (const phase of execution.phases) {
        // execute phase
        const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId);

        creditsConsumed += phaseExecution.creditsConsumed;
        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
    }

    // finalize execution
    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);


    // Clean up environment
    await cleanupEnvironment(environment);

    revalidatePath("/workflow/runs")
}



async function intializeWorkflowExecution(executionId: string, workflowId: string, nextRunAt?: Date) {

    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING,
        }
    });



    await prisma.workflow.update({
        where: {
            id: workflowId,
        },
        data: {
            lastRun: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId,
            ...(nextRunAt && { nextRunAt }),
        },
    }).catch();



}


async function initializePhaseStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id)
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING,
        }
    })


}




async function finalizeWorkflowExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {

    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;

    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed
        }
    });


    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId
        },
        data: {
            lastRunStatus: finalStatus
        }
    }).catch();


}


async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment, edges: Edge[], userId: string) {

    const logCollector = createLogCollector();

    const startedAt = new Date();

    const node = JSON.parse(phase.node) as CustomNode;
    setupEnvironmentForPhase(node, environment, edges);

    await prisma.executionPhase.update({
        where: {
            id: phase.id
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs)
        }
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;

    // decrement  user balance (with required credits)
    const creditsSuccess = await decrementCredits(userId, creditsRequired, logCollector);
    const creditsConsumed = creditsSuccess ? creditsRequired : 0;

    let phaseSuccess = false;
    if (creditsSuccess) {
        // Execute phase 
        phaseSuccess = await executePhase(phase, node, environment, logCollector);
    }

    const outputs = environment.phases[node.id].outputs;

    await finalizePhase(phase.id, phaseSuccess, outputs, logCollector, creditsConsumed);

    return { success: phaseSuccess, creditsConsumed };
}


async function finalizePhase(phaseId: string, success: boolean, outputs: any, logCollector: LogCollector, creditsConsumed: number) {

    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            outputs: JSON.stringify(outputs),
            creditCost: creditsConsumed,
            logs: {
                createMany: {
                    data: logCollector.getAll().map(log => ({
                        message: log.message,
                        timestamp: log.timestamp,
                        logLevel: log.level,

                    }))
                }
            }

        }
    })
}


async function executePhase(phase: ExecutionPhase, node: CustomNode, environment: Environment, logCollector: LogCollector): Promise<boolean> {

    const runFn = ExecutorRegistry[node.data.type];
    if (!runFn) {
        return false;
    }

    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);

    return await runFn(executionEnvironment);
}


async function setupEnvironmentForPhase(node: CustomNode, environment: Environment, edges: Edge[]) {

    environment.phases[node.id] = { inputs: {}, outputs: {} };

    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {

        if (input.type === TaskParamType.BROWSER_INSTANCE) { continue }
        const inputValue = node.data.inputs[input.name];

        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        // Get input value from outputs in the environment
        const connectedEdge = edges.find(edge => edge.target === node.id && edge.targetHandle === input.name);

        if (!connectedEdge) {
            console.error("Missing edge for input", input.name, "node.id : ", node.id);
            continue;
        }

        const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];

        environment.phases[node.id].inputs[input.name] = outputValue;


    }

}

function createExecutionEnvironment(node: CustomNode, environment: Environment, logCollector: LogCollector) {
    return ({
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],
        setOutput: (name: string, value: string) => {
            environment.phases[node.id].outputs[name] = value;
        },
        getBrowser: () => environment.browser,
        setBrowser: (browser: Browser) => (environment.browser = browser),
        getPage: () => environment.page,
        setPage: (page: Page) => (environment.page = page),

        log: logCollector
    })
}



async function cleanupEnvironment(environment: Environment) {
    if (environment.browser) {
        await environment.browser.close()
            .catch((err) => console.error("Cannot close browser, reason:", err));
    }
}


async function decrementCredits(userId: string, amount: number, logCollector: LogCollector) {
    try {
        await prisma.userBalance.update({
            where: {
                userId,
                credits: {
                    gte: amount
                }
            },
            data: {
                credits: {
                    decrement: amount
                }
            }
        });

        return true;
    } catch (err: any) {
        console.error("could not deduct credits, reason : ", err.message);
        logCollector.error("insufficient balance");
        return false;
    }
}