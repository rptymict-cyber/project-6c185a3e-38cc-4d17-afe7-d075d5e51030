import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronRight, Scale, Store } from "lucide-react";
import { toast } from "sonner";
import { DetailHeader } from "@/components/detail-header";
import { AppShell } from "@/components/app-shell";
import { CropIcon } from "@/components/crop-icon";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCropSelection } from "@/store/cropSelection";
import { getCategoryById, getItemById, getVarietyById } from "@/lib/catalog-service";
import { MARKETS } from "@/lib/mock/markets";
import { getMarketQuote } from "@/lib/mock/market-analysis";
import { useFavoritePriceStore } from "@/features/favorites/favoriteStore";
import { fromMarketQuote } from "@/features/favorites/favoriteMappers";
import { defaultUnitFor, UNIT_OPTIONS } from "@/lib/units";

const ALL_MARKET_ID = "all";
const ALL_MARKET_NAME = "전체 시장";

export const Route = createFileRoute("/watchlist/add")({
  component: WatchlistAddPage,
  head: () => ({
    meta: [
      { title: "즐겨찾기 추가 — AGDICT" },
      {
        name: "description",
        content: "관심 있는 품목과 시장을 선택해 즐겨찾기에 추가하세요.",
      },
    ],
  }),
});

function todayStr() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function WatchlistAddPage() {
  const navigate = useNavigate();
  const committed = useCropSelection((s) => s.committed);
  const addFavorite = useFavoritePriceStore((s) => s.addFavorite);

  const [marketId, setMarketId] = useState<string>(ALL_MARKET_ID);
  const [marketName, setMarketName] = useState<string>(ALL_MARKET_NAME);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [unitSheetOpen, setUnitSheetOpen] = useState(false);
  const [unitOverride, setUnitOverride] = useState<string | null>(null);

  const category = committed.categoryId ? getCategoryById(committed.categoryId) : undefined;
  const item = committed.itemId ? getItemById(committed.itemId) : undefined;
  const variety =
    committed.itemId && committed.varietyId && committed.varietyId !== "ALL"
      ? getVarietyById(committed.itemId, committed.varietyId)
      : undefined;

  const cropSelected = Boolean(item);

  // 단위는 공통 SSOT 기준: 품목 기본 거래단위를 초기값으로, 사용자가 변경 가능
  const unit = unitOverride ?? defaultUnitFor(item?.name);
  const date = todayStr();

  const quote = useMemo(() => {
    if (!item) return undefined;
    const previewMarketId = marketId === ALL_MARKET_ID ? "seoul-garak" : marketId;
    return getMarketQuote({
      itemId: item.id,
      varietyId: variety?.id ?? `${item.id}:ALL`,
      marketId: previewMarketId,
      unit,
      date,
    });
  }, [item, variety, marketId, unit, date]);

  const handlePickCrop = () => {
    navigate({
      to: "/crop-select",
      search: { from: "watchlist", return: "/watchlist/add" },
    });
  };

  const handleSave = () => {
    if (!item || !quote) {
      toast("먼저 품목을 선택해 주세요");
      return;
    }
    const payload = fromMarketQuote({
      itemId: item.id,
      itemName: item.name,
      varietyId: variety?.id ?? `${item.id}:ALL`,
      varietyName: variety?.name ?? "전체 품종",
      marketId,
      marketName,
      unit,
      quote,
      isPredictable: false,
    });
    addFavorite(payload);
    toast.success("즐겨찾기에 추가되었어요");
    navigate({ to: "/watchlist" });
  };

  const rising = (quote?.prevPct ?? 0) >= 0;
  const flat = Math.abs(quote?.prevPct ?? 0) < 0.05;

  return (
    <AppShell screenId="FAV-002_즐겨찾기추가"
      header={
        <DetailHeader
          title="즐겨찾기 추가"
          onBack={() => navigate({ to: "/watchlist" })}
          right={null}
        />
      }
    >
      <div className="flex flex-col gap-3 px-4 pt-4">
        {/* 품목 선택 */}
        <section className="rounded-2xl border border-border bg-background p-4">
          <div className="mb-2 text-[12px] font-semibold text-muted-foreground">
            작물
          </div>
          <button
            type="button"
            onClick={handlePickCrop}
            className="flex w-full items-center gap-3 rounded-xl border border-input px-3 py-3 text-left active:bg-secondary/50"
          >
            {cropSelected ? (
              <>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted">
                  <CropIcon name={item!.name} size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-bold text-foreground">
                    {`${category?.name ?? ""} · ${item!.name} · ${variety?.name ?? "전체 품종"}`}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 text-[14px] text-muted-foreground">
                품목을 선택하세요
              </div>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </section>

        {/* 시장 선택 */}
        <section className="rounded-2xl border border-border bg-background p-4">
          <div className="mb-2 text-[12px] font-semibold text-muted-foreground">
            도매시장
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl border border-input px-3 py-3 text-left active:bg-secondary/50"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted">
              <Store className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1 text-[15px] font-bold text-foreground">
              {marketName}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <p className="mt-2 text-[11.5px] text-muted-foreground">
            전체 시장을 선택해도 즐겨찾기로 저장할 수 있어요.
          </p>
        </section>

        {/* 단위 선택 */}
        <section className="rounded-2xl border border-border bg-background p-4">
          <div className="mb-2 text-[12px] font-semibold text-muted-foreground">
            단위
          </div>
          <button
            type="button"
            onClick={() => setUnitSheetOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl border border-input px-3 py-3 text-left active:bg-secondary/50"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted">
              <Scale className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1 text-[15px] font-bold text-foreground">
              {unit}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
          <p className="mt-2 text-[11.5px] text-muted-foreground">
            가격은 kg 기준 시세를 선택한 단위로 환산해 표시해요.
          </p>
        </section>

        {/* 미리보기 */}
        {cropSelected && quote && (
          <section className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-2 text-[12px] font-semibold text-muted-foreground">
              현재가 미리보기 ({unit} 기준)
            </div>
            <div className="flex items-end justify-between gap-3">
              <div className="font-data text-[24px] font-bold leading-none tabular-nums text-foreground">
                {quote.price.toLocaleString()}
                <span className="ml-1 text-[12px] font-medium text-muted-foreground">
                  원 / {unit}
                </span>
              </div>
              <span
                className={cn(
                  "inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-[12px] font-bold tabular-nums",
                  flat
                    ? "bg-muted text-muted-foreground"
                    : rising
                      ? "bg-[#FFE3E3] text-[#E03131]"
                      : "bg-[#DBE4FF] text-[#1971C2]",
                )}
              >
                {flat
                  ? "— 0.0%"
                  : `${rising ? "▲ +" : "▼ "}${quote.prevPct.toFixed(1)}%`}
              </span>
            </div>
            <p className="mt-2 text-[11.5px] text-muted-foreground">
              {quote.effectiveLabel} · 거래량 {quote.volumeTon.toLocaleString()}t
            </p>
          </section>
        )}
      </div>

      {/* 저장 버튼 */}
      <div className="sticky bottom-0 mt-6 border-t border-border bg-background px-4 py-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!cropSelected}
          className={cn(
            "h-12 w-full rounded-xl text-[15px] font-bold",
            cropSelected
              ? "bg-primary text-primary-foreground active:opacity-90"
              : "bg-muted text-muted-foreground",
          )}
        >
          즐겨찾기 추가
        </button>
      </div>

      <UnitPickerSheet
        open={unitSheetOpen}
        onOpenChange={setUnitSheetOpen}
        selected={unit}
        onSelect={(u) => {
          setUnitOverride(u);
          setUnitSheetOpen(false);
        }}
      />

      <MarketPickerSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedId={marketId}
        onSelect={(id, name) => {
          setMarketId(id);
          setMarketName(name);
          setSheetOpen(false);
        }}
      />
    </AppShell>
  );
}

function UnitPickerSheet({
  open,
  onOpenChange,
  selected,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selected: string;
  onSelect: (unit: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">단위 선택</SheetTitle>
        </SheetHeader>
        <ul className="px-2 pb-6 pt-2">
          {UNIT_OPTIONS.map((u) => {
            const active = u === selected;
            return (
              <li key={u}>
                <button
                  type="button"
                  onClick={() => onSelect(u)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-left text-[14px]",
                    active ? "bg-[#F0F9F0] font-bold text-[#1F5C1F]" : "text-foreground",
                  )}
                >
                  {u}
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

function MarketPickerSheet({
  open,
  onOpenChange,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedId: string;
  onSelect: (id: string, name: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85dvh] overflow-y-auto rounded-t-2xl p-0"
      >
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">도매시장 선택</SheetTitle>
        </SheetHeader>
        <ul className="mt-3">
          <li className="border-b border-[#F1F3F5]">
            <button
              type="button"
              onClick={() => onSelect(ALL_MARKET_ID, ALL_MARKET_NAME)}
              className={cn(
                "flex w-full items-center justify-between px-5 py-3.5 text-left text-[14px] font-semibold",
                selectedId === ALL_MARKET_ID ? "text-[#1F5C1F]" : "text-foreground",
              )}
            >
              전체 시장
              {selectedId === ALL_MARKET_ID && (
                <Check className="h-4 w-4 text-[#3A8A3A]" />
              )}
            </button>
          </li>
          {MARKETS.map((m) => {
            const active = m.id === selectedId;
            return (
              <li key={m.id} className="border-b border-[#F1F3F5]">
                <button
                  type="button"
                  onClick={() => onSelect(m.id, m.name)}
                  className="flex w-full items-center gap-3 px-5 py-3.5 text-left active:bg-[#F8F9FA]"
                >
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "text-[15px] font-bold",
                        active ? "text-[#1F5C1F]" : "text-foreground",
                      )}
                    >
                      {m.name}
                    </div>
                    <div className="mt-0.5 text-[12px] text-[#6C757D]">
                      {m.region}
                    </div>
                  </div>
                  {active && <Check className="h-4 w-4 text-[#3A8A3A]" />}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="h-4" />
      </SheetContent>
    </Sheet>
  );
}
