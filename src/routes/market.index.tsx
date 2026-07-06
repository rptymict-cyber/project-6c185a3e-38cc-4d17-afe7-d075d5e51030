import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";
import { MarketSearchBar } from "@/components/market-v2/MarketSearchBar";
import { MarketFilterBar } from "@/components/market-v2/MarketFilterBar";
import { useMarketFilter } from "@/store/market";

void BottomNav;

export const Route = createFileRoute("/market/")({
  validateSearch: () => ({}),
  component: MarketPage,
  head: () => ({
    meta: [
      { title: "시세 — AGDICT" },
      {
        name: "description",
        content: "품목별·도매시장별 농산물 시세를 한눈에 확인하세요.",
      },
    ],
  }),
});

function MarketPage() {
  const simpleMode = useMarketFilter((s) => s.simpleMode);

  return (
    <AppShell header={<AppHeader title="농산물 시세 조회" />}>
      <MarketSearchBar />
      <MarketFilterBar />

      <div className="mt-4 border-t-8 border-[#F1F3F5]">
        {simpleMode ? <SimpleModePlaceholder /> : <ProModePlaceholder />}
      </div>
    </AppShell>
  );
}

function SimpleModePlaceholder() {
  return (
    <div className="px-4 py-10 text-center">
      <div className="text-[13px] font-semibold text-[#3A8A3A]">간편 모드</div>
      <div className="mt-2 text-[13px] text-[#6C757D]">
        선택한 조건의 시세가 이곳에 표시됩니다.
      </div>
    </div>
  );
}

function ProModePlaceholder() {
  return (
    <div className="px-4 py-10 text-center">
      <div className="text-[13px] font-semibold text-[#495057]">전문가 모드</div>
      <div className="mt-2 text-[13px] text-[#6C757D]">
        상세 표·그래프가 이곳에 표시됩니다.
      </div>
    </div>
  );
}
