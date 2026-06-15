import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { waitFor } from "@/lib/helper";
import { getServerSession } from "@/lib/auth";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";
import NotFound from "@/app/not-found";

export default async function ExecutionViewerPage({
  params,
}: {
  params: { workflowId: string; executionId: string };
}) {
  const session = await getServerSession();

  // this needs to await according to nextjs docs
  // else there will be warning
  const { executionId } = await params;
  const { workflowId } = await params;

  if (!session?.userId) {
    return <div>Unauthenticated</div>;
  }

  return (
    <div className="h-full w-full  flex flex-col ">
      <Suspense  fallback={<Loader2Icon className='"h-10 w-10 animate-spin ' />}>
        <ExecutionViewerPageWrapper executionId={executionId} />
      </Suspense>
    </div>
  );
}

async function ExecutionViewerPageWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const session = await getServerSession();
  if (!session?.userId) {
    return <div>Unauthenticated</div>;
  }

  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div className=" h-full w-full flex justify-center items-center">
      <NotFound/>
    </div>;
  }
  return <div className="h-full w-full ">
    <ExecutionViewer initialData={workflowExecution} />
  </div>;
}
