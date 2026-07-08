import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 상세/선택 화면 공통 상단바.
 *
 * - 좌측: 뒤로가기(ChevronLeft) 버튼
 * - 중앙: 타이틀 (title) 또는 커스텀 center 노드 — 항상 화면 정중앙 정렬
 * - 우측: 액션 버튼(right). 없으면 좌측 버튼과 동일 폭의 빈 공간을 유지해
 *   중앙 타이틀이 흔들리지 않게 한다.
 *
 * GNB/메인 화면용 AppHeader와는 별개다. 상세로 들어가는 화면에서만 사용.
 */
export function DetailHeader({
  title,
  center,
  onBack,
  right,
  className,
}: {
  title?: ReactNode;
  center?: ReactNode;
  onBack: () => void;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-2",
        className,
      )}
    >
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack}
        className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-secondary active:bg-gray-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="pointer-events-none absolute inset-x-14 top-0 flex h-[52px] items-center justify-center">
        {center ??
          (title ? (
            <span className="truncate text-[15px] font-semibold text-foreground">
              {title}
            </span>
          ) : null)}
      </div>

      {right ? (
        <div className="flex items-center gap-0.5">{right}</div>
      ) : (
        <div className="h-10 w-10" aria-hidden />
      )}
    </header>
  );
}
