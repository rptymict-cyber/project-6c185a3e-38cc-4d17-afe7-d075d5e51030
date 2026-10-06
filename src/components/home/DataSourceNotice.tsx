import { BASIS_SOURCE } from "@/lib/data-basis";

export function DataSourceNotice() {
  return (
    <section className="mt-6 border-t border-[#F1F3F5] px-4 py-4 text-meta leading-relaxed text-[#868E96]">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>
          출처 <span className="font-semibold text-[#495057]">{BASIS_SOURCE}</span>
        </span>
      </div>
      <p className="mt-2">
        품목별 가격 단위는 제공 데이터 기준에 따라 다르게 표시될 수 있습니다.
      </p>
    </section>
  );
}
