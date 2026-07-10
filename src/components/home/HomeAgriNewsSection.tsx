import { Link } from "@tanstack/react-router";
import { ChevronRight, Newspaper } from "lucide-react";
import {
  AGRI_NEWS_TYPE_COLOR,
  mockAgriNews,
  type AgriNewsItem,
} from "@/lib/mock/agri-news";

export function HomeAgriNewsSection() {
  const items = mockAgriNews.slice(0, 3);

  return (
    <section className="mx-4 mt-4 rounded-2xl border border-[#E8EEE8] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      {/* header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#111827]">
          오늘의 농산물 소식
        </h3>
        <Link
          to="/news"
          className="flex items-center gap-0.5 text-[13px] font-medium text-[#4B5563]"
        >
          전체보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* list */}
      <ul className="mt-3 flex flex-col divide-y divide-[#F1F3F5]">
        {items.map((n) => (
          <li key={n.id} className="py-3 first:pt-1 last:pb-1">
            <NewsRow item={n} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function NewsRow({ item }: { item: AgriNewsItem }) {
  return (
    <Link to="/news" className="flex items-start gap-3 active:opacity-80">
      <NewsThumb item={item} />
      <div className="min-w-0 flex-1 pt-0.5">
        <span
          className="inline-block text-[11px] font-bold"
          style={{ color: AGRI_NEWS_TYPE_COLOR[item.type] }}
        >
          {item.typeLabel}
        </span>
        <div className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug text-[#111827]">
          {item.title}
        </div>
        <p className="mt-1 line-clamp-2 text-[12px] leading-[1.5] text-[#6B7280]">
          {item.description}
        </p>
        <div className="mt-1 text-[11px] text-[#9CA3AF]">
          {item.source} · {formatDate(item.publishedAt)}
        </div>
      </div>
    </Link>
  );
}

function NewsThumb({ item }: { item: AgriNewsItem }) {
  const style = { width: 72, height: 72, borderRadius: 12 } as const;
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
      <Newspaper className="h-6 w-6 text-[#3A8A3A]" strokeWidth={1.8} />
    </div>
  );
}

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
