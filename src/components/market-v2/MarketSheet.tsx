import { useEffect, useState } from "react";
import { MapPin, Check, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MARKETS, nearestMarket, DEFAULT_MARKET } from "@/lib/mock/markets";
import { useMarketFilter } from "@/store/market";
import { useLocation } from "@/store/location";
import { cn } from "@/lib/utils";

export function MarketSheet({
  open,
  onOpenChange,
  value,
  onSelect,
  includeAll = true,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** 지정하면 전역 시세 필터 대신 이 값/콜백을 사용(제어 모드). 예: /live */
  value?: string;
  onSelect?: (id: string, label: string) => void;
  /** "전체" 옵션 노출 여부 */
  includeAll?: boolean;
}) {
  const store = useMarketFilter();
  const marketId = value ?? store.marketId;
  const setMarket = onSelect ?? store.setMarket;
  const granted = useLocation((s) => s.granted);
  const request = useLocation((s) => s.request);
  const pending = useLocation((s) => s.pending);
  const isFallback = granted !== true;
  const [q, setQ] = useState("");
  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  const pick = (id: string, label: string) => {
    setMarket(id, label);
    onOpenChange(false);
  };

  const findNearest = async () => {
    const ok = await request();
    const c = ok ? useLocation.getState().coords : null;
    if (!c) {
      toast(
        `위치 권한이 없어 기본 시장(${DEFAULT_MARKET.name}) 기준으로 보여드려요.`,
      );
      pick(DEFAULT_MARKET.id, DEFAULT_MARKET.name);
      return;
    }
    const m = nearestMarket(c.lat, c.lng);
    toast(`가장 가까운 도매시장: ${m.name}`);
    pick(m.id, m.name);
  };


  const options: { id: string; label: string }[] = [
    ...(includeAll ? [{ id: "all", label: "전체" }] : []),
    ...MARKETS.map((m) => ({ id: m.id, label: m.name })),
  ];
  const query = q.trim().toLowerCase();
  const filtered = query
    ? options.filter((o) => {
        const m = MARKETS.find((x) => x.id === o.id);
        return (
          o.label.toLowerCase().includes(query) ||
          (m?.region ?? "").toLowerCase().includes(query)
        );
      })
    : options;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl p-0">
        <div className="flex items-center justify-center px-4 pt-4 pb-2">
          <h3 className="text-subtitle font-black">도매시장 선택</h3>
        </div>

        <div className="px-4 pt-1 pb-2">
          <button
            onClick={findNearest}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[#3A8A3A] bg-[#3A8A3A0D] py-3 text-body font-bold text-[#3A8A3A]"
          >
            <MapPin className="h-4 w-4" />
            가장 가까운 도매시장 찾기
          </button>
          {isFallback ? (
            <p className="mt-2 text-center text-meta text-[#6C757D]">
              위치 권한이 없어 기본 시장{" "}
              <b className="font-semibold text-[#495057]">{DEFAULT_MARKET.name}</b> 기준으로 안내돼요.
            </p>
          ) : null}
        </div>


        <SheetSearch value={q} onChange={setQ} placeholder="도매시장명 또는 지역 검색" />

        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-caption text-[#868E96]">검색 결과가 없어요.</p>
        ) : null}
        <ul className="px-2 pb-3">
          {filtered.map((m) => {
            const on = m.id === marketId;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => pick(m.id, m.label)}
                  className="flex w-full items-center justify-between px-3 py-3 text-left active:bg-[#F8F9FA]"
                >
                  <span className="text-body font-semibold text-foreground">{m.label}</span>
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-[6px] border",
                      on ? "border-[#3A8A3A] bg-[#3A8A3A] text-white" : "border-[#CED4DA] bg-white",
                    )}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}

export function SheetSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="px-4 pb-2 pt-1">
      <div className="flex h-12 items-center gap-2 rounded-[12px] bg-[#F1F3F5] px-3">
        <Search className="h-4 w-4 shrink-0 text-[#868E96]" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="min-w-0 flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-[#ADB5BD] [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => onChange("")}
            className="grid h-8 w-8 place-items-center rounded-full text-[#868E96]"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
