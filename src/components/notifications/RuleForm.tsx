import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { Switch } from "@/components/ui/switch";
import { getMarketQuote } from "@/lib/mock/market-analysis";
import { useAlerts, type PriceAlertRule } from "@/store/alerts";
import { cn } from "@/lib/utils";

/**
 * 알림 규칙 생성/수정 통합 화면.
 * 기존 price.$variety.alert.tsx + AlertSettingsSheet.tsx 대체.
 */

export type RuleFormSeed = Omit<PriceAlertRule, "id" | "order" | "createdAt">;

export function RuleForm({
  ruleId,
  seed,
}: {
  ruleId?: string;
  seed: RuleFormSeed;
}) {
  const router = useRouter();
  const navigate = useNavigate();
  const upsert = useAlerts((s) => s.upsert);
  const remove = useAlerts((s) => s.remove);

  const isEdit = Boolean(ruleId);

  // ── 개별 상태로 바인딩 (등락률은 상승/하락 별도 상태 — 필수) ──
  const [targetAbove, setTargetAbove] = useState<string>(
    seed.targetAbove != null ? String(seed.targetAbove) : "",
  );
  const [targetBelow, setTargetBelow] = useState<string>(
    seed.targetBelow != null ? String(seed.targetBelow) : "",
  );
  const [swingUp, setSwingUp] = useState<boolean>(seed.swingUp);
  const [swingDown, setSwingDown] = useState<boolean>(seed.swingDown);
  const [swingThreshold] = useState<number>(seed.swingThreshold || 5);
  const [volumeSurge, setVolumeSurge] = useState<boolean>(seed.volumeSurge);
  const [volumeThreshold] = useState<number>(seed.volumeThreshold || 30);
  const [auctionStart, setAuctionStart] = useState<boolean>(seed.auctionStart);

  const quote = getMarketQuote({
    itemId: seed.varietyId,
    varietyId: seed.varietyId,
    marketId: seed.marketId,
    unit: seed.unit,
    date: new Date().toISOString().slice(0, 10),
  });

  const handleSave = () => {
    const parsedAbove = targetAbove.trim() ? Number(targetAbove) : null;
    const parsedBelow = targetBelow.trim() ? Number(targetBelow) : null;
    upsert({
      ...(ruleId ? { id: ruleId } : {}),
      ...seed,
      targetAbove: Number.isFinite(parsedAbove ?? NaN) ? parsedAbove : null,
      targetBelow: Number.isFinite(parsedBelow ?? NaN) ? parsedBelow : null,
      swingUp,
      swingDown,
      swingThreshold,
      volumeSurge,
      volumeThreshold,
      auctionStart,
      enabled: seed.enabled ?? true,
    });
    toast.success("알림을 저장했어요");
    navigate({ to: "/notifications/settings" });
  };

  const handleDelete = () => {
    if (!ruleId) return;
    remove(ruleId);
    toast.success("알림을 삭제했어요");
    navigate({ to: "/notifications/settings" });
  };

  const corpLabel =
    seed.corpLabel && seed.corpLabel !== "전체" ? ` · ${seed.corpLabel}` : "";

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
          <span className="ml-1 text-[15px] font-black tracking-tight text-foreground">
            {isEdit ? "알림 수정" : "알림 추가"}
          </span>
        </header>
      }
    >
      {/* 조건 요약 */}
      <section className="mx-4 mt-4 rounded-[12px] border border-[#E9ECEF] bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold text-foreground">
              {seed.varietyLabel}{" "}
              <span className="text-[12px] font-medium text-[#868E96]">
                · {seed.itemLabel}
              </span>
            </div>
            <div className="mt-0.5 truncate text-[12px] text-[#6C757D]">
              {seed.marketLabel}
              {corpLabel} · {seed.unit.replace(" 기준", "")}
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

      <SectionTitle>목표가 알림</SectionTitle>
      <FieldCard>
        <NumField
          label="목표가 이상"
          placeholder="원 이상이면 알림"
          value={targetAbove}
          onChange={setTargetAbove}
        />
        <NumField
          label="목표가 이하"
          placeholder="원 이하이면 알림"
          value={targetBelow}
          onChange={setTargetBelow}
        />
      </FieldCard>

      <SectionTitle>등락률 알림</SectionTitle>
      <FieldCard>
        <ToggleRow
          label={`${swingThreshold}% 이상 상승`}
          value={swingUp}
          onChange={setSwingUp}
        />
        <ToggleRow
          label={`${swingThreshold}% 이상 하락`}
          value={swingDown}
          onChange={setSwingDown}
        />
      </FieldCard>

      <SectionTitle>거래량 알림</SectionTitle>
      <FieldCard>
        <ToggleRow
          label={`전일 대비 ${volumeThreshold}% 이상 증가`}
          value={volumeSurge}
          onChange={setVolumeSurge}
        />
      </FieldCard>

      <SectionTitle>경매 알림</SectionTitle>
      <FieldCard>
        <ToggleRow
          label="경매 시작 알림"
          desc={`${seed.marketLabel} ${seed.varietyLabel} 첫 경매 체결 시 하루 한 번 알림`}
          value={auctionStart}
          onChange={setAuctionStart}
        />
      </FieldCard>

      <div className="h-28" aria-hidden />

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] border-t border-[#E9ECEF] bg-background px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
        <div className="flex gap-2">
          {isEdit && (
            <button
              onClick={handleDelete}
              className="rounded-[10px] border border-[#E03131] bg-background px-5 py-3 text-[14px] font-bold text-[#E03131] active:bg-[#FFF5F5]"
            >
              삭제
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 rounded-[10px] bg-[#3A8A3A] py-3 text-[14px] font-bold text-white active:bg-[#2F6F2F]"
          >
            {isEdit ? "저장" : "알림 추가"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mx-4 mb-2 mt-5 text-[13.5px] font-bold text-foreground">
      {children}
    </h2>
  );
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 divide-y divide-[#F1F3F5] overflow-hidden rounded-[12px] border border-[#E9ECEF] bg-white">
      {children}
    </div>
  );
}

function NumField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-3 px-4 py-3.5">
      <span className="w-[80px] shrink-0 text-[13px] text-[#495057]">{label}</span>
      <input
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        className="min-w-0 flex-1 bg-transparent text-right text-[13.5px] tabular-nums outline-none placeholder:text-[#ADB5BD]"
      />
      <span className="shrink-0 text-[12px] text-[#868E96]">원</span>
    </label>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 px-4 py-3.5")}>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-medium text-foreground">{label}</div>
        {desc && <div className="mt-0.5 text-[12px] text-[#868E96]">{desc}</div>}
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        className="mt-0.5 data-[state=checked]:bg-[#3A8A3A]"
      />
    </div>
  );
}
