"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GetWorkflowExecutions(workflowId : string) {
    const session = await getServerSession();

    if(!session?.userId){
        throw new Error("unauthenticated");
    }
    const userId = session.userId;

    return prisma.workflowExecution.findMany({
        where : {
            userId,
            workflowId,
            
        },
        orderBy :{
            createdAt : "desc",
        }
    })
}