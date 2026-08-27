import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

export function AppShell({
  header,
  children,
  bottom,
  screenId,
  screenState = "Default",
}: {
  header?: ReactNode;
  children: ReactNode;
  bottom?: ReactNode; // optional sticky bar above the GNB
  screenId?: string;
  screenState?: "Default" | "Empty" | "Loading" | "Error";
}) {
  return (
    <div
      className="mx-auto min-h-dvh w-full max-w-[430px] bg-background"
      data-screen-id={screenId}
      data-screen-state={screenId ? screenState : undefined}
    >
      {header}
      <main className="pb-[calc(64px+env(safe-area-inset-bottom))]">{children}</main>
      {bottom}
      <BottomNav />
    </div>
  );
}
