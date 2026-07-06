import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function MarketStickyActions({ cropId }: { cropId: string }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-x-0 bottom-[60px] z-30 mx-auto w-full max-w-[430px] border-t border-[#E9ECEF] bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex gap-2">
        <button
          onClick={() => toast("관심 품목에 추가했어요")}
          className="flex-1 rounded-[10px] border border-[#3A8A3A] bg-background py-3 text-[14px] font-bold text-[#3A8A3A] active:bg-[#F0F9F0]"
        >
          관심 품목 추가
        </button>
        <button
          onClick={() =>
            navigate({ to: "/prediction", search: { crop: cropId, entrySource: "market" } as never })
          }
          className="flex-1 rounded-[10px] bg-[#3A8A3A] py-3 text-[14px] font-bold text-white active:bg-[#2F6F2F]"
        >
          예상 시세 보기
        </button>
      </div>
    </div>
  );
}
