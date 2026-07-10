import { Link } from "@tanstack/react-router";
import { AgriNewsIcon } from "@/components/news/AgriNewsIcon";
import {
  AGRI_NEWS_TYPE_LABEL,
  mockAgriNews,
} from "@/lib/mock/agri-news";

export function HomeAgriNewsSection() {
  const items = mockAgriNews.slice(0, 3);

  return (
    <section className="mt-6 px-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">오늘의 농산물 소식</h3>
        <Link
          to="/news"
          className="text-[12px] font-medium text-muted-foreground"
        >
          더보기 ›
        </Link>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-[#E9ECEF] bg-white">
        <ul>
          {items.map((n, i) => (
            <li
              key={n.id}
              className={i > 0 ? "border-t border-[#F1F3F5]" : undefined}
            >
              <Link
                to="/news"
                className="flex items-center gap-3 px-3 py-3 active:bg-[#F8F9FA]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F0F9F0] text-[#3A8A3A]">
                  <AgriNewsIcon type={n.type} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-[#868E96]">
                    {AGRI_NEWS_TYPE_LABEL[n.type]}
                  </div>
                  <div className="mt-0.5 truncate text-[13.5px] font-bold text-foreground">
                    {n.title}
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
