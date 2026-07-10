import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 앱 전역 공통 "더보기" 버튼.
 * 표/리스트가 페이지당 최대 50개까지 노출되고, 그 이상이 있을 때만 표시한다.
 * 라벨은 항상 "더보기" + 우측 chevron-down. 부가 텍스트(N건 중 M건 등) 금지.
 */
export function LoadMoreButton({
  onClick,
  className,
  ariaLabel = "더보기",
}: {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "mt-3 flex h-11 w-full items-center justify-center gap-1 rounded-[10px] border border-[#E9ECEF] bg-white text-[13px] font-semibold text-[#495057] active:bg-secondary",
        className,
      )}
    >
      더보기
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

/** 표/리스트 페이지 크기 표준값. */
export const LIST_PAGE_SIZE = 50;
