import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Newspaper, Sprout } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import {
  AGRI_NEWS_TYPE_COLOR,
  mockAgriNews,
  type AgriNewsItem,
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
              <div className="flex items-start gap-3.5 rounded-2xl border border-[#E9ECEF] bg-white p-3 active:bg-[#F8F9FA]">
                <NewsThumb item={n} size={96} radius={14} />
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[12px] font-bold"
                    style={{ color: AGRI_NEWS_TYPE_COLOR[n.type] }}
                  >
                    {n.typeLabel}
                  </div>
                  <div className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-foreground">
                    {n.title}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.55] text-[#495057]">
                    {n.description}
                  </p>
                  <div className="mt-1.5 text-[11.5px] text-[#868E96]">
                    {n.source} · {n.publishedAt}
                  </div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 self-center text-[#ADB5BD]" />
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

function NewsThumb({
  item,
  size,
  radius,
}: {
  item: AgriNewsItem;
  size: number;
  radius: number;
}) {
  const style = { width: size, height: size, borderRadius: radius } as const;
  if (item.imageUrl) {
    return (
      <img
        src={item.imageUrl}
        alt=""
        loading="lazy"
        className="shrink-0 object-cover"
        style={style}
      />
    );
  }
  return (
    <div
      className="grid shrink-0 place-items-center bg-[#F0F9F0]"
      style={style}
    >
      <Newspaper className="h-7 w-7 text-[#3A8A3A]" strokeWidth={1.8} />
    </div>
  );
}
