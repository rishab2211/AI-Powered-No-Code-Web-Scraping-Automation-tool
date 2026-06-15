import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import AppProvider from "@/components/provider/AppProvider";

export const metadata: Metadata = {
  title: "FlowCraft",
  description: "AI Powered No-Code Web Scraping Automation tool",
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
