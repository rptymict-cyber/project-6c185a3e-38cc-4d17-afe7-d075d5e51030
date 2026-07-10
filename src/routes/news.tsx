import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Newspaper, Sprout } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import {
  AGRI_NEWS_TYPE_COLOR,
  mockAgriNews,
} from "@/lib/mock/agri-news";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "농산물 소식 — AGDICT" },
      {
        name: "description",
        content: "매일 업데이트되는 농산물 관련 주요 소식을 확인하세요.",
      },
    ],
  }),
});

function NewsPage() {
  return (
    <AppShell header={<AppHeader title="농산물 소식" />}>
      <div className="px-4 pb-24 pt-4">
        {/* Hero */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[26px] font-black leading-[1.2] text-foreground">
              오늘의 <span className="text-[#3A8A3A]">농산물 소식</span>
            </h2>
            <p className="mt-2 text-[13px] leading-[1.55] text-[#6C757D]">
              매일 업데이트되는 농산물 관련
              <br />
              주요 소식을 확인해보세요.
            </p>
          </div>
          <div className="relative grid h-[92px] w-[92px] shrink-0 place-items-center rounded-2xl bg-[#F0F9F0]">
            <Newspaper className="h-10 w-10 text-[#3A8A3A]" strokeWidth={1.8} />
            <Sprout
              className="absolute bottom-2 right-2 h-5 w-5 text-[#5CB85C]"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* News cards */}
        <ul className="space-y-3">
          {mockAgriNews.map((n) => {
            const inner = (
              <div className="flex items-start gap-3 rounded-2xl border border-[#E9ECEF] bg-white px-4 py-4 active:bg-[#F8F9FA]">
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[12px] font-bold"
                    style={{ color: AGRI_NEWS_TYPE_COLOR[n.type] }}
                  >
                    {n.typeLabel}
                  </div>
                  <div className="mt-1 text-[15px] font-bold leading-snug text-foreground">
                    {n.title}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-[1.55] text-[#495057]">
                    {n.description}
                  </p>
                  <div className="mt-2 text-[11.5px] text-[#868E96]">
                    {n.source} · {n.publishedAt}
                  </div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#ADB5BD]" />
              </div>
            );
            // TODO: 추후 인앱 웹뷰 또는 상세 페이지 연결 예정
            return (
              <li key={n.id}>
                {n.url && n.url !== "#" ? (
                  <a href={n.url} target="_blank" rel="noreferrer noopener">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
