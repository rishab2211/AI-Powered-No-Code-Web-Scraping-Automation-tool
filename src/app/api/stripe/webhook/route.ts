import { stripe } from "@/lib/paymentGateway/paymentGateway";
import prisma from "@/lib/prisma";
import { getCreditsPack, PackId } from "@/app/types/billing";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return new Response("Missing signature or webhook secret", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const packId = session.metadata?.packId as PackId;

        if (userId && packId) {
            const pack = getCreditsPack(packId);
            if (pack) {
                const totalCreditsToAdd = pack.credits + (pack.bonus || 0);

                await prisma.userBalance.upsert({
                    where: { userId },
                    create: {
                        userId,
                        credits: totalCreditsToAdd,
                    },
                    update: {
                        credits: { increment: totalCreditsToAdd },
                    },
                });
            }
        }
    }

    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
