import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

export function AppShell({
  header,
  children,
  bottom,
}: {
  header?: ReactNode;
  children: ReactNode;
  bottom?: ReactNode; // optional sticky bar above the GNB
}) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-background">
      {header}
      <main className="pb-[calc(60px+env(safe-area-inset-bottom))]">{children}</main>
      {bottom}
      <BottomNav />
    </div>
  );
}

export function TopHeader({
  title,
  left,
  right,
}: {
  title?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-border bg-background px-4">
      <div className="flex min-w-0 items-center gap-2">{left}</div>
      {title ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[52px] items-center justify-center">
          <span className="truncate text-[15px] font-semibold text-foreground">{title}</span>
        </div>
      ) : null}
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}
