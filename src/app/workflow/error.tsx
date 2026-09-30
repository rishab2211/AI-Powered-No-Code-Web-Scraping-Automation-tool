"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function WorkflowError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Workflow error:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-center px-4 bg-background">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="size-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Workflow Error</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || "An unexpected error occurred in the workflow canvas or run viewer."}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <Button onClick={() => reset()} variant="outline" className="gap-2">
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button asChild className="gap-2">
          <Link href="/workflows">
            <Home className="size-4" />
            Back to Workflows
          </Link>
        </Button>
      </div>
    </div>
  );
}
