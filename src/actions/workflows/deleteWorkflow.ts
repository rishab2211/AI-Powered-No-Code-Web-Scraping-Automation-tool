"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function DeleteWorkflow(id: string) {
    const session = await getServerSession();

    if(!session?.userId){
        throw new Error("Unauthenticated");
    }
    const userId = session.userId;

    await prisma.workflow.delete({
        where:{
            id,
            userId
        },
    })

    revalidatePath("/workflow");
}