import { WorkflowStatus } from "@/app/types/Workflows";
import { getAppUrl } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { isValidSecret } from "@/lib/apiAuth";

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = authHeader.split(" ")[1];
    if (!isValidSecret(secret)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const workflows = await prisma.workflow.findMany({
        select: { id: true },
        where: {
            status: WorkflowStatus.PUBLISHED,
            cron: { not: null },
            nextRunAt: { lte: now }
        }
    });

    
    for (const workflow of workflows) {
        triggerWorkflow(workflow.id);
    }

    return Response.json({workflowsToRun:workflows.length}, { status: 200 });
}


function triggerWorkflow(workflowId: string) {
    const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);

    fetch(triggerApiUrl, {
        headers : {
            Authorization : `Bearer ${process.env.API_SECRET}`
        },
        cache: "no-store",
        signal: AbortSignal.timeout(15000)
    }).catch((error) => console.error("Error while triggering workglow with id : ", workflowId,"Error : ",error.message));

}