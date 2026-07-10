import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "agdict:notiSettings";

interface NotiSettings {
  master: boolean;
  priceSwing: boolean;
  swingThreshold: number; // ±%
  favoriteSummary: boolean;
  auctionClose: boolean;
  noticeUpdate: boolean;
}

const DEFAULTS: NotiSettings = {
  master: true,
  priceSwing: true,
  swingThreshold: 10,
  favoriteSummary: true,
  auctionClose: false,
  noticeUpdate: true,
};

function loadSettings(): NotiSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<NotiSettings>) };
  } catch {
    return DEFAULTS;
  }
}

export function GeneralNotiSettings() {
  const [s, setS] = useState<NotiSettings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setS(loadSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s, hydrated]);

  const disabled = !s.master;

  return (
    <div className="px-4 pt-4">
      {/* Master toggle */}
      <div className="rounded-[10px] bg-surface">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-foreground">
              전체 알림
            </div>
            <div className="text-[11px] text-muted-foreground">
              모든 알림을 한 번에 켜고 끕니다
            </div>
          </div>
          <Switch
            checked={s.master}
            onCheckedChange={(v) => setS((p) => ({ ...p, master: v }))}
            className="data-[state=checked]:bg-[#3A8A3A]"
          />
        </div>
      </div>

      {/* 시세 알림 그룹 */}
      <h3 className="mb-2 mt-6 px-1 text-[12px] font-bold text-muted-foreground">
        시세 알림
      </h3>
      <div
        className={cn(
          "overflow-hidden rounded-[10px] bg-surface transition-opacity",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-foreground">
                급등락 알림
              </div>
              <div className="text-[11px] text-muted-foreground">
                설정 변동폭 이상일 때 알려드려요
              </div>
            </div>
            <Switch
              checked={s.priceSwing}
              onCheckedChange={(v) => setS((p) => ({ ...p, priceSwing: v }))}
              className="data-[state=checked]:bg-[#3A8A3A]"
            />
          </div>
          <div
            className={cn(
              "mt-3 transition-opacity",
              !s.priceSwing && "pointer-events-none opacity-50",
            )}
          >
            <div className="mb-2 flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">변동폭 임계값</span>
              <span className="font-data font-semibold text-foreground">
                ±{s.swingThreshold}%
              </span>
            </div>
            <Slider
              min={5}
              max={30}
              step={1}
              value={[s.swingThreshold]}
              onValueChange={([v]) =>
                setS((p) => ({ ...p, swingThreshold: v }))
              }
            />
          </div>
        </div>

        <div className="mx-4 h-px bg-border" />
        <RowToggle
          title="즐겨찾기 시세 요약"
          subtitle="관심 품목의 일일 시세 요약"
          checked={s.favoriteSummary}
          onChange={(v) => setS((p) => ({ ...p, favoriteSummary: v }))}
        />
        <div className="mx-4 h-px bg-border" />
        <RowToggle
          title="경매 마감 알림"
          subtitle="관심 시장의 경매 마감 알림"
          checked={s.auctionClose}
          onChange={(v) => setS((p) => ({ ...p, auctionClose: v }))}
        />
      </div>

      {/* 앱 알림 그룹 */}
      <h3 className="mb-2 mt-6 px-1 text-[12px] font-bold text-muted-foreground">
        앱 알림
      </h3>
      <div
        className={cn(
          "overflow-hidden rounded-[10px] bg-surface transition-opacity",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <RowToggle
          title="공지·업데이트"
          subtitle="새로운 기능과 공지사항"
          checked={s.noticeUpdate}
          onChange={(v) => setS((p) => ({ ...p, noticeUpdate: v }))}
        />
      </div>

      <p className="mt-4 px-1 text-[11px] leading-relaxed text-muted-foreground">
        알림은 즐겨찾기에 등록한 품목·시장 기준으로 발송됩니다. 기기 OS 알림
        권한이 꺼져 있으면 표시되지 않을 수 있어요.
      </p>
    </div>
  );
}

function RowToggle({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="min-w-0">
        <div className="text-[14px] font-semibold text-foreground">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-muted-foreground">{subtitle}</div>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-[#3A8A3A]"
      />
    </div>
  );
}
