import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { RuleForm } from "@/components/notifications/RuleForm";
import { useAlerts } from "@/store/alerts";

export const Route = createFileRoute("/notifications/settings/$ruleId")({
  component: EditRulePage,
  head: () => ({
    meta: [
      { title: "알림 수정 — AGDICT" },
      { name: "description", content: "선택한 알림 규칙을 수정하세요." },
    ],
  }),
});

function EditRulePage() {
  const { ruleId } = Route.useParams();
  const navigate = useNavigate();
  const rule = useAlerts((s) => s.rules.find((r) => r.id === ruleId));

  useEffect(() => {
    if (!rule) navigate({ to: "/notifications/settings" });
  }, [rule, navigate]);

  if (!rule) return null;

  return (
    <RuleForm
      ruleId={rule.id}
      seed={{
        varietyId: rule.varietyId,
        varietyLabel: rule.varietyLabel,
        itemLabel: rule.itemLabel,
        categoryId: rule.categoryId,
        categoryLabel: rule.categoryLabel,
        marketId: rule.marketId,
        marketLabel: rule.marketLabel,
        corpId: rule.corpId,
        corpLabel: rule.corpLabel,
        unit: rule.unit,
        targetAbove: rule.targetAbove,
        targetBelow: rule.targetBelow,
        swingUp: rule.swingUp,
        swingDown: rule.swingDown,
        swingThreshold: rule.swingThreshold,
        volumeSurge: rule.volumeSurge,
        volumeThreshold: rule.volumeThreshold,
        auctionStart: rule.auctionStart,
        enabled: rule.enabled,
      }}
    />
  );
}
