"use server"

import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow"
import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/app/types/Workflows";
import { redirect } from "next/navigation";
import { CustomNode } from "../../app/types/appNode"
import { Edge } from "@xyflow/react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/app/types/tasks";
export async function createWorkflow(form: createWorkflowSchemaType) {
    const { success, data } = createWorkflowSchema.safeParse(form);

    if (!success) {
        throw new Error("Invalid form data");
    }

    const session = await getServerSession();


    if (!session?.userId) {
        throw new Error("Unauthenticated");
    }
    const userId = session.userId;

    const intialWorkflow: { nodes: CustomNode[],edges: Edge[]}={
        nodes : [],
        edges : []
    };

    intialWorkflow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

    const result = await prisma.workflow.create({
        data: {
            userId,
            definition: JSON.stringify(intialWorkflow),
            ...data,
            status: WorkflowStatus.DRAFT
        }
    })

    if (!result) {
        throw new Error("failed to create workflow")
    }

    // console.log(result);

    // redirect(`/workflow/editor/${result.id}`)

    return result.id;
}