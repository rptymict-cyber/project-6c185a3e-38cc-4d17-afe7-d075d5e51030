export interface FavoritePriceItem {
  id: string;
  cropId: string;
  cropName: string;
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
  price?: number;
  kgPrice?: number;
  changePrice?: number;
  changeRate?: number;
  tradeDate?: string;
  updatedAt?: string;
  auctionCount?: number;
  totalVolume?: number;
  isPredictable?: boolean;
  createdAt: string;
}

export type FavoriteCondition = Pick<
  FavoritePriceItem,
  | "cropId"
  | "varietyId"
  | "marketId"
  | "corporationId"
  | "originId"
  | "grade"
  | "unit"
>;
