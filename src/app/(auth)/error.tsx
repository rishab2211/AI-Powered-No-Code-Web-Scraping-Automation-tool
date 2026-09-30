"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 text-center px-4 bg-muted/30">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="size-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Authentication Error</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || "An error occurred during authentication. Please try again."}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <Button onClick={() => reset()} variant="outline" className="gap-2">
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Button asChild>
          <Link href="/sign-in">Return to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
