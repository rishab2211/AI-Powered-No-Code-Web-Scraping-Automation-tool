"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function formatPathname(pathname: string | null): string {
  if (!pathname || pathname === "/") return "Home";
  const formattedPath = pathname.slice(1); // Remove the leading slash
  return formattedPath.charAt(0).toUpperCase() + formattedPath.slice(1);
}

export default function layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/sign-in");
        router.refresh();
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  }

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
          <header className="sticky w-full top-0 z-20 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-4">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {formatPathname(pathname)}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Log out"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOutIcon className="size-5" />
              </Button>
            </div>
          </header>
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