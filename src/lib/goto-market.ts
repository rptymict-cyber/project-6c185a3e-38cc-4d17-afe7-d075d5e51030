/**
 * 시세 상세 화면(`/price/$variety`)을 폐지하고 시세조회메인(`/market`)으로 통합했다.
 *
 * 어떤 화면에서 품목을 클릭해도 조회 조건 스토어(useMarketFilter)에 부류/품목/품종/
 * 단위(필요하면 도매시장·탭)를 먼저 반영한 뒤 `/market`으로 이동시켜,
 * 클릭한 품목이 선택된 상태로 시세조회메인이 열리게 한다.
 */
import { MARKETS } from "@/lib/mock/markets";
import { resolveVarietySelection } from "@/lib/variety-route";
import { useMarketFilter, type ProTab } from "@/store/market";

export type MarketSelectionOptions = {
  marketId?: string;
  marketLabel?: string;
  /** 진입 시 활성화할 분석 탭 */
  tab?: ProTab;
  unit?: string;
};

/** 클릭한 품목/품종 식별값을 조회 조건 스토어에 반영한다. */
export function applyMarketSelection(param: string, opts?: MarketSelectionOptions) {
  const sel = resolveVarietySelection(param);
  const s = useMarketFilter.getState();

  s.setItem({
    categoryId: sel.categoryId,
    categoryLabel: sel.categoryLabel,
    itemId: sel.itemId,
    itemLabel: sel.itemLabel,
    varietyId: sel.varietyId,
    varietyLabel: sel.varietyLabel,
  });
  // 도매시장은 id가 없으면 시장명으로 조회해서 함께 반영한다.
  const marketId =
    opts?.marketId ??
    (opts?.marketLabel
      ? MARKETS.find((m) => m.name === opts.marketLabel)?.id
      : undefined);
  if (marketId) {
    s.setMarket(
      marketId,
      opts?.marketLabel ?? MARKETS.find((m) => m.id === marketId)?.name ?? marketId,
    );
  }
  s.setUnit(opts?.unit ?? sel.unit);
  if (opts?.tab) s.setProTab(opts.tab);
}
