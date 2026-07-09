import { CATEGORIES, type Crop } from "./crops";
import { resolveCropSubject, resolveRealCrop } from "./crop-resolver";
import { MARKETS, type Market } from "./markets";

export type CompanyAverage = {
  name: string;
  avgKg: number;
  prevAvgKg: number;
  deltaAmount: number;
  deltaPct: number;
  volumeTon: number;
};

export type MarketAverage = {
  id: string;
  name: string;
  region: string;
  avgKg: number;
  prevAvgKg: number;
  deltaAmount: number;
  deltaPct: number;
  volumeTon: number;
  companies: CompanyAverage[];
};

export type RegionGroup = {
  region: string;
  markets: MarketAverage[];
};

export type VarietyMarketAverages = {
  variety: Crop;
  breadcrumb: { categoryLabel: string; itemLabel: string; varietyLabel: string };
  effectiveDate: string;
  effectiveDateLabel: string;
  differentFromRequest: boolean;
  requestedDateLabel: string;
  overall: {
    avgKg: number;
    prevAvgKg: number;
    deltaAmount: number;
    deltaPct: number;
    volumeTon: number;
  };
  regions: RegionGroup[];
};

function hash(str: string): number {
  let s = 0;
  for (const ch of str) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return s;
}

function jitter(seed: number, spread: number): number {
  const x = Math.sin(seed) * 10000;
  return ((x - Math.floor(x)) - 0.5) * 2 * spread;
}

function categoryLabelOf(id: Crop["category"]): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

// Map ISO date → effective trading date. 2025-07-06 (일) is a closed day and
// falls back to 2025-07-05 (토).
function resolveEffective(date: string): {
  effective: string;
  label: string;
  requestedLabel: string;
  different: boolean;
} {
  const closed: Record<string, string> = {
    "2025-07-06": "2025-07-05",
  };
  const fallback = closed[date];
  const iso = fallback ?? date;
  const [, m, d] = iso.split("-");
  const wk = ["일", "월", "화", "수", "목", "금", "토"][new Date(iso).getDay()];
  const label = `${Number(m)}/${Number(d)} (${wk})`;
  const [, rm, rd] = date.split("-");
  const rwk = ["일", "월", "화", "수", "목", "금", "토"][new Date(date).getDay()];
  const requestedLabel = `${Number(rm)}/${Number(rd)} (${rwk})`;
  return {
    effective: iso,
    label,
    requestedLabel,
    different: Boolean(fallback),
  };
}

function unitKgOf(unit: string): number {
  const m = unit.match(/(\d+(?:\.\d+)?)\s*kg/);
  return m ? parseFloat(m[1]) : 1;
}

function buildMarketAverage(
  crop: Crop,
  market: Market,
  seed: number,
): MarketAverage {
  const kgUnit = unitKgOf(crop.unit);
  // Convert crop.currentPrice/kg baseline from unit price to per-kg average.
  const cropPerKg = crop.currentPrice / kgUnit;
  const marketFactor = market.avgKg / 3200; // relative bias vs default market baseline
  const dayJitter = jitter(seed + hash(market.id), 0.07);
  const avgKg = Math.max(50, Math.round(cropPerKg * marketFactor * (1 + dayJitter)));
  const prevPct = jitter(seed + hash(market.id) * 3, 0.08); // ±8%
  const prevAvgKg = Math.max(50, Math.round(avgKg / (1 + prevPct)));
  const deltaAmount = avgKg - prevAvgKg;
  const deltaPct = (deltaAmount / prevAvgKg) * 100;
  const volumeShare = 0.4 + Math.abs(jitter(seed + hash(market.id) * 5, 0.4));
  const volumeTon =
    Math.round(crop.volumeTon * (market.volumeTon / 1240) * volumeShare * 10) / 10;

  const companies: CompanyAverage[] = market.companies.map((co, i) => {
    const coJit = jitter(seed + hash(market.id + co.name), 0.05);
    const coAvg = Math.max(50, Math.round(avgKg * (1 + coJit)));
    const coPrevPct = jitter(seed + hash(market.id + co.name) * 2, 0.09);
    const coPrev = Math.max(50, Math.round(coAvg / (1 + coPrevPct)));
    const coDelta = coAvg - coPrev;
    const coDeltaPct = (coDelta / coPrev) * 100;
    const coVol =
      Math.round(
        (volumeTon / market.companies.length) *
          (0.7 + Math.abs(jitter(seed + hash(market.id + co.name) * 4, 0.4))) *
          10,
      ) / 10;
    void i;
    return {
      name: co.name.endsWith("청과") || co.name.endsWith("농협") ? `${co.name}㈜` : co.name,
      avgKg: coAvg,
      prevAvgKg: coPrev,
      deltaAmount: coDelta,
      deltaPct: coDeltaPct,
      volumeTon: coVol,
    };
  });

  return {
    id: market.id,
    name: market.name,
    region: market.region,
    avgKg,
    prevAvgKg,
    deltaAmount,
    deltaPct,
    volumeTon,
    companies,
  };
}

export function getVarietyMarketAverages(params: {
  varietyId: string;
  date: string;
}): VarietyMarketAverages {
  const subject = resolveCropSubject(params.varietyId);
  const crop = resolveRealCrop(params.varietyId);

  const { effective, label, requestedLabel, different } = resolveEffective(params.date);
  const seed = hash(`${params.varietyId}:${crop.name}:${effective}`);

  const rows = MARKETS.map((m) => buildMarketAverage(crop, m, seed));

  // Group by region preserving MARKETS order.
  const groups = new Map<string, MarketAverage[]>();
  for (const r of rows) {
    if (!groups.has(r.region)) groups.set(r.region, []);
    groups.get(r.region)!.push(r);
  }
  const regions: RegionGroup[] = Array.from(groups.entries()).map(([region, markets]) => ({
    region,
    markets,
  }));

  const totalVol = rows.reduce((s, r) => s + r.volumeTon, 0);
  const weightedAvg = totalVol > 0
    ? rows.reduce((s, r) => s + r.avgKg * r.volumeTon, 0) / totalVol
    : rows.reduce((s, r) => s + r.avgKg, 0) / rows.length;
  const weightedPrev = totalVol > 0
    ? rows.reduce((s, r) => s + r.prevAvgKg * r.volumeTon, 0) / totalVol
    : rows.reduce((s, r) => s + r.prevAvgKg, 0) / rows.length;
  const avgKg = Math.round(weightedAvg);
  const prevAvgKg = Math.round(weightedPrev);
  const deltaAmount = avgKg - prevAvgKg;
  const deltaPct = prevAvgKg > 0 ? (deltaAmount / prevAvgKg) * 100 : 0;

  // 카탈로그 기반 라벨을 우선 사용. CROPS mock에만 있으면 예전 로직으로 fallback.
  const categoryLabel = subject.categoryLabel || categoryLabelOf(crop.category);

  return {
    variety: crop,
    breadcrumb: {
      categoryLabel,
      itemLabel: subject.itemLabel,
      varietyLabel: subject.varietyLabel,
    },
    effectiveDate: effective,
    effectiveDateLabel: label,
    differentFromRequest: different,
    requestedDateLabel: requestedLabel,
    overall: {
      avgKg,
      prevAvgKg,
      deltaAmount,
      deltaPct,
      volumeTon: Math.round(totalVol * 10) / 10,
    },
    regions,
  };
}
