import { memo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

function MarketStickyActionsBase({ cropId }: { cropId: string }) {
  const navigate = useNavigate();
  const onAdd = useCallback(() => toast("관심 품목에 추가했어요"), []);
  const onPredict = useCallback(
    () =>
      navigate({
        to: "/prediction",
        search: { cropId, entrySource: "market" } as never,
      }),
    [navigate, cropId],
  );
  return (
    <div className="fixed inset-x-0 bottom-[60px] z-30 mx-auto w-full max-w-[430px] border-t border-[#E9ECEF] bg-background px-4 py-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAdd}
          className="min-h-11 flex-1 rounded-[10px] border border-[#3A8A3A] bg-background py-3 text-[14px] font-bold text-[#3A8A3A] active:bg-[#F0F9F0]"
        >
          관심 품목 추가
        </button>
        <button
          type="button"
          onClick={onPredict}
          className="min-h-11 flex-1 rounded-[10px] bg-[#3A8A3A] py-3 text-[14px] font-bold text-white active:bg-[#2F6F2F]"
        >
          AI 가격 예측 보기
        </button>
      </div>
    </div>
  );
}

export const MarketStickyActions = memo(MarketStickyActionsBase);

