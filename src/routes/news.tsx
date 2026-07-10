import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import {
  AGRI_NEWS_TYPE_LABEL,
  mockAgriNews,
} from "@/lib/mock/agri-news";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "농산물 소식 — AGDICT" },
      {
        name: "description",
        content: "오늘 업데이트된 농산물 관련 소식을 확인하세요.",
      },
    ],
  }),
});

function NewsPage() {
  return (
    <AppShell header={<AppHeader title="농산물 소식" showRefresh={false} showBell={false} />}>
      <div className="px-4 pb-24 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[12.5px] text-[#6C757D]">
            오늘 업데이트된 농산물 관련 소식을 확인해보세요
          </p>
          <span className="text-[11.5px] font-semibold text-[#868E96]">
            최신순
          </span>
        </div>

        <ul>
          {mockAgriNews.map((n, i) => {
            const inner = (
              <>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-[#868E96]">
                    {AGRI_NEWS_TYPE_LABEL[n.type]}
                  </div>
                  <div className="mt-0.5 text-[14px] font-bold leading-snug text-foreground">
                    {n.title}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.5] text-[#495057]">
                    {n.summary}
                  </p>
                  <div className="mt-1.5 text-[11.5px] text-[#868E96]">
                    {n.source} · {n.publishedAt}
                  </div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#ADB5BD]" />
              </>
            );
            return (
              <li
                key={n.id}
                className={i > 0 ? "border-t border-[#F1F3F5]" : undefined}
              >
                {n.url && n.url !== "#" ? (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-start gap-3 py-4 active:bg-[#F8F9FA]"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="flex items-start gap-3 py-4">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
