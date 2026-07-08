import type { Crop } from "@/lib/mock/crops";
import type { MarketQuote } from "@/lib/mock/market-analysis";
import type { FavoritePriceItem } from "./types";

type BaseInput = Omit<FavoritePriceItem, "id" | "createdAt">;

/** Build favorite from a full pro-mode market filter + quote. */
export function fromMarketQuote(args: {
  itemId: string;
  itemName: string;
  emoji?: string;
  varietyId?: string;
  varietyName?: string;
  marketId: string;
  marketName: string;
  corporationId?: string;
  corporationName?: string;
  originId?: string;
  originName?: string;
  grade?: string;
  unit: string;
  quote?: MarketQuote;
  isPredictable?: boolean;
  auctionCount?: number;
}): BaseInput {
  const q = args.quote;
  const kgMatch = args.unit.match(/(\d+(?:\.\d+)?)\s*kg/);
  const kg = kgMatch ? parseFloat(kgMatch[1]) : 1;
  const kgPrice = q ? Math.round(q.price / kg) : undefined;
  const changePrice =
    q && q.prevPct ? Math.round((q.price * q.prevPct) / 100) : undefined;
  return {
    cropId: args.itemId,
    cropName: args.itemName,
    emoji: args.emoji,
    varietyId: args.varietyId,
    varietyName: args.varietyName,
    marketId: args.marketId,
    marketName: args.marketName,
    corporationId: args.corporationId,
    corporationName: args.corporationName,
    originId: args.originId,
    originName: args.originName,
    grade: args.grade,
    unit: args.unit,
    price: q?.price,
    kgPrice,
    changePrice,
    changeRate: q?.prevPct,
    tradeDate: q?.effectiveDate,
    updatedAt: q?.updatedAt,
    auctionCount: args.auctionCount,
    totalVolume: q?.volumeTon,
    isPredictable: args.isPredictable,
  };
}

/** Fallback favorite from a simple Crop (home card) — uses default market. */
export function fromCrop(
  crop: Crop,
  opts?: { marketId?: string; marketName?: string; unit?: string },
): BaseInput {
  const changeRate =
    crop.prevPrice > 0
      ? +(((crop.currentPrice - crop.prevPrice) / crop.prevPrice) * 100).toFixed(1)
      : 0;
  return {
    cropId: crop.id,
    cropName: crop.name,
    emoji: crop.emoji,
    varietyId: `${crop.id}-default`,
    varietyName: `${crop.name}(일반)`,
    marketId: opts?.marketId ?? "seoul-garak",
    marketName: opts?.marketName ?? "서울가락",
    corporationId: undefined,
    corporationName: "전체 법인",
    originId: undefined,
    originName: "전체 산지",
    grade: undefined,
    unit: opts?.unit ?? crop.unit.replace(/^원\s*\//, ""),
    price: crop.currentPrice,
    kgPrice: crop.currentPrice,
    changePrice: crop.currentPrice - crop.prevPrice,
    changeRate,
    updatedAt: crop.updatedAt,
    totalVolume: crop.volumeTon,
    isPredictable: Boolean(crop.isPredictable ?? crop.aiReady),
  };
}
