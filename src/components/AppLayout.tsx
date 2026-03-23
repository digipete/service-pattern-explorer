import { type ReactNode } from "react";
import { AppHeader } from "./AppHeader";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>Service Pattern Finder is an unofficial research tool.</p>
          <p className="mt-1">
            It explores publicly searchable government code repositories and does not indicate
            official reuse, endorsement, or service ownership.
          </p>
        </div>
      </footer>
    </div>
  );
}
