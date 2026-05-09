import type { Metadata } from "next";

import "./globals.css";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Atomic Coding Agent",
  description: "Orchestration dashboard for agentic coding jobs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <WorkspaceShell>{children}</WorkspaceShell>
        </Providers>
      </body>
    </html>
  );
}
