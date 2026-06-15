"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";
import { parse } from "path";

export async function CancelCron({ id }: { id: string }) {

    const session = await getServerSession();

    if (!session?.userId) {
        throw new Error("unauthenticated");
    }
    const userId = session.userId;

    try {

        
        await prisma.workflow.update({
            where: {
                id,
                userId
            },
            data: {
                cron : null
            }
        })
    }catch(err :any){
        console.error("invalid cron : ",err.message);
        throw new Error("invalid cron expression : ");
    }

    revalidatePath("/workflows");
}