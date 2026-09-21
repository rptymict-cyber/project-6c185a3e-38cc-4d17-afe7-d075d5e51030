import { Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WEATHER_REGIONS } from "@/lib/mock/weather";
import { useWeatherRegion } from "@/store/weatherRegion";
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-subtitle font-bold">지역 선택</SheetTitle>
        </SheetHeader>
        <ul className="max-h-[60vh] overflow-y-auto px-2 pb-6 pt-2">
          {WEATHER_REGIONS.map((r) => {
            const active = r.id === regionId;
            return (
              <li key={r.id}>
                <button
                  onClick={() => {
                    setRegionId(r.id);
                    onOpenChange(false);
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
      </SheetContent>
    </Sheet>
  );
}
