"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";



export async function GetWorkflowExecutionWithPhases(executionId : string){
    const session = await getServerSession();

    if(!session?.userId){
        throw new Error("Unauthenticated");
    }
    const userId = session.userId;

    return prisma.workflowExecution.findUnique({
        where : {
            id : executionId,
            userId 
        },
        include :{
            phases : {
                orderBy :{
                    number : "asc"
                }
            }
        }
    })
}


