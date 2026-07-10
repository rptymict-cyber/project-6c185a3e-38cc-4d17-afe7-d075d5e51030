import { useMemo } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { Switch } from "@/components/ui/switch";
import { SwipeReorderList } from "@/components/swipe-reorder-list";
import { GeneralNotiSettings } from "@/components/notifications/GeneralNotiSettings";
import { useAlerts, type PriceAlertRule } from "@/store/alerts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications/settings/")({
  component: NotificationSettingsPage,
  head: () => ({
    meta: [
      { title: "알림 설정 — AGDICT" },
      {
        name: "description",
        content: "품종·시장별 알림 규칙을 관리하세요.",
      },
    ],
  }),
});

function NotificationSettingsPage() {
  const router = useRouter();
  const navigate = useNavigate();

  const rules = useAlerts((s) => s.rules);
  const setEnabled = useAlerts((s) => s.setEnabled);
  const reorder = useAlerts((s) => s.reorder);
  const remove = useAlerts((s) => s.remove);

  const sorted = useMemo(
    () => [...rules].sort((a, b) => a.order - b.order),
    [rules],
  );

  const items = sorted.map((rule) => ({
    id: rule.id,
    render: () => (
      <RuleRow
        rule={rule}
        onToggle={(v) => setEnabled(rule.id, v)}
        onOpen={() =>
          navigate({
            to: "/notifications/settings/$ruleId",
            params: { ruleId: rule.id },
          })
        }
      />
    ),
  }));

  const handleDelete = (id: string) => {
    remove(id);
    toast.success("알림을 삭제했어요");
  };

  return (
    <AppShell
      header={
        <DetailHeader
          title="알림 설정"
          onBack={() => router.history.back()}
        />
      }
    >
      <GeneralNotiSettings />

      {sorted.length > 0 && (
        <div className="pb-24">
          <SwipeReorderList
            items={items}
            onDelete={handleDelete}
            onReorder={reorder}
          />
        </div>
      )}

      {/* FAB */}
      <Link
        to="/crop-select"
        search={{
          from: "alert-create",
          return: "/notifications/settings/new",
        }}
        aria-label="알림 추가"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#3A8A3A] text-white shadow-lg active:bg-[#2F6F2F]"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </AppShell>
  );
}

function RuleRow({
  rule,
  onToggle,
  onOpen,
}: {
  rule: PriceAlertRule;
  onToggle: (v: boolean) => void;
  onOpen: () => void;
}) {
  const badges = activeBadges(rule);
  const subParts = [rule.marketLabel];
  if (rule.corpLabel && rule.corpLabel !== "전체") subParts.push(rule.corpLabel);

  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-white px-3 py-3.5 transition-opacity",
        !rule.enabled && "opacity-50",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[14.5px] font-bold text-foreground">
              {rule.varietyLabel}
            </span>
            <span className="truncate text-[12px] text-[#868E96]">
              {rule.itemLabel}
            </span>
          </div>
          <div className="mt-0.5 truncate text-[12px] text-[#6C757D]">
            {subParts.join(" · ")} · {rule.unit.replace(" 기준", "")}
          </div>
          {badges.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-[#F0F9F0] px-2 py-0.5 text-[10.5px] font-semibold text-[#1F5C1F]"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
      </button>
      <Switch
        checked={rule.enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-[#3A8A3A]"
      />
    </div>
  );
}

function activeBadges(r: PriceAlertRule): string[] {
  const out: string[] = [];
  if (r.targetAbove != null || r.targetBelow != null) out.push("목표가");
  if (r.swingUp || r.swingDown) out.push(`등락 ${r.swingThreshold}%`);
  if (r.volumeSurge) out.push(`거래량 ${r.volumeThreshold}%`);
  if (r.auctionStart) out.push("경매시작");
  return out;
}
