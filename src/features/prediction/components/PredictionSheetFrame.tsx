import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/** AI 시세 예측 바텀시트 공통 틀: 본문만 스크롤, 하단 버튼 고정 */
export function PredictionSheetFrame({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[85dvh] max-w-[430px] flex-col rounded-t-2xl p-0"
      >
        <SheetHeader className="shrink-0 border-b border-[#E9ECEF] px-4 py-3.5 text-left">
          <SheetTitle className="text-body-lg font-bold text-foreground">{title}</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <div className="shrink-0 border-t border-[#E9ECEF] bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          {footer}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function SheetPrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid h-12 w-full place-items-center rounded-xl bg-[#3A8A3A] text-body font-bold text-white active:bg-[#2F6F2F] disabled:bg-[#DEE2E6] disabled:text-[#ADB5BD]"
    >
      {children}
    </button>
  );
}
