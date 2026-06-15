"use server"

import { CustomNode } from "@/app/types/appNode";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger, WorkflowStatus } from "@/app/types/Workflows";
import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/FlowToExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
    workflowId: string;
    flowDefinition?: string;
}) {

    console.log("inside runWorkflow");


    const session = await getServerSession();

    if (!session?.userId) {
        throw new Error("unauthenticated");
    }
    const userId = session.userId;




    const { workflowId, flowDefinition } = form;





    if (!workflowId) {
        throw new Error("Workflow ID is required");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId
        }
    });

    if (!workflow) {
        throw new Error("workflow not defined");
    }

    let executionPlan: WorkflowExecutionPlan;
    let workflowDefinition = flowDefinition;
    if (workflow.status === WorkflowStatus.PUBLISHED) {
        if (!workflow.executionPlan) {
            throw new Error("No execution plan found in the published workflow.");
        }

        executionPlan = JSON.parse(workflow.executionPlan);
        workflowDefinition = workflow.definition;
    } else {
        if (!flowDefinition) {
            throw new Error("flow definition is not defined");
        }

        const flow = JSON.parse(flowDefinition);
        if (!flow || !Array.isArray(flow.nodes) || !Array.isArray(flow.edges)) {
            throw new Error("Invalid flow structure");
        }
        const result = FlowToExecutionPlan(flow.nodes as CustomNode[], flow.edges);

        if (result.error) {
            throw new Error("Flow definition not valid");
        }

        if (!result.executionPlan) {
            throw new Error("No execution plan generated")
        }

        executionPlan = result.executionPlan;

    }


    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            definition : workflowDefinition,
            phases: {
                create: executionPlan.flatMap(phase => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label
                        }
                    })
                })
            }

        },

        select: {
            id: true,
            phases: true,
        }
    })


    if (!execution) {
        throw new Error("Workflow execution not created");
    }

    ExecuteWorkflow(execution.id); // run this on background

    redirect(`/workflow/runs/${workflowId}/${execution.id}`)

}   