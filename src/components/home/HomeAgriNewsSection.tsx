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
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w === 0) return;
      const idx = Math.round(el.scrollLeft / w);
      setActive(Math.min(items.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <div className="mx-4 mt-5">
      {/* section title */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#111827]">
          농산물 소식
        </h3>
        <Link
          to="/news"
          className="flex items-center gap-0.5 text-[13px] font-medium text-[#4B5563]"
        >
          더보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <section className="mt-3 rounded-2xl border border-[#E8EEE8] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
        {/* carousel */}
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {items.map((n) => (
            <div key={n.id} className="w-full shrink-0 snap-center">
              <NewsCard item={n} />
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="mt-3 flex justify-end gap-1.5">
          {items.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-4 bg-[#3A8A3A]" : "w-1.5 bg-[#E5E7EB]",
              )}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function NewsCard({ item }: { item: AgriNewsItem }) {
  return (
    <Link to="/news" className="flex items-start gap-3 active:opacity-80">
      <NewsThumb item={item} />
      <div className="min-w-0 flex-1">
        <span
          className="inline-block rounded-md px-2 py-0.5 text-[11px] font-bold"
          style={{
            color: AGRI_NEWS_TYPE_COLOR[item.type],
            backgroundColor: `${AGRI_NEWS_TYPE_COLOR[item.type]}1A`,
          }}
        >
          {item.typeLabel}
        </span>
        <div className="mt-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-[#111827]">
          {item.title}
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] leading-[1.5] text-[#6B7280]">
          {item.description}
        </p>
        <div className="mt-1.5 text-[11px] text-[#9CA3AF]">
          {formatRelative(item.publishedAt)} · {item.source}
        </div>
      </div>
    </Link>
  );
}

function NewsThumb({ item }: { item: AgriNewsItem }) {
  const style = { width: 108, height: 108, borderRadius: 12 } as const;
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

function formatRelative(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(1, mins)}분 전`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}시간 전`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}일 전`;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
