import {
  getVarietyMarketAverages,
  type VarietyMarketAverages,
} from "@/lib/mock/variety-market-averages";

export type MarketVolumeBreakdown = {
  id: string;
  market: string;
  volume: number; // tons
  ratio: number; // 0..1
};

export type MarketVolumeStats = {
  total: number; // tons
  marketCount: number;
  topMarket: string;
  breakdown: MarketVolumeBreakdown[]; // sorted desc; last item may be "기타"
};

const TOP_N = 5;

/**
 * Server-owned aggregation for market-volume stats.
 * Frontend must not re-aggregate from lower-level rows.
 */
export function getMarketVolumeStats(params: {
  variety: string;
  date: string;
}): MarketVolumeStats {
  const data: VarietyMarketAverages = getVarietyMarketAverages({
    varietyId: params.variety,
    date: params.date,
  });

  const all = data.regions.flatMap((g) => g.markets);
  const total = all.reduce((s, m) => s + m.volumeTon, 0);
  const sorted = [...all].sort((a, b) => b.volumeTon - a.volumeTon);
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);
  const restSum = rest.reduce((s, m) => s + m.volumeTon, 0);

  const breakdown: MarketVolumeBreakdown[] = top.map((m) => ({
    id: m.id,
    market: m.name,
    volume: Math.round(m.volumeTon * 10) / 10,
    ratio: total > 0 ? m.volumeTon / total : 0,
  }));
  if (restSum > 0) {
    breakdown.push({
      id: "__etc",
      market: "기타",
      volume: Math.round(restSum * 10) / 10,
      ratio: total > 0 ? restSum / total : 0,
    });
  }

  return {
    total: Math.round(total * 10) / 10,
    marketCount: all.length,
    topMarket: sorted[0]?.name ?? "-",
    breakdown,
  };
}
