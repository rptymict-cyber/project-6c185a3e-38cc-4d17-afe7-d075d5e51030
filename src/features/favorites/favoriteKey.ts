import type { FavoriteCondition } from "./types";

export function favoriteKey(c: FavoriteCondition): string {
  return [
    c.cropId,
    c.varietyId ?? "all-variety",
    c.marketId,
    c.corporationId ?? "all-corporation",
    c.originId ?? "all-origin",
    c.grade ?? "all-grade",
    c.unit,
  ].join(":");
}
