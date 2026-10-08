/**
 * Extra rationale cards for the AI Price Prediction screen.
 * All cards share the same visual style (white bg, radius 16, light border).
 */

import { getOutlookReport, getTopicNews } from "../rationaleData";
import { todayIso } from "@/lib/date";

const CARD =
  "rounded-2xl border border-[#E9ECEF] bg-white p-4";
const BRAND = "#3A8A3A";

/* ---------- 1. 추세 방향성 ---------- */
export function TrendDirectionCard() {
  const value = 23.9;
  // 0~15 횡보 / 15~30 전환 / 30~45 강한추세 / 45+ 매우강함
  const segments = [
    { label: "횡보", range: [0, 15] as const },
    { label: "전환", range: [15, 30] as const },
    { label: "강한추세", range: [30, 45] as const },
    { label: "매우강함", range: [45, 60] as const },
  ];
  const activeIdx = segments.findIndex(
    (s) => value >= s.range[0] && value < s.range[1],
  );

  return (
    <div className={CARD}>
      <div className="text-body font-bold text-foreground">추세 방향성</div>
      <div className="mt-0.5 text-meta text-[#868E96]">
        지금 가격 흐름이 얼마나 뚜렷한 추세인지
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-[32px] font-black leading-none text-[#E8590C] tabular-nums">
          {value}
        </div>
        <div className="text-caption font-semibold text-[#495057]">
          전환 국면 · 상승 추세 형성 중
        </div>
      </div>

      {/* 게이지 바 */}
      <div className="mt-3 flex gap-1">
        {segments.map((s, i) => {
          const active = i === activeIdx;
          return (
            <div key={s.label} className="flex-1">
              <div
                className="h-2 rounded-full"
                style={{
                  background: active ? "#E8590C" : "#F1F3F5",
                }}
              />
              <div
                className={`mt-1 text-center text-meta font-semibold ${
                  active ? "text-[#E8590C]" : "text-[#868E96]"
                }`}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 2. 경매·수급 동향 ---------- */
export function AuctionSupplyCard({
  marketName = "서울가락",
  avgAuctionPrice = 14346,
  avgChangePct = 2.1,
  weeklyVolumeTon = 429,
  volumeChangePct = -3.8,
  weekLabel = "",
  origins = [],
}: {
  weekLabel?: string;
  origins?: { name: string; pct: number }[];
  marketName?: string;
  avgAuctionPrice?: number;
  avgChangePct?: number;
  weeklyVolumeTon?: number;
  volumeChangePct?: number;
}) {
  return (
    <div className={CARD}>
      <div className="text-body font-bold text-foreground">
        경매·수급 동향
      </div>
      <div className="mt-0.5 text-meta text-[#868E96]">
        {marketName} · {weekLabel}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#F8F9FA] px-3 py-2.5">
          <div className="text-meta text-[#6C757D]">주간 반입량</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-subtitle font-black text-foreground tabular-nums">
              {Math.round(weeklyVolumeTon).toLocaleString()}t
            </span>
            <span
              className={`text-meta font-bold tabular-nums ${volumeChangePct >= 0 ? "text-[#E03B3B]" : "text-[#1971C2]"}`}
            >
              {volumeChangePct >= 0 ? "+" : ""}
              {volumeChangePct.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-[#F8F9FA] px-3 py-2.5">
          <div className="text-meta text-[#6C757D]">평균 낙찰가</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-subtitle font-black text-foreground tabular-nums">
              {Math.round(avgAuctionPrice).toLocaleString()}원
            </span>
            <span
              className={`text-meta font-bold tabular-nums ${avgChangePct >= 0 ? "text-[#E03B3B]" : "text-[#1971C2]"}`}
            >
              {avgChangePct >= 0 ? "+" : ""}
              {avgChangePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1.5 text-meta font-semibold text-[#495057]">
          산지 반입 비중
        </div>
        <div className="space-y-1.5">
          {origins.map((o) => (
            <div key={o.name} className="flex items-center gap-2">
              <div className="w-8 shrink-0 text-meta font-semibold text-[#495057]">
                {o.name}
              </div>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#F1F3F5]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${o.pct}%`, background: BRAND }}
                />
              </div>
              <div className="w-9 shrink-0 text-right text-meta font-bold text-[#212529] tabular-nums">
                {o.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 5. 가격 전망 리포트 ---------- */
export function PriceOutlookReportCard({
  marketName = "서울가락",
  rangeDays = 30,
  forecastLow = 13294,
  forecastHigh = 15398,
  cropId = "apple",
  grade = "all",
}: {
  cropId?: string;
  grade?: string;
  marketName?: string;
  rangeDays?: number;
  forecastLow?: number;
  forecastHigh?: number;
}) {
  const paragraphs = getOutlookReport(cropId, marketName, rangeDays, forecastLow, forecastHigh, grade);
  return (
    <div className={CARD}>
      <div className="text-body font-bold text-foreground">
        가격 전망 리포트
      </div>
      <div className="mt-0.5 text-meta text-[#868E96]">작성일 {todayIso()}</div>

      <div className="mt-3 space-y-3">
        {paragraphs.map((p) => (
          <div key={p.title}>
            <div
              className="text-caption font-bold"
              style={{ color: BRAND }}
            >
              {p.title}
            </div>
            <p className="mt-1 text-caption leading-relaxed text-[#343A40]">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 6. 주제별 관련 뉴스 ---------- */
export function TopicRelatedNewsCard({ cropId = "apple" }: { cropId?: string }) {
  const topics = getTopicNews(cropId);
  return (
    <div className={CARD}>
      <div className="text-body font-bold text-foreground">
        주제별 관련 뉴스
      </div>
      <div className="mt-0.5 text-meta text-[#868E96]">
        가격에 영향 준 이슈를 주제별로
      </div>

      <div className="mt-3 space-y-4">
        {topics.map((t) => (
          <div key={t.title}>
            <div className="text-caption font-bold text-[#212529]">
              {t.title}
            </div>
            <div className="mt-2 border-l-2 border-[#E9ECEF] pl-3">
              <ul className="space-y-2.5">
                {t.items.map((n) => (
                  <li key={n.headline}>
                    <div className="text-meta text-[#868E96]">
                      {n.date} · {n.source}
                    </div>
                    <div className="mt-0.5 text-caption font-semibold leading-snug text-[#343A40]">
                      {n.headline}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
