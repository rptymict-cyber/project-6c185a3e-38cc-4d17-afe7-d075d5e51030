import { useEffect, useState } from "react";
import { Check, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WEATHER_PROVINCES, WEATHER_REGIONS } from "@/lib/mock/weather";
import { useWeatherRegion } from "@/store/weatherRegion";
import { useLocation } from "@/store/location";
import { SheetSearch } from "@/components/market-v2/MarketSheet";
import { cn } from "@/lib/utils";

export function WeatherRegionSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const regionId = useWeatherRegion((s) => s.regionId);
  const setRegionId = useWeatherRegion((s) => s.setRegionId);
  const request = useLocation((s) => s.request);
  const pending = useLocation((s) => s.pending);
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<string | null>(regionId);
  useEffect(() => {
    if (open) {
      setQ("");
      setDraft(regionId);
    }
  }, [open, regionId]);

  const query = q.trim().toLowerCase();
  const filtered = query
    ? WEATHER_REGIONS.filter(
        (r) => r.fullName.toLowerCase().includes(query) || r.name.toLowerCase().includes(query),
      )
    : WEATHER_PROVINCES;

  const useCurrent = async () => {
    const ok = await request();
    if (!ok) {
      toast("위치 권한이 없어 현재 위치 날씨를 불러올 수 없어요.");
      return;
    }
    setRegionId(null);
    toast("현재 위치 기준 날씨로 바꿨어요.");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[85dvh] flex-col rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-subtitle font-bold">지역 선택</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-2 pt-3">
          <button
            type="button"
            onClick={useCurrent}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#3A8A3A] bg-[#3A8A3A0D] py-3 text-body font-bold text-[#3A8A3A]"
          >
            <MapPin className="h-4 w-4" />
            현재 위치로 설정
          </button>
        </div>

        <SheetSearch value={q} onChange={setQ} placeholder="시·군·구 검색 (예: 수원, 공주)" />

        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-caption text-[#868E96]">검색 결과가 없어요.</p>
        ) : null}
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 pt-1">
          {filtered.map((r) => {
            const active = r.id === draft;
            return (
              <li key={r.id}>
                <button
                  onClick={() => {
                    setDraft(r.id);
                  }}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-body",
                    active
                      ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]"
                      : "text-foreground",
                  )}
                >
                  {r.fullName}
                  {active && <Check className="h-4 w-4 text-[#3A8A3A]" />}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-[#F1F3F5] px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            disabled={!draft}
            onClick={() => {
              if (draft) setRegionId(draft);
              onOpenChange(false);
            }}
            className="flex h-14 w-full items-center justify-center rounded-[12px] bg-primary text-body font-bold text-primary-foreground active:opacity-90 disabled:bg-[#CFD6DB]"
          >
            적용하기
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
