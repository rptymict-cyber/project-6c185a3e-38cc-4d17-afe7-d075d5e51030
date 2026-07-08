import { useState, type ReactNode } from "react";
import { ChevronLeft, Bell, RefreshCw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * 상세/선택 화면 공통 상단바.
 *
 * - 좌측: 뒤로가기(ChevronLeft) 버튼
 * - 중앙: 타이틀 (title) 또는 커스텀 center 노드 — 항상 화면 정중앙 정렬
 * - 우측: 액션 버튼(right). 명시하지 않으면 홈(AppHeader)과 동일하게
 *   실시간 표시 · 새로고침 · 알림 아이콘을 기본으로 노출한다.
 *   완전히 비우고 싶으면 `right={null}`을 명시적으로 넘긴다.
 *
 * GNB/메인 화면용 AppHeader와 시각적으로 동일한 톤을 유지한다.
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
  const [spinning, setSpinning] = useState(false);
  const rightContent =
    right === undefined ? (
      <>
        {/* 실시간 표시(빨간 점)는 제거됨 */}
        <button
          type="button"
          aria-label="새로고침"
          onClick={() => {
            setSpinning(true);
            setTimeout(() => setSpinning(false), 700);
            toast("최신 시세로 업데이트했어요");
          }}
          className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
        >
          <RefreshCw
            className={cn(
              "h-5 w-5 transition-transform",
              spinning && "animate-spin",
            )}
          />
        </button>
        <Link
          to="/notifications"
          aria-label="알림"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
        >
          <Bell className="h-5 w-5" />
        </Link>
      </>
    ) : (
      right
    );

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

      {rightContent ? (
        <div className="flex items-center gap-0.5">{rightContent}</div>
      ) : (
        <div className="h-10 w-10" aria-hidden />
      )}
    </header>
  );
}
