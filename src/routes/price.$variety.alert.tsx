import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell, TopHeader } from "@/components/app-shell";
import { Switch } from "@/components/ui/switch";
import { getMarketQuote } from "@/lib/mock/market-analysis";
import { useAlerts } from "@/store/alerts";
import { useMarketFilter } from "@/store/market";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/price/$variety/alert")({
  component: PriceAlertPage,
  head: () => ({
    meta: [
      { title: "가격 알림 설정 — AGDICT" },
      {
        name: "description",
        content: "선택한 시세 조건에 대해 목표가·등락률·거래량 알림을 설정하세요.",
      },
    ],
  }),
});

function PriceAlertPage() {
  const { variety } = Route.useParams();
  const router = useRouter();
  const f = useMarketFilter();

  const quote = getMarketQuote({
    itemId: f.itemId,
    varietyId: variety,
    marketId: f.marketId,
    unit: f.unit,
    date: f.date,
  });

  const alerts = useAlerts((s) => s.getFor(variety, f.marketId));
  const setFor = useAlerts((s) => s.setFor);

  const save = () => {
    toast("가격 알림이 설정되었습니다.");
    router.history.back();
  };

  return (
    <AppShell
      header={
        <TopHeader
          title="가격 알림 설정"
          left={
            <button
              onClick={() => router.history.back()}
              aria-label="뒤로가기"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          }
        />
      }
    >
      {/* Condition summary */}
      <section className="mx-4 mt-4 rounded-[12px] border border-[#E9ECEF] bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold text-foreground">
              {f.itemLabel} · {f.varietyLabel}
            </div>
            <div className="mt-0.5 truncate text-[12px] text-[#6C757D]">
              {f.marketLabel} · {quote.unit.replace(" 기준", "")}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[10.5px] text-[#868E96]">현재가</div>
            <div className="font-data text-[16px] font-bold text-[#E03131]">
              {quote.price.toLocaleString()}원
            </div>
          </div>
        </div>
      </section>

      {/* Target price */}
      <SectionTitle>목표가 알림</SectionTitle>
      <FieldCard>
        <NumField label="목표가 이상" placeholder="원 이상이면 알림" />
        <NumField label="목표가 이하" placeholder="원 이하이면 알림" />
      </FieldCard>

      {/* Change rate */}
      <SectionTitle>등락률 알림</SectionTitle>
      <FieldCard>
        <ToggleRow
          label="5% 이상 상승"
          value={alerts.swing}
          onChange={(v) => setFor(variety, f.marketId, { swing: v })}
        />
        <ToggleRow
          label="5% 이상 하락"
          value={alerts.swing}
          onChange={(v) => setFor(variety, f.marketId, { swing: v })}
        />
      </FieldCard>

      {/* Volume */}
      <SectionTitle>거래량 알림</SectionTitle>
      <FieldCard>
        <ToggleRow
          label="전일 대비 거래량 30% 이상 증가"
          value={alerts.target}
          onChange={(v) => setFor(variety, f.marketId, { target: v })}
        />
      </FieldCard>

      <div className="h-24" aria-hidden />

      {/* Bottom actions */}
      <div className="fixed inset-x-0 bottom-[60px] z-30 mx-auto w-full max-w-[430px] border-t border-[#E9ECEF] bg-background px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => router.history.back()}
            className="flex-1 rounded-[10px] border border-[#3A8A3A] bg-background py-3 text-[14px] font-bold text-[#3A8A3A] active:bg-[#F0F9F0]"
          >
            취소
          </button>
          <button
            onClick={save}
            className="flex-[1.4] rounded-[10px] bg-[#3A8A3A] py-3 text-[14px] font-bold text-white active:bg-[#2F6F2F]"
          >
            저장
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mx-4 mt-5 mb-2 text-[13.5px] font-bold text-foreground">{children}</h2>
  );
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 divide-y divide-[#F1F3F5] overflow-hidden rounded-[12px] border border-[#E9ECEF] bg-white">
      {children}
    </div>
  );
}

function NumField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="flex items-center gap-3 px-4 py-3.5">
      <span className="w-[80px] shrink-0 text-[13px] text-[#495057]">{label}</span>
      <input
        inputMode="numeric"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-right text-[13.5px] tabular-nums outline-none placeholder:text-[#ADB5BD]"
      />
      <span className="shrink-0 text-[12px] text-[#868E96]">원</span>
    </label>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3 px-4 py-3.5")}>
      <span className="text-[13.5px] font-medium text-foreground">{label}</span>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-[#3A8A3A]"
      />
    </div>
  );
}
