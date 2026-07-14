import { MARKETS } from "@/lib/mock/markets";
import {
  getVarietyMarketAverages,
  type MarketAverage,
  type VarietyMarketAverages,
} from "@/lib/mock/variety-market-averages";

/**
 * 시·도 단위 통계. 지역 대표 평균가는 포함된 도매시장의
 * volumeTon 가중 평균이고, 전일 평균에도 동일한 가중치를 사용한다.
 * (별도 전일 거래량 데이터가 아직 없어 현재 volumeTon으로 대체.)
 */
export type RegionStats = {
  region: string;
  avgKg: number;
  prevAvgKg: number;
  deltaAmount: number;
  deltaPct: number;
  volumeTon: number;
  marketCount: number;
  markets: MarketAverage[];
};

/** 시·도 전체 목록 (17개). 데이터가 없어도 지도 표시용으로 유지. */
export const ALL_REGIONS = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
] as const;

export const REGION_SHORT: Record<string, string> = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  경기도: "경기",
  강원특별자치도: "강원",
  충청북도: "충북",
  충청남도: "충남",
  전라북도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
};

export function computeRegionStats(data: VarietyMarketAverages): RegionStats[] {
  return data.regions
    .filter((g) => g.markets.length > 0)
    .map((g) => {
      const totalVol = g.markets.reduce((s, m) => s + m.volumeTon, 0);
      let avgKg: number;
      let prevAvgKg: number;
      if (totalVol > 0) {
        avgKg = Math.round(
          g.markets.reduce((s, m) => s + m.avgKg * m.volumeTon, 0) / totalVol,
        );
        prevAvgKg = Math.round(
          g.markets.reduce((s, m) => s + m.prevAvgKg * m.volumeTon, 0) / totalVol,
        );
      } else {
        avgKg = Math.round(
          g.markets.reduce((s, m) => s + m.avgKg, 0) / g.markets.length,
        );
        prevAvgKg = Math.round(
          g.markets.reduce((s, m) => s + m.prevAvgKg, 0) / g.markets.length,
        );
      }
      const deltaAmount = avgKg - prevAvgKg;
      const deltaPct = prevAvgKg > 0 ? (deltaAmount / prevAvgKg) * 100 : 0;
      return {
        region: g.region,
        avgKg,
        prevAvgKg,
        deltaAmount,
        deltaPct,
        volumeTon: Math.round(totalVol * 10) / 10,
        marketCount: g.markets.length,
        markets: g.markets,
      };
    });
}

export function pickTopRegion(regions: RegionStats[]): RegionStats | null {
  if (regions.length === 0) return null;
  return [...regions].sort((a, b) => {
    if (b.avgKg !== a.avgKg) return b.avgKg - a.avgKg;
    if (b.volumeTon !== a.volumeTon) return b.volumeTon - a.volumeTon;
    return a.region.localeCompare(b.region, "ko");
  })[0];
}

/** 지역 short label (지도용). */
export function shortName(region: string): string {
  return REGION_SHORT[region] ?? region;
}

/** 편의 함수 — 호출부에서 재조회 없이 쓸 수 있게. */
export function getRegionStatsFor(varietyId: string, date: string): {
  data: VarietyMarketAverages;
  regions: RegionStats[];
} {
  const data = getVarietyMarketAverages({ varietyId, date });
  return { data, regions: computeRegionStats(data) };
}

/** 지역 → 해당 지역의 실제 도매시장 ID 목록. */
export function marketIdsIn(region: string): string[] {
  return MARKETS.filter((m) => m.region === region).map((m) => m.id);
}
