import { useMemo } from "react";
import { getLiveTrades, type LiveTrade } from "@/lib/services/live-prices";
import { LiveTradeRowItem } from "./LivePriceRow";

/**
 * 최근 거래 피드 미리보기(홈) — 최신 거래순.
 * 정렬 탭/순위/등락률/거래량 집계는 표시하지 않는다(/live와 정의 통일).
 */
export function RealtimeSection({
  onSelect,
  limit,
}: {
  onSelect: (trade: LiveTrade) => void;
  limit: number;
}) {
  const { rows } = useMemo(() => getLiveTrades({ limit }), [limit]);

  return (
    <div>
      <p className="text-meta text-muted-foreground">
        가장 최근 거래부터 표시됩니다.
      </p>
      <div className="mt-2 overflow-hidden rounded-[10px] bg-[#FAFBFA]">
        <ul>
          {rows.map((trade) => (
            <LiveTradeRowItem key={trade.key} trade={trade} onClick={onSelect} />
          ))}
        </ul>
      </div>
    </div>
  );
}
