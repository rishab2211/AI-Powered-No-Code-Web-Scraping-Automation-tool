"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const DeleteCredential = async (name: string) => {
    try {
        const session = await getServerSession();
        if (!session?.userId) {
            throw new Error("Unauthenticated");
        }
        const userId = session.userId;

        const result = await prisma.credential.delete({
            where: {
                userId_name: {
                    userId,
                    name
                }
            }
        })

        console.log("RESULT OF DELETING : ", result)

        revalidatePath("/credentials")
    } catch (err: any) {
        throw new Error("Error occured while deleting credential: ", err.message)
    }








}