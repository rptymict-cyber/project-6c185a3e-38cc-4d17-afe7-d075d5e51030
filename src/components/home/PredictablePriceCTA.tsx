import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function PredictablePriceCTA() {
  return (
    <section className="mt-6 px-4">
      <Link
        to="/prediction"
        className="flex items-center gap-3 rounded-2xl bg-[#FFF8E1] px-4 py-3.5 ring-1 ring-[#FCE7A1]"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[20px]">
          📈
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-foreground">
            AI 예상 시세를 확인해보세요
          </div>
          <div className="mt-0.5 text-[11px] text-[#6C757D]">
            5개 품목의 예상 가격과 출하 참고 정보를 확인할 수 있어요
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-[#ADB5BD]" />
      </Link>
    </section>
  );
}
