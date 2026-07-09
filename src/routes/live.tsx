import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { RealtimeSection } from "@/components/market/RealtimeSection";
import type { LiveSort } from "@/lib/services/live-prices";
import { getLivePrices } from "@/lib/services/live-prices";
import { LivePriceHeader, LivePriceRowItem } from "@/components/market/LivePriceRow";

const searchSchema = z.object({
  sort: fallback(z.enum(["up", "down", "vol"]), "up").default("up"),
});

export const Route = createFileRoute("/live")({
  validateSearch: zodValidator(searchSchema),
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
        <RealtimeSection
          sort={sort as LiveSort}
          onSortChange={(s) => {
            setOffset(0);
            navigate({ search: { sort: s } });
          }}
          onSelect={(id) =>
            navigate({ to: "/market", search: { crop: id, tab: "chart" } })
          }
          limit={0}
          showHeaderRow={false}
        />
        {/* full list */}
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
