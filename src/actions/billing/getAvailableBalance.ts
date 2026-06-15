"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth"

export async function GetAvailableCredits() {
    const session = await getServerSession();

    if(!session?.userId){
        throw new Error("unauthenticated");
    }
    const userId = session.userId;

    const balance = await prisma.userBalance.findUnique({
        where : { userId}
    });

    if(!balance) return -1;

    return balance.credits;
}