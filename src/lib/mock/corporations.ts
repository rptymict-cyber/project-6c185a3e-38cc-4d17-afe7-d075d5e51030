// Wholesale corporation (도매법인) list per market. Used by CorporationSheet.

export type Corporation = { id: string; label: string };

const DEFAULT: Corporation[] = [{ id: "all", label: "전체" }];

const BY_MARKET: Record<string, Corporation[]> = {
  "seoul-garak": [
    { id: "all", label: "전체" },
    { id: "seoul", label: "서울청과㈜" },
    { id: "jungang", label: "중앙청과㈜" },
    { id: "hanguk", label: "한국청과㈜" },
    { id: "donghwa", label: "동화청과㈜" },
  ],
  "seoul-gangseo": [
    { id: "all", label: "전체" },
    { id: "gangseo", label: "강서청과㈜" },
    { id: "nh-gangseo", label: "농협강서청과㈜" },
  ],
  "busan-eomgung": [
    { id: "all", label: "전체" },
    { id: "eomgung", label: "엄궁청과㈜" },
  ],
  "busan-banyeo": [
    { id: "all", label: "전체" },
    { id: "banyeo", label: "반여청과㈜" },
  ],
  "daegu-bugbu": [
    { id: "all", label: "전체" },
    { id: "bugbu", label: "북부청과㈜" },
    { id: "nh-daegu", label: "대구농협㈜" },
  ],
  "gwangju-seobu": [
    { id: "all", label: "전체" },
    { id: "gj-wonhyeop", label: "광주원협㈜" },
  ],
};

export function getCorporations(marketId: string): Corporation[] {
  return BY_MARKET[marketId] ?? DEFAULT;
}
