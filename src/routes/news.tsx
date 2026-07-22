import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Newspaper, Share2, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import aiArticleThumb from "@/assets/ai-article-thumb.png.asset.json";
import {
  AGRI_NEWS_TYPE_COLOR,
  mockAgriNews,
  type AgriNewsItem,
} from "@/lib/mock/agri-news";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "농업 뉴스 — AGDICT" },
      {
        name: "description",
        content: "매일 업데이트되는 농업 뉴스를 확인하세요.",
      },
    ],
  }),
});

function NewsPage() {
  const [selected, setSelected] = useState<AgriNewsItem | null>(null);

  if (selected) {
    return (
      <NewsDetailView item={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <AppShell header={<AppHeader title="농업 뉴스" />}>
      {/* Hero — 초록 톤 배경 밴드 */}
      <section className="bg-[#EAF5EA] px-5 pb-7 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[26px] font-black leading-[1.2] text-foreground">
              농업 뉴스
            </h2>
            <p className="mt-2 text-[13px] leading-[1.55] text-[#495057]">
              매일 업데이트되는 농업 뉴스를
              <br />
              확인해보세요.
            </p>
          </div>
          <NewsHeroIllustration />
        </div>
      </section>

      {/* News cards */}
      <ul className="space-y-3 px-4 pb-24 pt-4">
        {mockAgriNews.map((n) => {
          const isAi = n.format === "ai";
          const inner = (
            <div className="flex items-stretch gap-3 rounded-2xl border border-[#EEF0F2] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_4px_12px_-2px_rgba(16,24,40,0.06)] active:bg-[#F8F9FA]">
              <NewsThumb item={n} size={104} radius={14} />
              <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                <div className="min-w-0">
                  {isAi && (
                    <span className="mb-1 inline-flex items-center gap-0.5 rounded-md bg-[#F0EBFF] px-2 py-0.5 text-[9.5px] font-bold text-[#6741D9]">
                      ✨ AI를 통해 작성된 기사
                    </span>
                  )}
                  <div
                    className="text-[12px] font-bold"
                    style={{ color: AGRI_NEWS_TYPE_COLOR[n.type] }}
                  >
                    {n.typeLabel}
                  </div>
                  <div className="mt-1 line-clamp-2 text-[14.5px] font-bold leading-snug text-foreground">
                    {n.title}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-[1.5] text-[#6C757D]">
                    {n.description}
                  </p>
                </div>
                <div className="mt-1.5 text-[11px] text-[#868E96]">
                  {n.source} · {n.publishedAt}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 self-center text-[#ADB5BD]" />
            </div>
          );
          return (
            <li key={n.id}>
              {isAi ? (
                <button
                  type="button"
                  onClick={() => setSelected(n)}
                  className="w-full text-left"
                >
                  {inner}
                </button>
              ) : n.url && n.url !== "#" ? (
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
    </AppShell>
  );
}

function NewsDetailView({
  item,
  onBack,
}: {
  item: AgriNewsItem;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const basis = item.basis;
  const primaryCrop = basis?.crops?.[0] ?? "";
  const cropRouteId = basis?.cropRouteId;

  return (
    <AppShell
      header={
        <div className="flex h-12 items-center justify-between border-b border-[#F1F3F5] bg-white px-2">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F1F3F5]"
            aria-label="뒤로"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="text-[14px] font-bold text-foreground">
            농업 뉴스
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F1F3F5]"
              aria-label="공유"
            >
              <Share2 className="h-[18px] w-[18px] text-[#495057]" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F1F3F5]"
              aria-label="즐겨찾기"
            >
              <Star className="h-[18px] w-[18px] text-[#495057]" />
            </button>
          </div>
        </div>
      }
    >
      <article className="px-5 pb-24 pt-4">
        <span className="inline-flex items-center gap-0.5 rounded-md bg-[#F0EBFF] px-2 py-1 text-[11px] font-bold text-[#6741D9]">
          ✨ AI를 통해 작성된 기사
        </span>

        <h1 className="mt-2.5 text-[20px] font-black leading-[1.4] text-foreground">
          {item.title}
        </h1>

        <div className="mt-2 text-[12px] text-[#868E96]">
          {item.source} · {item.generatedAt ?? item.publishedAt} 생성
        </div>

        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            className="mt-4 w-full rounded-2xl object-cover"
            style={{ maxHeight: 220 }}
          />
        )}

        <div className="mt-5 space-y-[13px]">
          {item.body?.map((p, i) => (
            <p
              key={i}
              className="text-[13.5px] leading-[1.85] text-[#343A40]"
            >
              {p}
            </p>
          ))}
        </div>

        {basis && (
          <section className="mt-4 rounded-2xl border border-[#D8E9E0] bg-[#F3FAF6] p-4">
            <div className="text-[12px] font-bold text-[#1F7A50]">
              📊 이 기사의 근거 데이터
            </div>
            <p className="mt-1 text-[12px] leading-snug text-[#3f5a4c]">
              이 기사는 아래 실제 시세 데이터를 기반으로 AI가 작성했습니다.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {basis.crops.map((c) => (
                <span
                  key={c}
                  className="rounded-lg border border-[#CDE5D8] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1F7A50]"
                >
                  🧅 {c}
                </span>
              ))}
              {basis.market && (
                <span className="rounded-lg border border-[#CDE5D8] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1F7A50]">
                  {basis.market}
                </span>
              )}
              {basis.period && (
                <span className="rounded-lg border border-[#CDE5D8] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1F7A50]">
                  {basis.period}
                </span>
              )}
              {basis.sourceName && (
                <span className="rounded-lg border border-[#CDE5D8] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1F7A50]">
                  출처 {basis.sourceName}
                </span>
              )}
            </div>
            {cropRouteId && (
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/price/$variety",
                    params: { variety: cropRouteId },
                  })
                }
                className="mt-3 flex w-full items-center justify-between rounded-lg border border-[#CDE5D8] bg-white px-3 py-2.5 text-[12px] font-bold text-[#1F7A50] active:bg-[#F3FAF6]"
              >
                <span>{primaryCrop} 실시간 시세 보러가기</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </section>
        )}

        <div className="mt-3 rounded-lg bg-[#F8F9FA] p-3 text-[11px] leading-snug text-[#868E96]">
          ℹ️ 본 기사는 데이터 기반 AI가 자동 작성한 참고용 콘텐츠입니다. 실제
          시세·정책과 차이가 있을 수 있습니다.
        </div>
      </article>
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

  // AI형 기사는 공통 썸네일 사용
  if (item.format === "ai") {
    return (
      <img
        src={aiArticleThumb.url}
        alt=""
        loading="lazy"
        className="shrink-0 object-cover"
        style={style}
      />
    );
  }

  // 링크형: 원문 이미지, 없으면 기본 fallback
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

/** Hero 우측 뉴스 일러스트 (외부 이미지 없이 인라인 SVG로 표현). */
function NewsHeroIllustration() {
  return (
    <svg
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="34"
        y="16"
        width="70"
        height="52"
        rx="6"
        fill="#FFFFFF"
        stroke="#3A8A3A"
        strokeWidth="1.6"
      />
      <text
        x="69"
        y="34"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="11"
        fontWeight="800"
        fill="#3A8A3A"
      >
        NEWS
      </text>
      <rect x="42" y="42" width="54" height="3.2" rx="1.6" fill="#D6E7D6" />
      <rect x="42" y="49" width="42" height="3.2" rx="1.6" fill="#D6E7D6" />
      <rect x="42" y="56" width="48" height="3.2" rx="1.6" fill="#D6E7D6" />
      <path
        d="M92 8 h18 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-10 l-6 5 v-5 h-2 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4 z"
        fill="#FFFFFF"
        stroke="#3A8A3A"
        strokeWidth="1.4"
      />
      <circle cx="97" cy="18" r="1.4" fill="#3A8A3A" />
      <circle cx="101" cy="18" r="1.4" fill="#3A8A3A" />
      <circle cx="105" cy="18" r="1.4" fill="#3A8A3A" />
      <path
        d="M18 74 C 18 60, 26 54, 30 52"
        stroke="#3A8A3A"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M22 60 C 14 58, 12 52, 14 48 C 20 48, 24 54, 22 60 Z"
        fill="#7CC17C"
      />
      <path
        d="M28 54 C 30 46, 36 44, 40 46 C 40 52, 34 56, 28 54 Z"
        fill="#5CB85C"
      />
      <rect x="66" y="66" width="24" height="12" rx="2" fill="#5CB85C" />
      <rect x="72" y="60" width="12" height="8" rx="1.6" fill="#7CC17C" />
      <circle cx="72" cy="82" r="6" fill="#2F6F2F" />
      <circle cx="72" cy="82" r="2" fill="#EAF5EA" />
      <circle cx="90" cy="80" r="4" fill="#2F6F2F" />
      <circle cx="90" cy="80" r="1.4" fill="#EAF5EA" />
      <path
        d="M8 90 H112"
        stroke="#5CB85C"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
