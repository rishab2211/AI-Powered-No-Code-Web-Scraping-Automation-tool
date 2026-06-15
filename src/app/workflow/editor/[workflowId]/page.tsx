
import { waitFor } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import Editor from "../../_components/Editor";


const Page = async ({ params }: { params:{workflowId : string}}) => {

  // we need to await the params here as it is resloving as promise
  const resolvedParams = await params;
  
  const workflowId = resolvedParams.workflowId;

  const session = await getServerSession();

  if (!session?.userId) {
    return <div>Unauthenticated</div>;
  }
  const userId = session.userId;

  // await waitFor(5000);

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <Editor workflow={workflow} />

    // <pre>{JSON.stringify(workflow,null,4)}</pre>
  );
};

export default Page;

