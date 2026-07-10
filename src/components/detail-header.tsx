import { type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 하위/선택/상세/설정/안내 화면 공통 상단바.
 *
 * - 좌측: 뒤로가기(ChevronLeft) 버튼
 * - 중앙: 타이틀 (title) — 항상 화면 정중앙 정렬
 * - 우측: 액션 버튼(right). **기본값 없음**.
 *   즐겨찾기/알림/새로고침이 실제로 필요한 상세 화면에서만 명시적으로 전달한다.
 *   선택/설정/안내 화면(작물 선택, 날짜 선택, 도매시장 선택, 알림 설정,
 *   데이터 기준 안내 등)에서는 우측 액션을 넣지 않는다.
 *
 * 공통 상단바 정책상, 이 컴포넌트는 임시 빨간 점/실시간 표시 같은
 * 의미 없는 아이콘을 절대 렌더링하지 않는다.
 */
export function DetailHeader({
  title,
  center,
  onBack,
  right = null,
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
            <span className="truncate text-[15px] font-black tracking-tight text-foreground">
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
