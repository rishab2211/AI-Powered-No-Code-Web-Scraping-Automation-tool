import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./_components/AppHeader";
import React from "react";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "300px",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar className="h-screen" />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto no-scrollbar">
            <div className="p-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}