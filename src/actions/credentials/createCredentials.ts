"use server"

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { createCredentialSchema, createCredentialSchemaType } from "@/schema/credential"
import { getServerSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const CreateCredential = async (form: createCredentialSchemaType) => {
    const { success, data } = await createCredentialSchema.safeParse(form);
    if (!success) {
        throw new Error("Invalid form data");
    }

    const session = await getServerSession();
    if (!session?.userId) {
        throw new Error("Unauthenticated");
    }
    const userId = session.userId;

    // Encrypt value
    const encrypttedValue = symmetricEncrypt(data.value);
    console.log("@TESTING",{
        plain : data.value,
        encrypted : encrypttedValue
    });
    
    const result = await prisma.credential.create({
        data: {
            userId,
            name: data.name,
            value: encrypttedValue
        }
    });

    if(!result){
        throw new Error("Failed to create credentials")
    }

    revalidatePath("/credentials")
}