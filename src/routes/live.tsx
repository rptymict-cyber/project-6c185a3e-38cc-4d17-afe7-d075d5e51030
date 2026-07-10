import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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

const PAGE_SIZE = 10;

function LivePage() {
  const { sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/live" });
  const [offset, setOffset] = useState(0);
  const pageSize = PAGE_SIZE + offset;
  const { rows, total } = getLivePrices({ sort, limit: pageSize });

  return (
    <AppShell
      header={
        <DetailHeader
          title="실시간 시세"
          onBack={() => history.back()}
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
                  setOffset(0);
                  navigate({ search: { sort: s } });
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
                onClick={() =>
                  navigate({ to: "/market", search: { crop: row.id, tab: "chart" } })
                }
              />
            ))}
          </ul>
        </div>
        {rows.length < total && (
          <button
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
            className="mt-3 w-full rounded-[10px] border border-[#E9ECEF] bg-background py-2.5 text-[13px] font-semibold text-foreground active:bg-secondary"
          >
            더 불러오기
          </button>
        )}
        <p className="mt-4 text-center text-[10.5px] text-muted-foreground">
          정렬/집계는 서버 기준입니다. 클라이언트에서 순서를 바꾸지 않습니다.
        </p>
      </div>
    </AppShell>
  );
}
