import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  Package,
  Search,
  Sprout,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { DateSheetLite } from "@/components/date-sheet-lite";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CATEGORIES, CROPS, getCrop, type Crop } from "@/lib/mock/crops";
import { useRecentStats } from "@/store/recent-stats";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/statistics")({
  component: StatisticsHome,
  head: () => ({
    meta: [
      { title: "통계 — AGDICT" },
      {
        name: "description",
        content: "원하는 조건을 선택하고 시장별 평균가격과 거래량을 확인하세요.",
      },
    ],
  }),
});

const VARIETIES: Record<string, string[]> = {
  apple: ["전체", "부사", "홍로", "감홍", "아오리"],
  pear: ["전체", "신고", "원황", "추황"],
  mandarin: ["전체", "하우스감귤", "감귤(일반)", "극조생", "만생귤"],
  cabbage: ["전체", "월동", "봄", "여름", "가을"],
  radish: ["전체", "가을", "봄", "월동"],
  onion: ["전체", "조생", "중생", "만생"],
  garlic: ["전체", "난지형", "한지형"],
  chili: ["전체", "노지", "하우스"],
  tomato: ["전체", "토마토(일반)", "방울토마토", "대추방울토마토"],
  eggplant: ["전체", "가지(일반)", "가지(상품)"],
};

function fmtDateDot(iso: string): string {
  return iso.replaceAll("-", ".");
}
function categoryLabelOf(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function StatisticsHome() {
  const navigate = useNavigate();
  const recent = useRecentStats((s) => s.items);

  const [date, setDate] = useState("2025-07-05");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [cropId, setCropId] = useState<string | null>(null);
  const [varietyLabel, setVarietyLabel] = useState<string>("전체");

  const [dateOpen, setDateOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [varOpen, setVarOpen] = useState(false);

  const crop = cropId ? getCrop(cropId) : null;
  const cropLabel = crop?.name ?? "선택";
  const catLabel = categoryId ? categoryLabelOf(categoryId) : "선택";
  const canSubmit = !!(categoryId && cropId);

  const openCrop = () => {
    if (!categoryId) {
      toast("부류를 먼저 선택해 주세요.");
      return;
    }
    setCropOpen(true);
  };
  const openVar = () => {
    if (!cropId) {
      toast("품목을 먼저 선택해 주세요.");
      return;
    }
    setVarOpen(true);
  };
  const submit = () => {
    if (!canSubmit) {
      toast("조회 날짜, 부류, 품목, 품종을 모두 선택해 주세요.");
      return;
    }
    useRecentStats.getState().push(cropId!);
    navigate({ to: "/statistics/$variety", params: { variety: cropId! } });
  };

  return (
    <AppShell
      header={
        <AppHeader
          title="통계"
          right={
            <Link
              to="/search"
              aria-label="검색"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <Search className="h-5 w-5 text-[#495057]" />
            </Link>
          }
        />
      }
    >
      <div className="px-4 pb-10 pt-4">
        {/* Intro */}
        <section className="overflow-hidden rounded-[16px] border border-[#D3EBD3] bg-[#F0F9F0] p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-[17px] font-black leading-snug text-[#1F5C1F]">
                농산물 가격 통계
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#3A8A3A]">
                원하는 조건을 선택하고
                <br />
                시장별 평균가격과 거래량을 확인해 보세요.
              </p>
            </div>
            <div
              aria-hidden
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/70 text-[36px] leading-none"
            >
              📊
            </div>
          </div>
        </section>

        {/* Condition cards */}
        <section className="mt-4 rounded-[16px] border border-[#E9ECEF] bg-white p-3">
          <div className="grid grid-cols-2 gap-2">
            <SelectCard
              icon={<Calendar className="h-4 w-4" />}
              label="조회 날짜"
              value={fmtDateDot(date)}
              filled
              onClick={() => setDateOpen(true)}
            />
            <SelectCard
              icon={<Layers className="h-4 w-4" />}
              label="부류"
              value={categoryId ? catLabel : "선택"}
              filled={!!categoryId}
              onClick={() => setCatOpen(true)}
            />
            <SelectCard
              icon={<Package className="h-4 w-4" />}
              label="품목"
              value={cropId ? cropLabel : "선택"}
              filled={!!cropId}
              onClick={openCrop}
            />
            <SelectCard
              icon={<Sprout className="h-4 w-4" />}
              label="품종"
              value={cropId ? varietyLabel : "선택"}
              filled={!!cropId && !!varietyLabel}
              onClick={openVar}
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={cn(
              "mt-3 flex w-full items-center justify-center rounded-[12px] py-3.5 text-[14.5px] font-bold text-white transition-colors",
              canSubmit ? "bg-[#E03131] active:bg-[#C92A2A]" : "bg-[#CED4DA]",
            )}
          >
            통계 보기
          </button>
        </section>

        {/* Recent */}
        <section className="mt-6">
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="text-[14px] font-bold text-foreground">최근 본 통계</h3>
            {recent.length > 0 && (
              <button
                onClick={() => useRecentStats.getState().clear()}
                className="text-[11.5px] font-semibold text-[#868E96]"
              >
                전체 지우기
              </button>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-[#E9ECEF] bg-white px-3 py-6 text-center text-[12.5px] text-[#868E96]">
              아직 조회한 통계가 없어요
            </div>
          ) : (
            <ul className="overflow-hidden rounded-[10px] border border-[#E9ECEF] bg-white">
              {recent.map((r, i) => {
                const c = getCrop(r.varietyId);
                if (!c) return null;
                const viewedISO = new Date(r.viewedAt)
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, ".");
                return (
                  <li key={r.varietyId} className={cn(i > 0 && "border-t border-[#F1F3F5]")}>
                    <Link
                      to="/statistics/$variety"
                      params={{ variety: r.varietyId }}
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[18px]">
                        {c.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-bold text-foreground">
                          {c.name}
                        </div>
                        <div className="truncate text-[11px] text-[#868E96]">
                          {viewedISO} · {categoryLabelOf(c.category)}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#ADB5BD]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Info */}
        <section className="mt-6 rounded-[12px] border border-[#E9ECEF] bg-[#F8F9FA] p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-bold text-[#495057]">
            <Info className="h-3.5 w-3.5" /> 안내사항
          </div>
          <ul className="space-y-1 text-[11.5px] leading-relaxed text-[#6C757D]">
            <li>· 해당 통계는 도매시장에 반입된 가격 기준입니다.</li>
            <li>· 가격은 kg당 평균가격 기준으로 표시됩니다.</li>
            <li>· 통계는 매일 06시 기준으로 업데이트됩니다.</li>
          </ul>
        </section>
      </div>

      {/* Date sheet */}
      <DateSheetLite
        open={dateOpen}
        onOpenChange={setDateOpen}
        selected={date}
        onSelect={(iso) => setDate(iso)}
      />

      {/* Category sheet */}
      <PickerSheet
        open={catOpen}
        onOpenChange={setCatOpen}
        title="부류 선택"
        placeholder="부류 검색"
        options={CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
          key: c.id,
          label: c.label,
        }))}
        selectedKey={categoryId}
        onSelect={(key) => {
          if (categoryId !== key) {
            setCropId(null);
            setVarietyLabel("전체");
          }
          setCategoryId(key);
          setCatOpen(false);
        }}
      />

      {/* Crop sheet */}
      <PickerSheet
        open={cropOpen}
        onOpenChange={setCropOpen}
        title="품목 선택"
        placeholder="품목 검색"
        options={
          categoryId
            ? CROPS.filter((c) => c.category === categoryId).map((c: Crop) => ({
                key: c.id,
                label: c.name,
                emoji: c.emoji,
              }))
            : []
        }
        selectedKey={cropId}
        onSelect={(key) => {
          if (cropId !== key) setVarietyLabel("전체");
          setCropId(key);
          setCropOpen(false);
        }}
      />

      {/* Variety sheet */}
      <PickerSheet
        open={varOpen}
        onOpenChange={setVarOpen}
        title="품종 선택"
        placeholder="품종 검색"
        options={(cropId ? VARIETIES[cropId] ?? ["전체", "기타"] : []).map((v) => ({
          key: v,
          label: v,
        }))}
        selectedKey={varietyLabel}
        onSelect={(key) => {
          setVarietyLabel(key);
          setVarOpen(false);
        }}
      />
    </AppShell>
  );
}

function SelectCard({
  icon,
  label,
  value,
  filled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  filled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-[12px] border border-[#E9ECEF] bg-white px-3 py-3 text-left active:bg-[#F8F9FA]"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F1F3F5] text-[#495057]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold text-[#868E96]">{label}</div>
        <div
          className={cn(
            "mt-0.5 truncate text-[13.5px] font-bold",
            filled ? "text-[#E03131]" : "text-[#ADB5BD]",
          )}
        >
          {value}
        </div>
      </div>
      <ChevronDown className="h-4 w-4 shrink-0 text-[#ADB5BD]" />
    </button>
  );
}

function PickerSheet({
  open,
  onOpenChange,
  title,
  placeholder,
  options,
  selectedKey,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  placeholder: string;
  options: { key: string; label: string; emoji?: string }[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => options.filter((o) => (q ? o.label.includes(q) : true)),
    [options, q],
  );
  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) setQ("");
        onOpenChange(v);
      }}
    >
      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle className="text-[16px] font-bold">{title}</SheetTitle>
        </SheetHeader>
        <div className="px-5 pt-3">
          <div className="flex items-center gap-2 rounded-[10px] border border-[#E9ECEF] bg-white px-3 py-2">
            <Search className="h-4 w-4 text-[#ADB5BD]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[#ADB5BD]"
            />
          </div>
        </div>
        <ul className="mt-3 max-h-[52vh] overflow-y-auto px-5 pb-6">
          {filtered.length === 0 ? (
            <li className="py-10 text-center text-[13px] text-[#868E96]">
              결과가 없어요
            </li>
          ) : (
            filtered.map((o) => {
              const active = o.key === selectedKey;
              return (
                <li key={o.key}>
                  <button
                    type="button"
                    onClick={() => onSelect(o.key)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-left",
                      active ? "bg-[#F0F9F0]" : "hover:bg-[#F8F9FA]",
                    )}
                  >
                    {o.emoji && <span className="text-[18px]">{o.emoji}</span>}
                    <span
                      className={cn(
                        "flex-1 text-[14px] font-semibold",
                        active ? "text-[#1F5C1F]" : "text-foreground",
                      )}
                    >
                      {o.label}
                    </span>
                    <span
                      className={cn(
                        "grid h-5 w-5 place-items-center rounded-full border-2",
                        active ? "border-[#3A8A3A]" : "border-[#CED4DA]",
                      )}
                    >
                      {active && <span className="h-2.5 w-2.5 rounded-full bg-[#3A8A3A]" />}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
