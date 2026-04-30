import Link from "next/link";
import type { Metadata } from "next";
import { Activity, CheckSquare, Gauge, GitPullRequestArrow, Plus } from "lucide-react";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Atomic Coding Agent",
  description: "Orchestration dashboard for agentic coding jobs",
};

const nav = [
  { href: "/jobs", label: "Jobs", icon: Activity },
  { href: "/new", label: "New", icon: Plus },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen">
            <header className="border-b border-border bg-white">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link href="/jobs" className="flex items-center gap-2 font-semibold">
                  <GitPullRequestArrow size={20} aria-hidden />
                  Atomic Coding Agent
                </Link>
                <nav className="flex items-center gap-1">
                  {nav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Icon size={16} aria-hidden />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
