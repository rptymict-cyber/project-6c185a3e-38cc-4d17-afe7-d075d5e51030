import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Newspaper } from "lucide-react";
import {
  AGRI_NEWS_TYPE_COLOR,
  mockAgriNews,
  type AgriNewsItem,
} from "@/lib/mock/agri-news";
import { cn } from "@/lib/utils";

export function HomeAgriNewsSection() {
  const items = mockAgriNews.slice(0, 5);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w === 0) return;
      const idx = Math.round(el.scrollLeft / w);
      setActiveIndex(Math.min(items.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <section className="mt-6 px-4">
      <div className="rounded-2xl border border-[#EEF0F2] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_4px_12px_-4px_rgba(16,24,40,0.06)]">
        {/* header */}
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-foreground">
            오늘의 농산물 소식
          </h3>
          <Link
            to="/news"
            className="flex items-center gap-0.5 text-[12px] font-medium text-[#868E96]"
          >
            더보기
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* carousel */}
        <div
          ref={scrollerRef}
          className="no-scrollbar mt-3 flex snap-x snap-mandatory overflow-x-auto"
        >
          {items.map((n) => (
            <div
              key={n.id}
              className="w-full shrink-0 snap-start pr-1"
            >
              <NewsCard item={n} />
            </div>
          ))}
        </div>

        {/* dots */}
        {items.length > 1 && (
          <div className="mt-3 flex justify-end gap-1.5">
            {items.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex
                    ? "w-3 bg-[#3A8A3A]"
                    : "w-1.5 bg-[#E5E7EB]",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function NewsCard({ item }: { item: AgriNewsItem }) {
  return (
    <Link
      to="/news"
      className="flex items-start gap-3 active:opacity-80"
    >
      <NewsThumb item={item} />
      <div className="min-w-0 flex-1 pt-0.5">
        <span
          className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
          style={{ backgroundColor: AGRI_NEWS_TYPE_COLOR[item.type] }}
        >
          {item.typeLabel}
        </span>
        <div className="mt-1.5 line-clamp-2 text-[14px] font-bold leading-snug text-foreground">
          {item.title}
        </div>
        <p className="mt-1 line-clamp-2 text-[12px] leading-[1.5] text-[#6C757D]">
          {item.description}
        </p>
        <div className="mt-1.5 text-[11px] text-[#868E96]">
          {formatDate(item.publishedAt)} · {item.source}
        </div>
      </div>
    </Link>
  );
}

function NewsThumb({ item }: { item: AgriNewsItem }) {
  const style = { width: 120, height: 90, borderRadius: 12 } as const;
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

/** "2시간 전" 같은 상대 표기는 그대로, ISO/날짜 문자열은 YYYY.MM.DD로 정규화 */
function formatDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
