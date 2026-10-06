import { useState } from "react";
import { Calendar, ChevronDown, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { toKg, unitKgOf, type AmountUnit } from "@/lib/units";
import { getWeatherForDate } from "@/lib/mock/weather";
import type { PredictionViewpoint } from "../types";

export interface CompareCombo {
  dateIso: string;
  marketId: string;
  marketName: string;
  /** 시장 소재지 (날씨 지역) */
  marketRegion: string;
  price?: number;
}

interface Props {
  viewpoint: PredictionViewpoint;
  baseUnitLabel: string;
  quantityBoxes: number;
  quantityUnitLabel?: string;
  quantityUnit?: AmountUnit;
  cropName: string;
  combos: CompareCombo[];
  datePickerValue: string;
  marketPickerValue: string;
  onPickDate: () => void;
  onPickMarket: () => void;
}

function md(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}/${d}`;
}

function regionShort(region: string, marketName: string) {
  const r = region.replace(/(특별시|광역시|특별자치시|특별자치도|도)$/, "");
  return r || marketName.replace(/(도매시장|시장).*$/, "");
}

export function PredictionCompareCards({
  viewpoint,
  baseUnitLabel,
  quantityBoxes,
  quantityUnitLabel = "kg",
  quantityUnit = "kg",
  cropName,
  combos,
  datePickerValue,
  marketPickerValue,
  onPickDate,
  onPickMarket,
}: Props) {
  const isFarmer = viewpoint === "farmer";
  const title = isFarmer ? "출하 시점 비교" : "매입 시점 비교";
  const totalLabel = isFarmer ? "예상 판매금액" : "예상 금액";

  const baseUnitKg = unitKgOf(baseUnitLabel) || 1;
  const baseUnitCount = toKg(quantityBoxes, quantityUnit, cropName) / baseUnitKg;

  const ranked = combos
    .filter((c) => c.price !== undefined)
    .map((c) => ({ ...c, total: c.price! * baseUnitCount }))
    .sort((a, b) => b.total - a.total);
  const diff = ranked.length >= 2 ? ranked[0].total - ranked[ranked.length - 1].total : 0;

  return (
    <section>
      <h2 className="mb-2 text-body font-bold text-foreground">{title}</h2>
      <p className="text-meta text-[#6C757D]">
        비교할 날짜 2개와 도매시장을 골라 예상 판매금액 순위를 확인해보세요
      </p>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <PickerButton
          icon={<Calendar className="h-3.5 w-3.5" />}
          label="비교할 날짜 2개"
          value={datePickerValue}
          onClick={onPickDate}
        />
        <PickerButton
          icon={<Store className="h-3.5 w-3.5" />}
          label="비교할 도매시장(선택, 최대 2개)"
          value={marketPickerValue}
          onClick={onPickMarket}
        />
      </div>

      {ranked.length >= 2 ? (
        <div
          className="mt-2 flex items-center justify-between rounded-2xl px-4 py-3 text-white shadow-[0_10px_28px_-14px_rgba(46,158,107,0.6)]"
          style={{ background: "linear-gradient(135deg,#2E9E6B 0%,#1F7A50 100%)" }}
        >
          <div className="text-caption font-bold">최고 조합과 최저 조합의 차이</div>
          <div className="flex shrink-0 items-baseline gap-0.5">
            <span className="tabular-nums leading-none" style={{ fontSize: "22px", fontWeight: 900 }}>
              {Math.round(diff).toLocaleString()}
            </span>
            <span className="text-body font-extrabold">원</span>
          </div>
        </div>
      ) : (
        <div className="mt-2 rounded-2xl border border-[#E9ECEF] bg-[#F8F9FA] px-4 py-3 text-caption text-[#6C757D]">
          해당 날짜의 예측 시세가 없습니다.
        </div>
      )}

      <ul className="mt-2 space-y-2">
        {ranked.map((c, idx) => {
          const first = idx === 0;
          const last = idx === ranked.length - 1;
          const badge = first ? "추천·최고" : last ? "최저" : `${idx + 1}위`;
          return (
            <ComboCard
              key={`${c.dateIso}-${c.marketId}`}
              combo={c}
              total={c.total}
              badge={badge}
              highlight={first}
              low={last && !first}
              totalLabel={totalLabel}
              baseUnitLabel={baseUnitLabel}
              qtyText={`${quantityBoxes.toLocaleString()}${quantityUnitLabel}`}
            />
          );
        })}
      </ul>
    </section>
  );
}

function ComboCard({
  combo,
  total,
  badge,
  highlight,
  low,
  totalLabel,
  baseUnitLabel,
  qtyText,
}: {
  combo: CompareCombo;
  total: number;
  badge: string;
  highlight: boolean;
  low: boolean;
  totalLabel: string;
  baseUnitLabel: string;
  qtyText: string;
}) {
  const [open, setOpen] = useState(false);
  const w = getWeatherForDate(`${combo.dateIso}|${combo.marketId}`);
  const region = regionShort(combo.marketRegion, combo.marketName);
  return (
    <li
      className={cn(
        "rounded-2xl border bg-white p-3",
        highlight ? "border-2 border-[#2E9E6B] bg-[#EAF7F0]" : "border-[#E9ECEF]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-caption font-bold text-foreground">
            {md(combo.dateIso)} · {combo.marketName}
          </div>
          <div className="mt-0.5 text-meta text-[#6C757D]">
            {combo.price!.toLocaleString()}원/{baseUnitLabel} · {qtyText}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-meta font-bold",
            highlight
              ? "bg-[#2E9E6B] text-white"
              : low
                ? "bg-[#F1F3F5] text-[#868E96]"
                : "bg-[#E7F5EE] text-[#1F7A50]",
          )}
        >
          {badge}
        </span>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-meta text-[#495057]">{totalLabel}</span>
        <span className="text-body-lg font-black tabular-nums text-foreground">
          {Math.round(total).toLocaleString()}원
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-2 flex min-h-9 w-full items-center justify-between border-t border-[#F1F3F5] pt-2 text-meta font-semibold text-[#495057]"
      >
        주의 정보
        <ChevronDown className={cn("h-4 w-4 text-[#868E96] transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="mt-1 flex items-start gap-2 rounded-xl bg-[#F8F9FA] px-3 py-2">
          <span className="text-body leading-none">{w.icon}</span>
          <p className="min-w-0 flex-1 text-meta leading-snug text-[#495057]">
            {region} · {w.temp}° {w.condition}
            {w.impact === "high" ? " — 강수 예보로 출하 지연 가능성이 있어요" : " — 출하 특이사항 없어요"}
          </p>
        </div>
      ) : null}
    </li>
  );
}

function PickerButton({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-16 flex-col items-start gap-1 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-2.5 text-left active:bg-[#F8F9FA]"
    >
      <span className="flex items-center gap-1 text-meta font-semibold text-[#868E96]">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span className="flex w-full items-center justify-between gap-1 text-body font-bold text-foreground">
        <span className="truncate">{value}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[#868E96]" />
      </span>
    </button>
  );
}
