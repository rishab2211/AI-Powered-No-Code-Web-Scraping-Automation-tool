"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GetWorkflowsOfUser() {
    const session = await getServerSession();

    if (!session?.userId) {
        throw new Error("Unauthenticated!")
    }
    const userId = session.userId;

    return prisma.workflow.findMany({
        where: {
            userId,
        },
        orderBy:{
            createdAt: "asc"
        }
    })

    
}