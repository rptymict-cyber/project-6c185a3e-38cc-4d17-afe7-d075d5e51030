import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-[#EDF0F2]", className)} />;
}

/** 시세 요약 카드 로딩 자리표시 */
export function SummaryCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[16px] border border-[#E9ECEF] bg-white p-4", className)}>
      <Block className="h-4 w-24" />
      <Block className="mt-3 h-7 w-40" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Block className="h-12" />
        <Block className="h-12" />
        <Block className="h-12" />
      </div>
    </div>
  );
}

/** 목록/표 로딩 자리표시 */
export function ListSkeleton({ rows = 6, className }: { rows?: number; className?: string }) {
  return (
    <ul className={cn("divide-y divide-[#F1F3F5]", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 py-3">
          <Block className="h-9 w-9 rounded-full" />
          <div className="min-w-0 flex-1">
            <Block className="h-4 w-1/3" />
            <Block className="mt-2 h-3 w-1/2" />
          </div>
          <Block className="h-5 w-16" />
        </li>
      ))}
    </ul>
  );
}

/** 차트 로딩 자리표시 */
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[16px] border border-[#E9ECEF] bg-white p-4", className)}>
      <Block className="h-4 w-28" />
      <Block className="mt-4 h-40 w-full" />
      <div className="mt-3 flex gap-2">
        <Block className="h-3 w-10" />
        <Block className="h-3 w-10" />
        <Block className="h-3 w-10" />
      </div>
    </div>
  );
}
