import { createFileRoute, useRouter } from "@tanstack/react-router";
import { applyMarketSelection } from "@/lib/goto-market";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { MarketListHome } from "@/components/market/MarketListHome";
import { BASIS_UPDATED_TIME, basisDateLabel } from "@/lib/data-basis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGDICT — 오늘의 농산물 시세" },
      {
        name: "description",
        content:
          "실시간 농산물 도매 시세를 한눈에. 품목·시장·산지별 가격 흐름과 급등락 랭킹을 모바일에서 바로 확인하세요.",
      },
      { property: "og:title", content: "AGDICT — 오늘의 농산물 시세" },
      {
        property: "og:description",
        content:
          "실시간 농산물 도매 시세를 한눈에. 품목·시장·산지별 가격 흐름과 급등락 랭킹을 모바일에서 바로 확인하세요.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function Home() {
  const router = useRouter();

  return (
    <AppShell screenId="HOME-001_홈"
      header={
        <>
          <AppHeader title="농산물 시세 조회" />
          <div className="flex items-center justify-end gap-1.5 border-b border-[#E8EEE8] bg-white px-4 py-1.5 text-meta font-bold text-[#495057]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {basisDateLabel()} {BASIS_UPDATED_TIME} 업데이트
          </div>
        </>
      }
    >
      <MarketListHome
        onSelectCrop={(row) => {
          applyMarketSelection(row.id, { tab: "chart", marketLabel: row.market });
          router.navigate({ to: "/market" });
        }}
      />
    </AppShell>
  );
}
