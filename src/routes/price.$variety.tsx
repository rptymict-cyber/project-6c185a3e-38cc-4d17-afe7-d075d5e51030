import { useMemo, useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, Bell, ChevronRight, MoreHorizontal, Search, Star, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PriceVolumeChart } from "@/components/market-v2/PriceVolumeChart";
import { AuctionHistoryTable } from "@/components/market-v2/AuctionHistoryTable";
import { getCrop } from "@/lib/mock/crops";
import { getMarketQuote, getPriceVolumeSeries } from "@/lib/mock/market-analysis";
import {
  getCompanyBreakdown,
  getMarketCompare,
  getOriginBreakdown,
  getVarietyBreakdown,
  type DetailPeriod,
} from "@/lib/mock/variety-detail";
import { useAlerts } from "@/store/alerts";
import { useMarketFilter } from "@/store/market";
import { useWatchlist } from "@/store/watchlist";
import { cn } from "@/lib/utils";


const EMOJI: Record<string, string> = {
  eggplant: "🍆",
  cucumber: "🥒",
  tomato: "🍅",
  watermelon: "🍉",
  apple: "🍎",
  pear: "🍐",
  grape: "🍇",
  cabbage: "🥬",
  lettuce: "🥗",
  garlic: "🧄",
  onion: "🧅",
  chili: "🌶️",
  radish: "🥕",
  carrot: "🥕",
};

export const Route = createFileRoute("/price/$variety")({
  component: VarietyDetailPage,
  head: () => ({
    meta: [
      { title: "품종 시세 상세 — AGDICT" },
      { name: "description", content: "품종별 실시간 시세, 시장·법인·산지 비교." },
    ],
  }),
});

type Tab = "chart" | "auctions" | "compare" | "company" | "origin" | "variety";
const TABS: { id: Tab; label: string }[] = [
  { id: "chart", label: "차트" },
  { id: "auctions", label: "경매내역" },
  { id: "compare", label: "시장비교" },
  { id: "company", label: "법인" },
  { id: "origin", label: "산지" },
  { id: "variety", label: "품종" },
];

const PERIODS: { id: DetailPeriod; label: string }[] = [
  { id: "today", label: "오늘" },
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
  { id: "1y", label: "1년" },
];

function VarietyDetailPage() {
  const { variety } = Route.useParams();
  const router = useRouter();
  const navigate = useNavigate();
  const f = useMarketFilter();
  const setSimpleMode = useMarketFilter((s) => s.setSimpleMode);

  const emoji = EMOJI[f.itemId] ?? "🌾";

  const quote = useMemo(
    () =>
      getMarketQuote({
        itemId: f.itemId,
        varietyId: variety,
        marketId: f.marketId,
        unit: f.unit,
        date: f.date,
      }),
    [f.itemId, variety, f.marketId, f.unit, f.date],
  );

  const [tab, setTab] = useState<Tab>("chart");
  const [period, setPeriod] = useState<DetailPeriod>("1w");

  const starred = useWatchlist((s) => s.crops.includes(variety));
  const toggleCrop = useWatchlist((s) => s.toggleCrop);
  const hasAlert = useAlerts((s) => s.hasAnyFor(variety, f.marketId));
  const crop = getCrop(f.itemId);
  const isPredictable = Boolean(
    crop?.isPredictable && crop.predictionStatus === "available",
  );


  const up = quote.prevPct > 0;
  const flat = quote.prevPct === 0;
  const changeColor = flat ? "text-[#6C757D]" : up ? "text-[#E03131]" : "text-[#1971C2]";
  const changeAmount = Math.abs(Math.round((quote.price * quote.prevPct) / 100));
  const pricePerKg = Math.round(quote.price / unitKg(quote.unit));

  return (
    <AppShell
      header={
        <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-[#E9ECEF] bg-background px-2">
          <button
            aria-label="뒤로"
            onClick={() => router.history.back()}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-0.5">
            <button
              aria-label="즐겨찾기"
              onClick={() => {
                const added = toggleCrop(variety);
                toast(added ? "즐겨찾기에 추가했어요" : "즐겨찾기에서 삭제했어요");
              }}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Star
                className={cn(
                  "h-5 w-5",
                  starred ? "fill-[#F59F00] text-[#F59F00]" : "text-[#868E96]",
                )}
              />
            </button>
            <button
              aria-label="가격 알림 설정"
              onClick={() => navigate({ to: "/price/$variety/alert", params: { variety } })}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Bell className={cn("h-5 w-5", hasAlert ? "text-[#3A8A3A]" : "text-[#868E96]")} />
            </button>

            <button
              aria-label="더보기"
              onClick={() => toast("더보기 메뉴는 준비 중입니다")}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <MoreHorizontal className="h-5 w-5 text-[#495057]" />
            </button>
          </div>
        </header>
      }
    >
      {/* Title area */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <h1 className="text-[19px] font-black tracking-tight text-foreground">
            {emoji} {f.varietyLabel}
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F3F5] px-2 py-0.5 text-[11px] font-semibold text-[#495057]">
            {f.itemLabel} · {f.categoryLabel}
            <Search className="h-3 w-3" />
          </span>
        </div>

        <div className="mt-3 flex items-end gap-1.5">
          <span className="text-[32px] font-black leading-none tracking-tight text-foreground">
            {quote.price.toLocaleString()}
          </span>
          <span className="text-[14px] font-semibold text-foreground">원</span>
          <span className="pb-0.5 text-[12px] text-[#6C757D]">
            / {quote.unit.replace(" 기준", "")}
          </span>
          <span className="mb-0.5 ml-1 inline-flex items-center rounded-full bg-[#F1F3F5] px-2 py-0.5 text-[11px] font-semibold text-[#495057]">
            kg당 {pricePerKg.toLocaleString()}원
          </span>
        </div>

        <div className={cn("mt-1.5 flex items-center gap-2 text-[13px]", changeColor)}>
          <span className="inline-flex items-center gap-0.5 font-bold">
            {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {changeAmount.toLocaleString()}원 ({up ? "+" : ""}{quote.prevPct.toFixed(1)}%)
          </span>
          <span className="text-[11.5px] text-[#868E96]">
            전일 대비 · {f.marketLabel} · {quote.effectiveLabel.replace(" 경매 기준", " 경매 기준")}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 border-b border-[#E9ECEF]">
        <div className="no-scrollbar flex overflow-x-auto px-2">
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

      {tab === "chart" && (
        <ChartTab
          variety={variety}
          period={period}
          setPeriod={setPeriod}
          quote={quote}
          onOpenSimple={() => {
            setSimpleMode(true);
            navigate({ to: "/market" });
          }}
        />
      )}
      {tab === "auctions" && <AuctionHistoryTable />}
      {tab === "compare" && <CompareTab variety={variety} unit={f.unit} />}
      {tab === "company" && (
        <CompanyTab variety={variety} marketId={f.marketId} unit={f.unit} />
      )}
      {tab === "origin" && (
        <OriginTab variety={variety} marketId={f.marketId} unit={f.unit} />
      )}
      {tab === "variety" && (
        <VarietyTab itemLabel={f.itemLabel} currentVarietyLabel={f.varietyLabel} />
      )}

      <AlertSettingsSheet
        open={alertOpen}
        onOpenChange={setAlertOpen}
        varietyId={variety}
        marketId={f.marketId}
        varietyLabel={f.varietyLabel}
        marketLabel={f.marketLabel}
        targetPrice={7000}
      />
    </AppShell>
  );
}

// -- tabs -------------------------------------------------------------------

function ChartTab({
  period,
  setPeriod,
  quote,
  onOpenSimple,
}: {
  variety: string;
  period: DetailPeriod;
  setPeriod: (p: DetailPeriod) => void;
  quote: ReturnType<typeof getMarketQuote>;
  onOpenSimple: () => void;
}) {
  const f = useMarketFilter();
  const seriesPeriod = (period === "all" ? "1y" : period) as
    | "today" | "1w" | "1m" | "3m" | "1y";
  const series = getPriceVolumeSeries({
    itemId: f.itemId,
    varietyId: f.varietyId,
    marketId: f.marketId,
    unit: f.unit,
    date: f.date,
    period: seriesPeriod,
  });
  return (
    <div className="px-3 pt-3">
      <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto">
        {PERIODS.map((p) => {
          const active = p.id === period;
          return (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                active ? "bg-[#1F5C1F] text-white" : "bg-[#F1F3F5] text-[#6C757D]",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-[12px] border border-[#F1F3F5] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <PriceVolumeChart series={series} period={seriesPeriod} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <SummaryCard label="최고가" value={`${series.max.toLocaleString()}원`} tone="up" />
        <SummaryCard label="최저가" value={`${series.min.toLocaleString()}원`} tone="down" />
        <SummaryCard label="평균가" value={`${series.avg.toLocaleString()}원`} tone="neutral" />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1 rounded-[10px] bg-[#F8F9FA] px-1 py-3">
        <Stat label="전일 대비" value={fmtPct(quote.prevPct)} tone={toneOf(quote.prevPct)} />
        <Stat label="전주 대비" value={fmtPct(quote.weekPct)} tone={toneOf(quote.weekPct)} />
        <Stat label="전년 동기" value={fmtPct(quote.yearPct)} tone={toneOf(quote.yearPct)} />
        <Stat label="거래량" value={`${quote.volumeTon.toFixed(1)}t`} tone="neutral" />
      </div>

      <div className="mt-4 border-t border-[#F1F3F5]">
        <button
          onClick={onOpenSimple}
          className="flex w-full items-center justify-center gap-1 py-4 text-[13px] font-semibold text-[#3A8A3A]"
        >
          일별·경매 내역 보기
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "up" | "down" | "neutral";
}) {
  const color =
    tone === "up" ? "text-[#E03131]" : tone === "down" ? "text-[#1971C2]" : "text-foreground";
  return (
    <div className="rounded-[10px] border border-[#F1F3F5] bg-white px-3 py-2.5 text-center">
      <div className="text-[10.5px] text-[#868E96]">{label}</div>
      <div className={cn("mt-0.5 text-[13.5px] font-bold", color)}>{value}</div>
    </div>
  );
}


function CompareTab({ variety, unit }: { variety: string; unit: string }) {
  const rows = getMarketCompare({ varietyId: variety, unit });
  return (
    <TableCard>
      <thead>
        <Tr head>
          <Th align="left">시장</Th>
          <Th>현재가</Th>
          <Th>전일</Th>
          <Th>거래량</Th>
          <Th>점유율</Th>
        </Tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <Tr key={r.marketId}>
            <Td align="left" bold>
              {r.marketName}
            </Td>
            <Td bold>{r.price.toLocaleString()}</Td>
            <Td className={colorOf(r.prevPct)}>{fmtPct(r.prevPct)}</Td>
            <Td>{r.volumeTon.toFixed(1)}t</Td>
            <Td>{r.sharePct.toFixed(1)}%</Td>
          </Tr>
        ))}
      </tbody>
    </TableCard>
  );
}

function CompanyTab({
  variety,
  marketId,
  unit,
}: {
  variety: string;
  marketId: string;
  unit: string;
}) {
  const rows = getCompanyBreakdown({ varietyId: variety, marketId, unit });
  return (
    <TableCard>
      <thead>
        <Tr head>
          <Th align="left">도매법인</Th>
          <Th>평균가</Th>
          <Th>전일</Th>
          <Th>거래 건수</Th>
        </Tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <Tr key={r.name}>
            <Td align="left" bold>
              {r.name}
            </Td>
            <Td bold>{r.avgPrice.toLocaleString()}</Td>
            <Td className={colorOf(r.prevPct)}>{fmtPct(r.prevPct)}</Td>
            <Td>{r.count}건</Td>
          </Tr>
        ))}
      </tbody>
    </TableCard>
  );
}

function OriginTab({
  variety,
  marketId,
  unit,
}: {
  variety: string;
  marketId: string;
  unit: string;
}) {
  const rows = getOriginBreakdown({ varietyId: variety, marketId, unit });
  return (
    <TableCard>
      <thead>
        <Tr head>
          <Th align="left">출하지</Th>
          <Th>평균가</Th>
          <Th>건수</Th>
          <Th>비중</Th>
        </Tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <Tr key={r.region}>
            <Td align="left" bold>
              {r.region}
            </Td>
            <Td bold>{r.avgPrice.toLocaleString()}</Td>
            <Td>{r.count}건</Td>
            <Td>{r.sharePct}%</Td>
          </Tr>
        ))}
      </tbody>
    </TableCard>
  );
}

function VarietyTab({
  itemLabel,
  currentVarietyLabel,
}: {
  itemLabel: string;
  currentVarietyLabel: string;
}) {
  const rows = getVarietyBreakdown({ itemLabel, currentVarietyLabel });
  return (
    <TableCard>
      <thead>
        <Tr head>
          <Th align="left">품종</Th>
          <Th>현재가(kg당)</Th>
          <Th>전일</Th>
          <Th>거래량</Th>
        </Tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <Tr key={r.name}>
            <Td align="left" bold className={r.current ? "text-[#1F5C1F]" : ""}>
              {r.name}
              {r.current && (
                <span className="ml-1 rounded bg-[#D6F0D6] px-1 py-0.5 text-[10px] font-bold text-[#1F5C1F]">
                  현재
                </span>
              )}
            </Td>
            <Td bold>{r.pricePerKg.toLocaleString()}원</Td>
            <Td className={colorOf(r.prevPct)}>{fmtPct(r.prevPct)}</Td>
            <Td>{r.volumeTon.toFixed(1)}t</Td>
          </Tr>
        ))}
      </tbody>
    </TableCard>
  );
}

// -- shared -----------------------------------------------------------------

function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 mt-4 overflow-hidden rounded-[10px] border border-[#E9ECEF]">
      <table className="w-full table-fixed text-[12px]">{children}</table>
    </div>
  );
}
function Tr({ head, children }: { head?: boolean; children: React.ReactNode }) {
  return (
    <tr className={cn(head ? "bg-[#F8F9FA] text-[#6C757D]" : "border-t border-[#F1F3F5]")}>
      {children}
    </tr>
  );
}
function Th({ align = "right", children }: { align?: "left" | "right"; children: React.ReactNode }) {
  return (
    <th
      className={cn(
        "py-2 px-2 font-semibold",
        align === "left" ? "text-left" : "text-right",
      )}
    >
      {children}
    </th>
  );
}
function Td({
  align = "right",
  bold,
  className,
  children,
}: {
  align?: "left" | "right";
  bold?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <td
      className={cn(
        "py-2.5 px-2",
        align === "left" ? "text-left" : "text-right",
        bold ? "font-bold text-foreground" : "text-[#495057]",
        className,
      )}
    >
      {children}
    </td>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "up" | "down" | "neutral" }) {
  const color = tone === "up" ? "text-[#E03131]" : tone === "down" ? "text-[#1971C2]" : "text-foreground";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10.5px] text-[#868E96]">{label}</span>
      <span className={cn("text-[13px] font-bold", color)}>{value}</span>
    </div>
  );
}

function fmtPct(v: number): string {
  if (v === 0) return "0%";
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}
function toneOf(v: number): "up" | "down" | "neutral" {
  if (v > 0) return "up";
  if (v < 0) return "down";
  return "neutral";
}
function colorOf(v: number): string {
  if (v > 0) return "text-[#E03131]";
  if (v < 0) return "text-[#1971C2]";
  return "text-[#6C757D]";
}
function unitKg(unit: string): number {
  const m = unit.match(/(\d+(?:\.\d+)?)\s*kg/);
  return m ? parseFloat(m[1]) : 1;
}

// Suppress unused Link import (kept for future navigation additions)
void Link;
