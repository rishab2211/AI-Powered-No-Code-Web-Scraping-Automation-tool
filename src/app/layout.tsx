import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import AppProvider from "@/components/provider/AppProvider";

export const metadata: Metadata = {
  title: "Workflow automation",
  description: "workflow animation tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          <main>
            {children}
            <Toaster richColors closeButton />
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
