/**
 * Extra rationale cards for the AI Price Prediction screen.
 * All cards share the same visual style (white bg, radius 16, light border).
 */

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
      <div className="text-[13px] font-bold text-foreground">추세 방향성</div>
      <div className="mt-0.5 text-[11px] text-[#868E96]">
        지금 가격 흐름이 얼마나 뚜렷한 추세인지
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-[28px] font-black leading-none text-[#E8590C] tabular-nums">
          {value}
        </div>
        <div className="text-[12px] font-semibold text-[#495057]">
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
                className={`mt-1 text-center text-[10.5px] font-semibold ${
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
export function AuctionSupplyCard() {
  const origins = [
    { name: "경북", pct: 42 },
    { name: "충남", pct: 28 },
    { name: "경남", pct: 18 },
    { name: "기타", pct: 12 },
  ];
  return (
    <div className={CARD}>
      <div className="text-[13px] font-bold text-foreground">
        경매·수급 동향
      </div>
      <div className="mt-0.5 text-[11px] text-[#868E96]">
        서울가락 · 2026년 29주차
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#F8F9FA] px-3 py-2.5">
          <div className="text-[10.5px] text-[#6C757D]">주간 반입량</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-[16px] font-black text-foreground tabular-nums">
              429t
            </span>
            <span className="text-[11px] font-bold text-[#1971C2] tabular-nums">
              -3.8%
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-[#F8F9FA] px-3 py-2.5">
          <div className="text-[10.5px] text-[#6C757D]">평균 낙찰가</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="text-[16px] font-black text-foreground tabular-nums">
              14,346원
            </span>
            <span className="text-[11px] font-bold text-[#E03B3B] tabular-nums">
              +2.1%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1.5 text-[11.5px] font-semibold text-[#495057]">
          산지 반입 비중
        </div>
        <div className="space-y-1.5">
          {origins.map((o) => (
            <div key={o.name} className="flex items-center gap-2">
              <div className="w-8 shrink-0 text-[11px] font-semibold text-[#495057]">
                {o.name}
              </div>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#F1F3F5]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${o.pct}%`, background: BRAND }}
                />
              </div>
              <div className="w-9 shrink-0 text-right text-[11px] font-bold text-[#212529] tabular-nums">
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
export function PriceOutlookReportCard() {
  const paragraphs = [
    {
      title: "과거 가격 추세",
      body:
        "최근 180일간 완만한 상승세를 유지함. 저장물량 소진과 착색 지연이 겹치며 공급 제약이 커진 구간이 확인됨.",
    },
    {
      title: "예측 추세",
      body:
        "향후 30일 예측 범위는 13,294~15,398원임. 상단 부근에서 횡보하며 고점 형성 흐름이 예상됨.",
    },
    {
      title: "시장 영향",
      body:
        "공급 불확실성이 남아있어 강세 우세 판단이 유효함. 변곡점 중심으로 진입·이탈 시점을 잡는 것이 유리함.",
    },
  ];
  return (
    <div className={CARD}>
      <div className="text-[13px] font-bold text-foreground">
        가격 전망 리포트
      </div>
      <div className="mt-0.5 text-[11px] text-[#868E96]">작성일 2026-07-20</div>

      <div className="mt-3 space-y-3">
        {paragraphs.map((p) => (
          <div key={p.title}>
            <div
              className="text-[12px] font-bold"
              style={{ color: BRAND }}
            >
              {p.title}
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[#343A40]">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 6. 주제별 관련 뉴스 ---------- */
export function TopicRelatedNewsCard() {
  const topics = [
    {
      title: "🌧️ 기상·생산 리스크",
      items: [
        {
          date: "2026-07-18",
          source: "농민신문",
          headline: "장마 재개로 주산지 수확 지연 확산",
        },
        {
          date: "2026-07-15",
          source: "한국농어민",
          headline: "경북 지역 강수량 평년 대비 140%",
        },
      ],
    },
    {
      title: "📦 유통·정책",
      items: [
        {
          date: "2026-07-17",
          source: "aT센터",
          headline: "정부, 수급 안정 위해 비축분 방출 검토",
        },
        {
          date: "2026-07-12",
          source: "농수산식품신문",
          headline: "대형마트 산지직송 확대, 도매경로 축소",
        },
      ],
    },
  ];
  return (
    <div className={CARD}>
      <div className="text-[13px] font-bold text-foreground">
        주제별 관련 뉴스
      </div>
      <div className="mt-0.5 text-[11px] text-[#868E96]">
        가격에 영향 준 이슈를 주제별로
      </div>

      <div className="mt-3 space-y-4">
        {topics.map((t) => (
          <div key={t.title}>
            <div className="text-[12px] font-bold text-[#212529]">
              {t.title}
            </div>
            <div className="mt-2 border-l-2 border-[#E9ECEF] pl-3">
              <ul className="space-y-2.5">
                {t.items.map((n) => (
                  <li key={n.headline}>
                    <div className="text-[10.5px] text-[#868E96]">
                      {n.date} · {n.source}
                    </div>
                    <div className="mt-0.5 text-[12px] font-semibold leading-snug text-[#343A40]">
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
