import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ChevronLeft, Share2, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { mockAgriNews } from "@/lib/mock/agri-news";

export const Route = createFileRoute("/news/$id")({
  beforeLoad: ({ params }) => {
    const item = mockAgriNews.find((n) => n.id === params.id);
    if (!item || item.format !== "ai") {
      throw redirect({ to: "/news" });
    }
  },
  component: NewsDetailPage,
  head: ({ params }) => {
    const item = mockAgriNews.find((n) => n.id === params.id);
    return {
      meta: [
        { title: `${item?.title ?? "농업 뉴스"} — AGDICT` },
        {
          name: "description",
          content: item?.description ?? "AGDICT 농업 뉴스",
        },
      ],
    };
  },
});

function NewsDetailPage() {
  const { id } = Route.useParams();
  const item = mockAgriNews.find((n) => n.id === id);
  if (!item || item.format !== "ai") return null;

  const basis = item.basis;
  const primaryCrop = basis?.crops?.[0] ?? "";
  const cropRouteId = basis?.cropRouteId;

  return (
    <AppShell
      header={
        <div className="flex h-12 items-center justify-between border-b border-[#F1F3F5] bg-white px-2">
          <Link
            to="/news"
            className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F1F3F5]"
            aria-label="뒤로"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Link>
          <div className="text-[14px] font-bold text-foreground">농업 뉴스</div>
          <div className="flex items-center">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F1F3F5]"
              aria-label="공유"
            >
              <Share2 className="h-4.5 w-4.5 text-[#495057]" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full active:bg-[#F1F3F5]"
              aria-label="즐겨찾기"
            >
              <Star className="h-4.5 w-4.5 text-[#495057]" />
            </button>
          </div>
        </div>
      }
    >
      <article className="px-5 pb-24 pt-4">
        <span className="inline-flex items-center gap-0.5 rounded-md bg-[#F0EBFF] px-2 py-0.5 text-[11px] font-bold text-[#6741D9]">
          ✨ AI를 통해 작성된 기사
        </span>

        <h1 className="mt-2.5 text-[20px] font-black leading-[1.4] text-foreground">
          {item.title}
        </h1>

        <div className="mt-2 text-[12px] text-[#6C757D]">
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
              className={
                i === 0
                  ? "text-[14px] font-bold leading-[1.85] text-foreground"
                  : "text-[13.5px] leading-[1.85] text-[#343A40]"
              }
            >
              {p}
            </p>
          ))}
        </div>

        {basis && (
          <section className="mt-6 rounded-2xl border border-[#D8E9E0] bg-[#F3FAF6] p-3.5">
            <div className="text-[13px] font-bold text-[#1F7A50]">
              📊 이 기사의 근거 데이터
            </div>
            <p className="mt-1 text-[12px] leading-snug text-[#495057]">
              이 기사는 아래 실제 시세 데이터를 기반으로 AI가 작성했습니다.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {basis.crops.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[#2E9E6B] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[#1F7A50]"
                >
                  🧅 {c}
                </span>
              ))}
              {basis.market && (
                <span className="rounded-full border border-[#2E9E6B] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[#1F7A50]">
                  {basis.market}
                </span>
              )}
              {basis.period && (
                <span className="rounded-full border border-[#2E9E6B] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[#1F7A50]">
                  {basis.period}
                </span>
              )}
              {basis.sourceName && (
                <span className="rounded-full border border-[#2E9E6B] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[#1F7A50]">
                  출처 {basis.sourceName}
                </span>
              )}
            </div>
            {cropRouteId && (
              <Link
                to="/price/$variety"
                params={{ variety: cropRouteId }}
                className="mt-3 flex h-10 items-center justify-center rounded-lg bg-[#2E9E6B] text-[13px] font-bold text-white active:bg-[#1F7A50]"
              >
                {primaryCrop} 실시간 시세 보러가기 ›
              </Link>
            )}
          </section>
        )}

        <div className="mt-4 rounded-xl bg-[#F8F9FA] px-3 py-2 text-[11px] leading-snug text-[#6C757D]">
          ℹ️ 본 기사는 데이터 기반 AI가 자동 작성한 참고용 콘텐츠입니다. 실제
          시세·정책과 차이가 있을 수 있습니다.
        </div>

        {basis?.crops && basis.crops.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {basis.crops.map((c) => (
              <span key={c} className="text-[12px] text-[#6C757D]">
                #{c}
              </span>
            ))}
          </div>
        )}
      </article>
    </AppShell>
  );
}
