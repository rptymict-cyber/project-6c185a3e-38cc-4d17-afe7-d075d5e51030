import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useAlerts } from "@/store/alerts";

export function AlertSettingsSheet({
  open,
  onOpenChange,
  varietyId,
  marketId,
  varietyLabel,
  marketLabel,
  targetPrice,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  varietyId: string;
  marketId: string;
  varietyLabel: string;
  marketLabel: string;
  targetPrice: number;
}) {
  const alerts = useAlerts((s) => s.getFor(varietyId, marketId));
  const setFor = useAlerts((s) => s.setFor);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">
            {varietyLabel} · {marketLabel} 알림 설정
          </SheetTitle>
        </SheetHeader>

        <ul className="divide-y divide-[#F1F3F5] px-5 pb-6 pt-2">
          <Row
            title="목표가 도달 알림"
            desc={`경락가가 ${targetPrice.toLocaleString()}원 이상이면 알려드려요`}
            value={alerts.target}
            onChange={(v) => setFor(varietyId, marketId, { target: v })}
          />
          <Row
            title="급등락 알림"
            desc="전일 대비 ±10% 이상 변동 시"
            value={alerts.swing}
            onChange={(v) => setFor(varietyId, marketId, { swing: v })}
          />
          <Row
            title="경매 시작 알림"
            desc={`${marketLabel} ${varietyLabel} 첫 경매 체결 시`}
            value={alerts.auctionStart}
            onChange={(v) => setFor(varietyId, marketId, { auctionStart: v })}
          />
        </ul>
      </SheetContent>
    </Sheet>
  );
}

function Row({
  title,
  desc,
  value,
  onChange,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-3 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-foreground">{title}</div>
        <div className="mt-0.5 text-[12px] text-[#868E96]">{desc}</div>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        className="mt-1 data-[state=checked]:bg-[#3A8A3A]"
      />
    </li>
  );
}
