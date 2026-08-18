import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { applyMarketSelection } from "@/lib/goto-market";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
// RealtimeSection reused only on home; /live renders its own list.
import type { LiveSort } from "@/lib/services/live-prices";
import { getLivePrices } from "@/lib/services/live-prices";
import { LivePriceHeader, LivePriceRowItem } from "@/components/market/LivePriceRow";

type LiveSearch = { sort: LiveSort };

export const Route = createFileRoute("/live")({
  validateSearch: (raw: Record<string, unknown>): LiveSearch => {
    const s = raw.sort;
    const sort: LiveSort = s === "down" || s === "vol" ? s : "up";
    return { sort };
  },
  head: () => ({
    meta: [
      { title: "실시간 시세 — AGDICT" },
      {
        name: "description",
        content: "전국 도매시장 실시간 시세를 상승률·하락률·거래량 순으로 확인하세요.",
      },
      { property: "og:title", content: "실시간 시세 — AGDICT" },
      {
        property: "og:description",
        content: "전국 도매시장 실시간 시세를 상승률·하락률·거래량 순으로 확인하세요.",
      },
    ],
  }),
  component: LivePage,
});

import { LoadMoreButton, LIST_PAGE_SIZE } from "@/components/common/LoadMoreButton";

const PAGE_SIZE = LIST_PAGE_SIZE;

function LivePage() {
  const initialSort = Route.useSearch().sort;
  const navigate = useNavigate({ from: "/live" });
  const [offset, setOffset] = useState(0);
  // 정렬 상태는 화면이 직접 소유한다. URL은 공유/복원용으로만 동기화(replace)하며,
  // 라우터 재검증 타이밍에 정렬이 기본값으로 되돌아가지 않도록 화면 상태를 우선한다.
  const [sort, setSort] = useState<LiveSort>(initialSort);
  const pageSize = PAGE_SIZE + offset;
  // 정렬 기준이 바뀔 때 목록을 새로 만들지 않고, 캐시된 정렬 결과만 다시 읽는다.
  const { rows, total } = useMemo(
    () => getLivePrices({ sort, limit: pageSize }),
    [sort, pageSize],
  );

  const handleSelect = useCallback(
    (row: (typeof rows)[number]) => {
      applyMarketSelection(row.id, { tab: "chart", marketLabel: row.market });
      navigate({ to: "/market" });
    },
    [navigate],
  );

  return (
    <AppShell screenId="LIVE-001_실시간시세"
      header={
        <AppHeader
          title="실시간 시세"
          showBell={false}
          showSearch
        />
      }
    >
      <div className="px-4 pt-3">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {(["up", "down", "vol"] as LiveSort[]).map((s) => {
            const active = s === sort;
            const label = s === "up" ? "상승률순" : s === "down" ? "하락률순" : "거래량순";
            return (
              <button
                key={s}
                onClick={() => {
                  if (s === sort) return;
                  setOffset(0);
                  setSort(s);
                  navigate({ search: { sort: s }, replace: true });
                }}
                className={
                  "shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold " +
                  (active ? "bg-[#3A8A3A] text-white" : "bg-[#F1F3F5] text-muted-foreground")
                }
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[10.5px] text-muted-foreground">
          {sort === "vol" ? "전국 거래량 합계" : "전국 평균가 기준 등락률"}
        </p>

        <div className="mt-2 overflow-hidden rounded-[10px] bg-surface">
          <LivePriceHeader />
          <ul>
            {rows.map((row, i) => (
              <LivePriceRowItem
                key={row.id}
                rank={i + 1}
                row={row}
                onClick={handleSelect}
              />
            ))}
          </ul>
        </div>
        {rows.length < total && (
          <LoadMoreButton onClick={() => setOffset((o) => o + PAGE_SIZE)} />
        )}
        <p className="mt-4 text-center text-[10.5px] text-muted-foreground">
          정렬/집계는 서버 기준입니다. 클라이언트에서 순서를 바꾸지 않습니다.
        </p>
      </div>
    </AppShell>
  );
}
