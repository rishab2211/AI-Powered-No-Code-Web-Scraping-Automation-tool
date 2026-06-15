import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function SetupUser() {
    const session = await getServerSession();
    if (!session?.userId) {
        throw new Error("Unauthenticated");
    }
    const userId = session.userId;

    const balance = await prisma.userBalance.findUnique({
        where: { userId }
    });

    if (!balance) {
        // Free 250 credits (fallback if somehow not created at registration)
        await prisma.userBalance.create({
            data: {
                userId,
                credits: 250
            }
        })
    }

    redirect("/");
}