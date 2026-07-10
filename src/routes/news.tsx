import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { AgriNewsIcon } from "@/components/news/AgriNewsIcon";
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
  const router = useRouter();

  return (
    <AppShell
      header={
        <DetailHeader
          title="농산물 소식"
          onBack={() => router.history.back()}
        />
      }
    >
      <div className="px-4 pb-24 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[12.5px] text-[#6C757D]">
            오늘 업데이트된 농산물 관련 소식을 확인해보세요
          </p>
          <span className="text-[11.5px] font-semibold text-[#868E96]">최신순</span>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#E9ECEF] bg-white">
          <ul>
            {mockAgriNews.map((n, i) => {
              const Wrapper = ({ children }: { children: React.ReactNode }) =>
                n.url && n.url !== "#" ? (
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-start gap-3 px-3 py-3 active:bg-[#F8F9FA]"
                  >
                    {children}
                  </a>
                ) : (
                  <div className="flex items-start gap-3 px-3 py-3">
                    {children}
                  </div>
                );
              return (
                <li
                  key={n.id}
                  className={i > 0 ? "border-t border-[#F1F3F5]" : undefined}
                >
                  <Wrapper>
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F0F9F0] text-[#3A8A3A]">
                      <AgriNewsIcon type={n.type} size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-[#868E96]">
                        {AGRI_NEWS_TYPE_LABEL[n.type]}
                      </div>
                      <div className="mt-0.5 text-[13.5px] font-bold text-foreground">
                        {n.title}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-[1.45] text-[#495057]">
                        {n.summary}
                      </p>
                      <div className="mt-1.5 text-[11px] text-[#868E96]">
                        {n.source} · {n.publishedAt}
                      </div>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#ADB5BD]" />
                  </Wrapper>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
