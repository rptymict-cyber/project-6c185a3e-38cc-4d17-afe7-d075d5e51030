import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { RuleForm, type RuleFormSeed } from "@/components/notifications/RuleForm";
import { useAlerts } from "@/store/alerts";
import { useCropSelection } from "@/store/cropSelection";
import { useMarketFilter } from "@/store/market";
import {
  getCategoryById,
  getItemById,
  getVarietyById,
} from "@/lib/catalog-service";

interface NewRuleSearch {
  varietyId?: string;
  marketId?: string;
}

export const Route = createFileRoute("/notifications/settings/new")({
  validateSearch: (raw: Record<string, unknown>): NewRuleSearch => ({
    varietyId: typeof raw.varietyId === "string" ? raw.varietyId : undefined,
    marketId: typeof raw.marketId === "string" ? raw.marketId : undefined,
  }),
  component: NewRulePage,
  head: () => ({
    meta: [
      { title: "알림 추가 — AGDICT" },
      { name: "description", content: "새 품종·시장 조건에 알림을 등록하세요." },
    ],
  }),
});

function NewRulePage() {
  const { varietyId: qVariety, marketId: qMarket } = Route.useSearch();
  const filter = useMarketFilter();
  const committed = useCropSelection((s) => s.committed);
  const existingByKey = useAlerts((s) => s.getByKey);

  const seed = useMemo<RuleFormSeed>(() => {
    // 1) URL 검색 파라미터가 있으면 우선 (bell icon 진입)
    // 2) 없으면 cropSelection.committed (crop-select FAB 진입)
    // 3) 그래도 없으면 useMarketFilter
    const varietyId = qVariety ?? committed.varietyId ?? filter.varietyId;
    const marketId = qMarket ?? filter.marketId;

    // Resolve labels: try catalog first (committed 경로), 실패하면 filter의 라벨 사용
    let categoryId = committed.categoryId ?? filter.categoryId;
    let itemId = committed.itemId ?? filter.itemId;
    let categoryLabel = filter.categoryLabel;
    let itemLabel = filter.itemLabel;
    let varietyLabel = filter.varietyLabel;

    if (committed.categoryId) {
      categoryLabel =
        getCategoryById(committed.categoryId)?.name ?? categoryLabel;
    }
    if (committed.itemId) {
      itemLabel = getItemById(committed.itemId)?.name ?? itemLabel;
    }
    if (committed.itemId && committed.varietyId && committed.varietyId !== "ALL") {
      varietyLabel =
        getVarietyById(committed.itemId, committed.varietyId)?.name ??
        varietyLabel;
    }

    // varietyId가 URL로 들어왔고 filter와 일치하면 filter의 라벨 사용 그대로
    if (qVariety && qVariety === filter.varietyId) {
      varietyLabel = filter.varietyLabel;
      itemLabel = filter.itemLabel;
      categoryLabel = filter.categoryLabel;
      categoryId = filter.categoryId;
      itemId = filter.itemId;
    }

    void itemId; // itemId는 seed에 필드 없음 (스토어 스키마에 없음)

    // 이미 같은 조건 규칙이 있으면 그 값들을 기본값으로 (수정 유도되나 여기선 새로 생성 모드)
    const existing = existingByKey(varietyId ?? "", marketId ?? "");

    return {
      varietyId: varietyId ?? "",
      varietyLabel,
      itemLabel,
      categoryId,
      categoryLabel,
      marketId: marketId ?? "",
      marketLabel: filter.marketLabel,
      corpId: filter.corpId,
      corpLabel: filter.corpLabel,
      unit: filter.unit,
      targetAbove: existing?.targetAbove ?? null,
      targetBelow: existing?.targetBelow ?? null,
      swingUp: existing?.swingUp ?? false,
      swingDown: existing?.swingDown ?? false,
      swingThreshold: existing?.swingThreshold ?? 5,
      volumeSurge: existing?.volumeSurge ?? false,
      volumeThreshold: existing?.volumeThreshold ?? 30,
      auctionStart: existing?.auctionStart ?? false,
      enabled: true,
    };
  }, [qVariety, qMarket, committed, filter, existingByKey]);

  return <RuleForm seed={seed} />;
}
