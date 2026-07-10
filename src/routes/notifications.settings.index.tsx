import { useMemo } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Bell, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
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
        <header className="sticky top-0 z-30 flex h-[52px] items-center border-b border-[#E9ECEF] bg-background px-2">
          <button
            aria-label="뒤로"
            onClick={() => router.history.back()}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[15px] font-black tracking-tight text-foreground">
            알림 설정
          </span>
        </header>
      }
    >
      <GeneralNotiSettings />

      <h3 className="mb-2 mt-6 px-5 text-[12px] font-bold text-muted-foreground">
        개별 알림 규칙
      </h3>
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F1F3F5]">
            <Bell className="h-7 w-7 text-[#ADB5BD]" />
          </div>
          <p className="mt-4 text-[15px] font-bold text-foreground">
            설정된 알림이 없어요
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            + 버튼을 눌러 품종·시장을 선택하고
            <br />
            알림 조건을 등록해 보세요
          </p>
        </div>
      ) : (
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
