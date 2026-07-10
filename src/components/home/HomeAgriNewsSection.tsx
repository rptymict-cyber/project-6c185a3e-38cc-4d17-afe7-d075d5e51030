import { Link } from "@tanstack/react-router";
import {
  AGRI_NEWS_TYPE_LABEL,
  mockAgriNews,
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

      <ul>
        {items.map((n, i) => (
          <li
            key={n.id}
            className={i > 0 ? "border-t border-[#F1F3F5]" : undefined}
          >
            <Link
              to="/news"
              className="block py-2.5 active:bg-[#F8F9FA]"
            >
              <div className="text-[11px] font-semibold text-[#868E96]">
                {AGRI_NEWS_TYPE_LABEL[n.type]}
              </div>
              <div className="mt-0.5 truncate text-[13.5px] font-bold text-foreground">
                {n.title}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
