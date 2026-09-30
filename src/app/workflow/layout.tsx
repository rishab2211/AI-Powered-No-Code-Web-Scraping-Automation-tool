import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { WorkflowIcon } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export const dynamic = "force-dynamic";

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      
      <main className="flex-1">{children}</main>
      {/* <Separator /> */}
      {/* <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-center bg-background p-2 shadow-sm">
        <WorkflowIcon className="h-5 w-5" />
      </footer> */}
    </div>
  );
};

export default Layout;
