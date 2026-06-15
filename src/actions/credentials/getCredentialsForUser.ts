"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";


export const GetCredentialsForUser = async () => {
    try {
        const session = await getServerSession();
        if (!session?.userId) {
            throw new Error("Unauthenticated")
        }
        const userId = session.userId;

        const credentials = await prisma.credential.findMany({
            where: { userId: userId },
            orderBy: {
                name: "asc"
            }
        })
        return credentials;
    } catch (err: any) {
        throw new Error("ERROR OCCURED WHILE FERCHING CREDENTIALS : ", err.message)
    }
}