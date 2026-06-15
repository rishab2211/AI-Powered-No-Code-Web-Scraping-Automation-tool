"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GetWorkflowPhaseDetails(phaseId: string) {
    const session = await getServerSession();

    if (!session?.userId) {
        throw new Error("Unauthenticated");
    }
    const userId = session.userId;

    return prisma.executionPhase.findUnique({
        where: {
            id: phaseId,

        },
        include: {
            logs: {
                orderBy: {
                    timestamp: "asc"
                }
            }
        }
    })
}