import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { MarketListHome } from "@/components/market/MarketListHome";

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
    <AppShell
      header={
        <>
          <AppHeader title="농산물 시세 조회" />
          <div className="border-b border-[#F1F3F5] bg-background px-4 py-1.5 text-[11px] text-muted-foreground">
            기준일 2026.07.03 14:30 업데이트
          </div>
        </>
      }
    >
      <MarketListHome
        onSelectCrop={(id) => {
          router.navigate({
            to: "/market",
            search: { crop: id, tab: "chart" },
          });
        }}
      />
    </AppShell>
  );
}
