import { LineChart, Newspaper, Sprout, Landmark } from "lucide-react";
import type { AgriNewsType } from "@/lib/mock/agri-news";

export function AgriNewsIcon({
  type,
  size = 18,
  className,
}: {
  type: AgriNewsType;
  size?: number;
  className?: string;
}) {
  const Icon =
    type === "market-brief"
      ? LineChart
      : type === "agri-news"
        ? Newspaper
        : type === "origin-report"
          ? Sprout
          : Landmark;
  return <Icon className={className} size={size} />;
}
