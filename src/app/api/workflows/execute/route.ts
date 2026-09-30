import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger, WorkflowStatus } from "@/app/types/Workflows";
import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import parser from "cron-parser";
import { isValidSecret } from "@/lib/apiAuth";

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        
        
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = authHeader.split(" ")[1];    

    if (!isValidSecret(secret)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId") as string;

    if (!workflowId) {
        return Response.json({ error: "Bad request" }, { status: 400 })
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId
        }
    });

    if (!workflow) {
        return Response.json({ error: "Bad request" }, { status: 400 });
    }

    const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan;


  
    try {
        const cron = parser.parseExpression(workflow.cron!, { utc: true });
        const nextRunAt = cron.next().toDate();

        const execution = await prisma.workflowExecution.create({
            data: {
                workflowId,
                userId: workflow.userId,
                definition: workflow.definition,
                status: WorkflowExecutionStatus.PENDING,
                startedAt: new Date(),
                trigger: WorkflowExecutionTrigger.CRON,
                phases: {
                    create: executionPlan.flatMap(phase => {
                        return phase.nodes.flatMap((node) => {
                            return {
                                userId: workflow.userId,
                                status: ExecutionPhaseStatus.CREATED,
                                number: phase.phase,
                                node: JSON.stringify(node),
                                name: TaskRegistry[node.data.type].label
                            }
                        })
                    })
                }

            }
        });


        await ExecuteWorkflow(execution.id, nextRunAt);
        return new Response(null, { status: 200 });

    } catch (err: any) {
        return Response.json({ error: "internal server error" }, { status: 400 });
    }



}