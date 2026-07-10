import { Link } from "@tanstack/react-router";
import { Newspaper } from "lucide-react";
import {
  AGRI_NEWS_TYPE_COLOR,
  mockAgriNews,
  type AgriNewsItem,
} from "@/lib/mock/agri-news";

export function HomeAgriNewsSection() {
  const items = mockAgriNews.slice(0, 3);

  return (
    <section className="mt-6 px-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">
          오늘의 농산물 소식
        </h3>
        <Link
          to="/news"
          className="text-[12px] font-medium text-muted-foreground"
        >
          전체보기 ›
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white">
        <ul>
          {items.map((n, i) => (
            <li
              key={n.id}
              className={i > 0 ? "border-t border-[#F1F3F5]" : undefined}
            >
              <Link
                to="/news"
                className="flex items-start gap-3.5 px-4 py-3.5 active:bg-[#F8F9FA]"
              >
                <NewsThumb item={n} size={72} radius={12} />
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[11.5px] font-bold"
                    style={{ color: AGRI_NEWS_TYPE_COLOR[n.type] }}
                  >
                    {n.typeLabel}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-[13.5px] font-bold leading-snug text-foreground">
                    {n.title}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[12px] leading-[1.5] text-[#6C757D]">
                    {n.description}
                  </p>
                  <div className="mt-1 text-[11px] text-[#868E96]">
                    {n.source} · {n.publishedAt}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
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
  const style = {
    width: size,
    height: size,
    borderRadius: radius,
  } as const;
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
