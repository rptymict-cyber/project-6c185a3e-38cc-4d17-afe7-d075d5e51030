import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PREDICTABLE_CROPS = [
  {
    id: "apple",
    name: "사과",
    emoji: "🍎",
    category: "과일",
    price: 6120,
    changePct: -2.1,
  },
  {
    id: "cabbage",
    name: "배추",
    emoji: "🥬",
    category: "엽채·근채",
    price: 2840,
    changePct: 8.2,
  },
  {
    id: "radish",
    name: "무",
    emoji: "🥕",
    category: "엽채·근채",
    price: 1760,
    changePct: 6.1,
  },
  {
    id: "onion",
    name: "양파",
    emoji: "🧅",
    category: "양념채소",
    price: 1120,
    changePct: -4.1,
  },
  {
    id: "garlic",
    name: "마늘",
    emoji: "🧄",
    category: "양념채소",
    price: 7850,
    changePct: 3.0,
  },
];

function ChangeBadge({ changePct }: { changePct: number }) {
  const up = changePct > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-bold tabular-nums",
        up ? "text-[#E03131]" : "text-[#1971C2]",
      )}
    >
      {up ? "▲" : "▼"} {Math.abs(changePct).toFixed(1)}%
    </span>
  );
}

export function PredictableCropCards() {
  return (
    <section className="mt-6">
      {/* Section header */}
      <div className="flex items-end justify-between px-4">
        <div>
          <h3 className="text-[16px] font-bold text-foreground">농산물 시세 예측</h3>
          <p className="mt-0.5 text-[12px] text-[#6C757D]">
            5개 품목은 가격 흐름과 예상 시세를 함께 볼 수 있어요
          </p>
        </div>
        <Link
          to="/prediction"
          className="flex items-center gap-0.5 text-[12px] font-semibold text-[#3A8A3A]"
        >
          전체보기
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Horizontal scroll cards */}
      <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1">
        {PREDICTABLE_CROPS.map((crop) => (
          <Link
            key={crop.id}
            to="/prediction"
            search={{ crop: crop.id, entrySource: "home" }}
            className="flex min-w-[140px] max-w-[140px] flex-col rounded-[12px] border border-[#E9ECEF] bg-white p-3.5 transition-colors active:bg-[#F8F9FA]"
          >
            {/* Emoji */}
            <span className="text-[28px] leading-none">{crop.emoji}</span>

            {/* Name + category */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-foreground">{crop.name}</span>
              <span className="shrink-0 rounded-md bg-[#F1F3F5] px-1.5 py-0.5 text-[10px] font-semibold text-[#6C757D]">
                {crop.category}
              </span>
            </div>

            {/* Price */}
            <div className="mt-1.5 text-[12px] font-medium text-[#6C757D]">
              {crop.price.toLocaleString()}원/kg
            </div>

            {/* Change + badge row */}
            <div className="mt-2 flex items-center justify-between">
              <ChangeBadge changePct={crop.changePct} />
              <span className="shrink-0 rounded-full bg-[#F0F9F0] px-2 py-0.5 text-[10px] font-bold text-[#3A8A3A]">
                예상 시세
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
