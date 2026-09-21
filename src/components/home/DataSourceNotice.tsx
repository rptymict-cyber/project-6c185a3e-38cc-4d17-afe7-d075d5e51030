import {
  BASIS_SOURCE,
  BASIS_UPDATED_TIME,
  basisDateLabel,
} from "@/lib/data-basis";

export function DataSourceNotice() {
  return (
    <section className="mt-6 border-t border-[#F1F3F5] px-4 py-4 text-meta leading-relaxed text-[#868E96]">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>
          기준일 <span className="font-semibold text-[#495057]">{basisDateLabel()}</span>
        </span>
        <span className="text-[#DEE2E6]">|</span>
        <span>
          단위 <span className="font-semibold text-[#495057]">{BASIS_PRICE_UNIT}</span>
        </span>
        <span className="text-[#DEE2E6]">|</span>
        <span>
          출처 <span className="font-semibold text-[#495057]">{BASIS_SOURCE}</span>
        </span>
        <span className="text-[#DEE2E6]">|</span>
        <span>
          <span className="font-semibold text-[#495057]">{BASIS_UPDATED_TIME}</span> 업데이트
        </span>
      </div>
      <p className="mt-2">
        kg 환산 가격은 제공 데이터 기준이며, 일부 품목은 원 단위로 표시될 수 있습니다.
      </p>
    </section>
  );
}
