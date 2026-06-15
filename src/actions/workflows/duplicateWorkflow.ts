"use server"

import { WorkflowStatus } from "@/app/types/Workflows";
import prisma from "@/lib/prisma";
import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from "@/schema/workflow";
import { getServerSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {

    const session = await getServerSession();

    if (!session?.userId) {
        throw new Error("Unauthenticated");
    }
    const userId = session.userId;


    const { success, data } = duplicateWorkflowSchema.safeParse(form);

    if(!success){
        throw new Error("Invalid form data");
    }

    const sourceWorkflow = await prisma.workflow.findUnique({
        where: {
            id: data?.workflowId,
            userId,
           
        }
    });



    if (!sourceWorkflow) {
        throw new Error("Workflow does not exist");
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            name: data?.name!,
            description: data?.description,
            status: WorkflowStatus.DRAFT,
            definition: sourceWorkflow.definition,
        },
    });

    if(!result){
        throw new Error("Failed to duplicate workflow");
    }

    revalidatePath("/workflows");

    return result.id;

}