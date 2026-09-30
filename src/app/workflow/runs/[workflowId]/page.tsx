import React, { Suspense } from "react";
import Topbar from "../../_components/topbar/Topbar";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { FileTerminalIcon, InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./_components/ExecutionsTable";

const ExecutionsPage = async ({
  params,
}: {
  params: Promise<{ workflowId: string }>;
}) => {
  const param = await params;

  return (
    <div className="h-screen w-full">
      <Topbar
        title="Execution History"
        className="w-full top-0 p-2 static "
        subtitle="List of all your previous executions"
        workflowId={param.workflowId}
        hideButtons
      />
      <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2Icon size={30} className="animate-spin" />
          </div>
        } 
      >
        <ExecutionTableWrapper workflowId={param.workflowId} />
      </Suspense>
      </div>
    </div>
  );
};

export default ExecutionsPage;

async function ExecutionTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);

  if (!executions) {
    return <div>No data found</div>;
  }

  if (executions.length===0) {
    return (
      <div className="container w-full h-full ">
        <div className="h-full  flex flex-col items-center  gap-2 justify-center ">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <FileTerminalIcon size={40} />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">
              No execution have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }
  return <ExecutionsTable initialData={executions} workflowId={workflowId} />;
}
