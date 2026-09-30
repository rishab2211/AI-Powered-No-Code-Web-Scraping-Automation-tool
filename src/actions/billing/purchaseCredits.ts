"use server";

import { PackId, getCreditsPack } from "@/app/types/billing";
import { getServerSession } from "@/lib/auth";
import { getStripe } from "@/lib/paymentGateway/paymentGateway";
import { getAppUrl } from "@/lib/helper";
import { redirect } from "next/navigation";

export async function PurchaseCredits(packId: PackId) {
    const session = await getServerSession();
    if (!session?.userId) {
        throw new Error("Unauthenticated");
    }

    const pack = getCreditsPack(packId);
    if (!pack) {
        throw new Error("Invalid pack selected");
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe secret key is not configured");
    }

    const appUrl = getAppUrl("");
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `FlowCraft - ${pack.name}`,
                        description: `${pack.label} for workflow automation`,
                    },
                    unit_amount: pack.price,
                },
                quantity: 1,
            },
        ],
        metadata: {
            userId: session.userId,
            packId: pack.id,
        },
        success_url: `${appUrl}/billing?success=true`,
        cancel_url: `${appUrl}/billing`,
    });

    if (!checkoutSession.url) {
        throw new Error("Failed to generate checkout URL");
    }

    redirect(checkoutSession.url);
}