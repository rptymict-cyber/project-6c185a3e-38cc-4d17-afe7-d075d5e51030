// Auction record mock for simple-mode view.
// Deterministically generates a list of auction lots for a given filter
// combination (item/variety/market/date) so re-selection is stable.

export type AuctionRecord = {
  id: string;
  auctionTime: string; // ISO-like "2026-07-05 23:15:14"
  auctionDate: string; // "2026-07-05"
  auctionClock: string; // "23:15"
  category: string; // 부류
  cropName: string; // 품목
  varietyName: string; // 품종
  packageKg: number; // 규격 kg
  packageLabel: string; // "8kg"
  price: number; // 경락가
  pricePerKg: number; // 자동 환산
  count: number; // 건수
  marketName: string; // 도매시장
  corporationName: string; // 도매법인
  origin: string; // 출하지
};

const ORIGINS = [
  { region: "경기 여주시", weight: 65 },
  { region: "경기 이천시", weight: 40 },
  { region: "경기 안성시", weight: 9 },
  { region: "강원 춘천시", weight: 6 },
  { region: "전남 나주시", weight: 8 },
];

const CORPORATIONS: Record<string, string[]> = {
  "seoul-garak": ["서울청과㈜", "중앙청과㈜", "동화청과㈜", "농협가락㈜"],
  "seoul-gangseo": ["강서청과㈜", "농협강서㈜"],
  "busan-eomgung": ["엄궁청과㈜"],
  "busan-banyeo": ["반여청과㈜"],
  "daegu-bugbu": ["북부청과㈜", "대구농협㈜"],
  "gwangju-seobu": ["광주원협㈜"],
  all: ["서울청과㈜", "중앙청과㈜", "강서청과㈜"],
};

const PACKAGES = [
  { kg: 8, label: "8kg", weight: 93 },
  { kg: 5, label: "5kg", weight: 1 },
];

// Deterministic RNG ----------------------------------------------------------
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
function seeded(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pickWeighted<T extends { weight: number }>(arr: T[], r: number): T {
  const total = arr.reduce((s, i) => s + i.weight, 0);
  let x = r * total;
  for (const item of arr) {
    x -= item.weight;
    if (x <= 0) return item;
  }
  return arr[arr.length - 1];
}

function pad(n: number) { return String(n).padStart(2, "0"); }

// -- generator --------------------------------------------------------------

export type AuctionFilter = {
  categoryLabel: string;
  itemLabel: string;
  varietyLabel: string;
  marketLabel: string;
  marketId: string;
  date: string; // yyyy-mm-dd (base auction date shown in list)
  origin?: string; // "all" or region
  packageLabel?: string; // "all" or "8kg"
};

/** Base list before secondary filters. Count varies by combination. */
export function listAuctions(f: AuctionFilter): AuctionRecord[] {
  const key = `${f.itemLabel}|${f.varietyLabel}|${f.marketId}|${f.date}`;
  const rand = seeded(hash(key));
  // 30 ~ 110 records deterministic
  const total = 30 + Math.floor(rand() * 80);

  const corps = CORPORATIONS[f.marketId] ?? CORPORATIONS.all;

  const out: AuctionRecord[] = [];
  const baseDate = new Date(f.date + "T23:59:00");
  for (let i = 0; i < total; i++) {
    const r = seeded(hash(`${key}|${i}`));
    const pkg = pickWeighted(PACKAGES, r());
    const origin = pickWeighted(ORIGINS, r()).region;
    const corp = corps[Math.floor(r() * corps.length)];

    const perKg = 700 + Math.round(r() * 400); // 700 ~ 1100 원/kg
    const price = Math.round((perKg * pkg.kg) / 10) * 10;
    const count = 1 + Math.floor(r() * 90);

    // spread times across the auction day, evening heavy
    const minutesBack = Math.floor(r() * 60 * 8); // last 8h
    const t = new Date(baseDate.getTime() - minutesBack * 60_000);
    const auctionDate = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
    const auctionClock = `${pad(t.getHours())}:${pad(t.getMinutes())}`;
    const auctionTime = `${auctionDate} ${auctionClock}:${pad(Math.floor(r() * 60))}`;

    out.push({
      id: `${f.marketId}-${f.date}-${i}`,
      auctionTime,
      auctionDate,
      auctionClock,
      category: f.categoryLabel,
      cropName: f.itemLabel,
      varietyName: f.varietyLabel,
      packageKg: pkg.kg,
      packageLabel: pkg.label,
      price,
      pricePerKg: Math.round(price / pkg.kg),
      count,
      marketName: f.marketLabel,
      corporationName: corp,
      origin,
    });
  }

  // Sort by time desc by default
  out.sort((a, b) => b.auctionTime.localeCompare(a.auctionTime));
  return out;
}

export function applySecondaryFilters(
  records: AuctionRecord[],
  origin: string,
  packageLabel: string,
): AuctionRecord[] {
  return records.filter((r) => {
    if (origin !== "all" && r.origin !== origin) return false;
    if (packageLabel !== "all" && r.packageLabel !== packageLabel) return false;
    return true;
  });
}

export function countBy<T>(arr: T[], key: (r: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of arr) {
    const k = key(r);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export type AuctionSummary = {
  totalCount: number; // 총 수량 (sum of count)
  avgPrice: number; // 건당 평균가
  avgPricePerKg: number; // kg당 평균가
};

export function summarize(records: AuctionRecord[]): AuctionSummary {
  if (records.length === 0) return { totalCount: 0, avgPrice: 0, avgPricePerKg: 0 };
  const totalCount = records.reduce((s, r) => s + r.count, 0);
  const avgPrice = Math.round(
    records.reduce((s, r) => s + r.price, 0) / records.length,
  );
  const avgPricePerKg = Math.round(
    records.reduce((s, r) => s + r.pricePerKg, 0) / records.length,
  );
  return { totalCount, avgPrice, avgPricePerKg };
}

// -- lookup for detail page -------------------------------------------------

/**
 * Reconstruct a single record from an id.
 * IDs are `${marketId}-${yyyy-mm-dd}-${index}`. The market label / item label /
 * variety label / category label live in the current filter store; the detail
 * route receives them via search params, but we still need the record fields.
 */
export function getAuctionById(
  id: string,
  labels: {
    categoryLabel: string;
    itemLabel: string;
    varietyLabel: string;
    marketLabel: string;
  },
): AuctionRecord | undefined {
  // parse id: last "-<index>" and preceding "-yyyy-mm-dd"
  const m = id.match(/^(.+)-(\d{4}-\d{2}-\d{2})-(\d+)$/);
  if (!m) return undefined;
  const marketId = m[1];
  const date = m[2];
  const list = listAuctions({
    categoryLabel: labels.categoryLabel,
    itemLabel: labels.itemLabel,
    varietyLabel: labels.varietyLabel,
    marketLabel: labels.marketLabel,
    marketId,
    date,
  });
  return list.find((r) => r.id === id);
}
