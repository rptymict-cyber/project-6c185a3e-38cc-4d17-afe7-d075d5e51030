import { AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * 공통 오류 상태.
 *
 * - 무엇이 실패했는지(title) + 사용자가 할 수 있는 다음 행동(다시 시도 / 이동)을 항상 함께 제시한다.
 * - 데이터 조회 실패, 빈 응답과 구분되는 "오류" 상태에만 사용한다.
 */
export function ErrorState({
  title = "정보를 불러오지 못했어요",
  description = "네트워크 상태를 확인한 뒤 다시 시도해 주세요.",
  onRetry,
  secondary,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  secondary?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF5F5] text-[#E03131]">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <h2 className="mt-3 text-body-lg font-bold text-foreground">{title}</h2>
      <p className="mt-1.5 text-body text-muted-foreground">{description}</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-body font-bold text-primary-foreground active:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </button>
        )}
        {secondary && (
          <Link
            to={secondary.to}
            className="inline-flex min-h-11 items-center rounded-xl border border-[#E9ECEF] px-4 text-body font-bold text-foreground active:bg-[#F8F9FA]"
          >
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}
