import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/**
 * 앱 전역 공통 "조건 선택 카드".
 *
 * - Compact: 2열 그리드에서 사용 (시세 조회, AI 예측)
 * - Full: 1열 가로 긴 카드 (통계, 시장별 비교, 품목/도매시장별 조회, 즐겨찾기 추가)
 *
 * 우측 아이콘 규칙:
 * - navigate: chevron-right (다른 페이지로 이동)
 * - sheet: chevron-down (바텀시트/드롭다운)
 */

type Trigger = "sheet" | "navigate";

function Chevron({ trigger }: { trigger: Trigger }) {
  const Icon = trigger === "sheet" ? ChevronDown : ChevronRight;
  return <Icon className="h-4 w-4 shrink-0 text-[#ADB5BD]" />;
}

/* ------------------------------- Compact -------------------------------- */

export interface CompactSelectCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trigger?: Trigger;
  accent?: "default" | "green";
  onClick?: () => void;
}

const compactBase =
  "flex min-h-16 w-full flex-col items-start gap-1 rounded-[12px] border bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]";

export function CompactSelectCard({
  icon,
  label,
  value,
  trigger = "sheet",
  accent = "default",
  onClick,
}: CompactSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        compactBase,
        accent === "green" ? "border-[#3A8A3A]/40 bg-[#F0F9F0]" : "border-[#E9ECEF]",
      )}
    >
      <span className="flex items-center gap-1 text-[11px] font-medium text-[#868E96]">
        {icon}
        {label}
      </span>
      <span className="flex w-full items-center justify-between">
        <span
          className={cn(
            "truncate text-[14px] font-bold",
            accent === "green" ? "text-[#1F5C1F]" : "text-foreground",
          )}
        >
          {value}
        </span>
        <Chevron trigger={trigger} />
      </span>
    </button>
  );
}

/* --------------------------------- Full --------------------------------- */

export interface FullSelectCardProps {
  icon: ReactNode;
  label: string;
  value?: string;
  placeholder?: string;
  trigger?: Trigger;
  onClick?: () => void;
  to?: "/crop-select";
  search?: { from: string; return: string };
}

const fullBase =
  "flex w-full items-center gap-3 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-3 text-left active:bg-[#F8F9FA]";

function FullInner({
  icon,
  label,
  value,
  placeholder,
  trigger,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  placeholder?: string;
  trigger: Trigger;
}) {
  return (
    <>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[#495057]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium text-[#868E96]">{label}</span>
        <span
          className={cn(
            "block truncate text-[14px] font-bold",
            value ? "text-foreground" : "text-[#ADB5BD]",
          )}
        >
          {value ?? placeholder ?? "선택"}
        </span>
      </span>
      <Chevron trigger={trigger} />
    </>
  );
}

export function FullSelectCard({
  icon,
  label,
  value,
  placeholder,
  trigger = "sheet",
  onClick,
  to,
  search,
}: FullSelectCardProps) {
  if (to && search) {
    return (
      <Link to={to} search={search} className={fullBase}>
        <FullInner
          icon={icon}
          label={label}
          value={value}
          placeholder={placeholder}
          trigger="navigate"
        />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={fullBase}>
      <FullInner
        icon={icon}
        label={label}
        value={value}
        placeholder={placeholder}
        trigger={trigger}
      />
    </button>
  );
}
