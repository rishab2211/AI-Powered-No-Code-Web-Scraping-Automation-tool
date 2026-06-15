"use server"
import { PackId } from "@/app/types/billing";
import { getServerSession } from "@/lib/auth";

export async function PurchaseCredits(packId : PackId) {
    const session = await getServerSession();
    if(!session?.userId){
        throw new Error("Unauthenticated")
    }
    const userId = session.userId;

    
}