import { CATEGORIES, CROPS, type Category, type Crop } from "./crops";

export type StatVariety = Crop & {
  changePct: number;
  representativeMarket: string;
  categoryLabel: string;
};

const MARKETS = [
  "서울가락",
  "대구북부",
  "부산엄궁",
  "광주각화",
  "인천삼산",
  "구리시장",
  "안동시장",
];

function marketFor(crop: Crop): string {
  const idx = crop.id.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0) % MARKETS.length;
  return MARKETS[idx];
}

function categoryLabel(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

// Deterministic per-date jitter so switching date changes ranking a bit.
function dateSeed(iso: string): number {
  return iso.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0);
}

function jitter(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x);
  return min + r * (max - min);
}

export function getStatVarieties(date: string): StatVariety[] {
  const ds = dateSeed(date);
  return CROPS.map((c, i) => {
    const jitterPct = jitter(ds + i * 13, -3, 3);
    const basePct = ((c.currentPrice - c.prevPrice) / c.prevPrice) * 100 + jitterPct;
    const volumeAdj = c.volumeTon * (1 + jitter(ds + i * 7, -0.15, 0.15));
    return {
      ...c,
      volumeTon: Math.round(volumeAdj * 10) / 10,
      changePct: Math.round(basePct * 10) / 10,
      representativeMarket: marketFor(c),
      categoryLabel: categoryLabel(c.category),
    };
  });
}

export type RankMode = "up" | "down" | "volume";

export function getRanking(
  date: string,
  mode: RankMode,
  category: Category | "all" = "all",
): StatVariety[] {
  const rows = getStatVarieties(date).filter(
    (r) => category === "all" || r.category === category,
  );
  const sorted = [...rows];
  if (mode === "up") sorted.sort((a, b) => b.changePct - a.changePct);
  else if (mode === "down") sorted.sort((a, b) => a.changePct - b.changePct);
  else sorted.sort((a, b) => b.volumeTon - a.volumeTon);
  return sorted.slice(0, 10);
}

export type CategorySummary = {
  id: Category;
  label: string;
  count: number;
  upCount: number;
  downCount: number;
  avgChangePct: number;
};

export function getCategorySummaries(date: string): CategorySummary[] {
  const rows = getStatVarieties(date);
  return CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
    const items = rows.filter((r) => r.category === cat.id);
    const up = items.filter((r) => r.changePct > 0.05).length;
    const down = items.filter((r) => r.changePct < -0.05).length;
    const avg =
      items.length > 0 ? items.reduce((s, r) => s + r.changePct, 0) / items.length : 0;
    return {
      id: cat.id as Category,
      label: cat.label,
      count: items.length,
      upCount: up,
      downCount: down,
      avgChangePct: Math.round(avg * 10) / 10,
    };
  });
}
