import { useEffect, useMemo, useState } from "react";
import {
  createFileRoute,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { DetailHeader } from "@/components/detail-header";
import { AppShell } from "@/components/app-shell";
import { DatePickerSheet, defaultTradingDayFilter } from "@/components/date-picker-sheet";
import { MarketAveragesTable } from "@/components/statistics/MarketAveragesTable";
import { TrendTab } from "@/components/statistics/TrendTab";
import { VolumeByMarketTab } from "@/components/statistics/VolumeByMarketTab";
// NOTE: 작물(부류/품목/품종) 변경은 /crop-select 페이지가 유일한 진입점.
import { resolveCropSubject } from "@/lib/mock/crop-resolver";
import { getVarietyMarketAverages } from "@/lib/mock/variety-market-averages";
import { useRecentStats } from "@/store/recent-stats";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/statistics/$variety")({
  component: VarietyStatsPage,
  head: () => ({
    meta: [
      { title: "시장별 가격 비교 — AGDICT" },
      { name: "description", content: "품종별 시장별 가격 비교와 거래량 흐름." },
    ],
  }),
});

type Tab = "table" | "chart" | "volume";
const TABS: { id: Tab; label: string }[] = [
  { id: "table", label: "표로 보기" },
  { id: "chart", label: "그래프로 보기" },
  { id: "volume", label: "시장별 거래량" },
];



function VarietyStatsPage() {
  const { variety } = Route.useParams();
  const router = useRouter();
  
  const subject = resolveCropSubject(variety);
  const pushRecent = useRecentStats((s) => s.push);

  // Statistics tab manages its own date state — do NOT share with market tab.
  const [date, setDate] = useState("2025-07-05");
  const [dateOpen, setDateOpen] = useState(false);

  const [tab, setTab] = useState<Tab>("table");

  useEffect(() => {
    pushRecent(variety);
  }, [variety, pushRecent]);

  const data = useMemo(
    () => getVarietyMarketAverages({ varietyId: variety, date }),
    [variety, date],
  );

  void subject;







  return (
    <AppShell
      header={
        <DetailHeader
          title="시장별 가격 비교"
          onBack={() => router.history.back()}
          right={null}
        />
      }
    >

      {/* Breadcrumb chip */}
      <div className="px-4 pt-4">
        <Link
          to="/crop-select"
          search={{
            from: "statistics-detail",
            return: `/statistics/${variety}`,
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F3F5] px-3 py-1.5 text-[12px] font-semibold text-[#495057]"
        >
          <span>{data.breadcrumb.categoryLabel}</span>
          <ChevronRight className="h-3 w-3 text-[#ADB5BD]" />
          <span>{data.breadcrumb.itemLabel}</span>
          <ChevronRight className="h-3 w-3 text-[#ADB5BD]" />
          <span className="text-foreground">{data.breadcrumb.varietyLabel}</span>
          <ChevronDown className="ml-0.5 h-3.5 w-3.5 text-[#6C757D]" />
        </Link>
        {/* Sub-info: 통계 화면은 시장 비교이므로 특정 시장을 고정하지 않음 */}
        <p className="mt-2 text-[11.5px] text-[#868E96]">kg당 평균가 · 경매일 기준</p>
      </div>


      {/* Tabs */}
      <div className="mt-4 border-b border-[#E9ECEF]">
        <div className="flex px-2">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative shrink-0 px-3 py-3 text-[13.5px] font-semibold",
                  active ? "text-foreground" : "text-[#868E96]",
                )}
              >
                {t.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[#3A8A3A]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {tab === "table" && (
        <div className="pb-6">
          {/* Date selector card (matches 시세 탭 조회 날짜 카드) */}
          <div className="px-4 pt-4">
            <button
              type="button"
              onClick={() => setDateOpen(true)}
              className="flex min-h-16 w-full flex-col items-start gap-1 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]"
            >
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#868E96]">
                <Calendar className="h-3.5 w-3.5" />
                조회 날짜
              </span>
              <span className="flex w-full items-center justify-between">
                <span className="truncate text-[14px] font-bold text-foreground">
                  {date.replaceAll("-", ".")}
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#ADB5BD]" />
              </span>
            </button>

            {data.differentFromRequest && (
              <div className="mt-2 rounded-[8px] bg-[#F0F9F0] px-3 py-2 text-[11.5px] font-semibold text-[#1F5C1F]">
                {data.requestedDateLabel} 휴장으로 직전 거래일({data.effectiveDateLabel}) 표시
              </div>
            )}
          </div>


          {/* Summary cards — 전체 평균 / 전일 대비 / 거래량 */}
          <div className="mt-3 grid grid-cols-3 gap-2 px-4">
            <SummaryCard label="전체 평균" value={`${data.overall.avgKg.toLocaleString()}원`} sub="kg당" />
            <SummaryCard
              label="전일 대비"
              value={fmtSigned(data.overall.deltaAmount) + "원"}
              sub={`${data.overall.deltaAmount > 0 ? "▲" : data.overall.deltaAmount < 0 ? "▼" : ""} ${Math.abs(data.overall.deltaPct).toFixed(1)}%`}
              tone={toneOf(data.overall.deltaAmount)}
            />
            <SummaryCard label="거래량" value={`${data.overall.volumeTon.toFixed(1)}t`} sub="총 반입량" />
          </div>
          <p className="mt-2 px-4 text-[11px] text-[#868E96]">* kg당 평균가 기준</p>

          <MarketAveragesTable data={data} />

          <div className="mt-4 mx-4 rounded-[10px] border border-[#E9ECEF] bg-[#F8F9FA] px-3 py-2.5 text-[11.5px] text-[#6C757D]">
            시장 행을 누르면 법인별 평균가를 볼 수 있어요
          </div>

        </div>
      )}

      {tab === "trend" && <TrendTab varietyId={variety} />}


      <DatePickerSheet
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onConfirm={(iso) => setDate(iso)}
        hasDataFor={defaultTradingDayFilter}
      />



    </AppShell>
  );
}

function MinimalHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return <DetailHeader title={label} onBack={onBack} />;
}

function SummaryCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down" | "flat";
}) {
  const color =
    tone === "up" ? "text-[#E03131]" : tone === "down" ? "text-[#1971C2]" : "text-foreground";
  return (
    <div className="rounded-[10px] border border-[#E9ECEF] bg-white px-2 py-2">
      <div className="text-[10.5px] font-semibold text-[#6C757D]">{label}</div>
      <div className={cn("mt-1 text-[13px] font-black tabular-nums leading-tight", color)}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[10px] text-[#868E96]">{sub}</div>}
    </div>
  );
}

function fmtSigned(v: number): string {
  if (v === 0) return "0";
  return `${v > 0 ? "+" : ""}${v.toLocaleString()}`;
}

function toneOf(v: number): "up" | "down" | "flat" {
  if (v > 0) return "up";
  if (v < 0) return "down";
  return "flat";
}
