import { useLocation } from "@/store/location";
import { MOCK_WEATHER } from "@/lib/mock/weather";

// 틸다 날씨 API 교체 대상
export function PredictionWeatherCause() {
  const granted = useLocation((s) => s.granted);
  const request = useLocation((s) => s.request);

  return (
    <section className="mt-3">
      <h2 className="mb-2 text-[13px] font-bold text-foreground">
        날씨가 가격에 미치는 영향
      </h2>

      {granted !== true ? (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[#E9ECEF] bg-[#FAFAFA] px-3 py-4">
          <span className="text-[18px]">📍</span>
          <span className="flex-1 text-[12px] text-[#6C757D]">
            위치를 허용하면 날씨 기반 예측 근거를 볼 수 있어요
          </span>
          <button
            type="button"
            onClick={() => request()}
            className="whitespace-nowrap rounded-lg bg-[#2E9E6B] px-3 py-1.5 text-[11.5px] font-bold text-white"
          >
            위치 허용하기 ›
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white">
          {/* 상단 현황 */}
          <div className="flex items-center gap-3 bg-gradient-to-br from-[#EAF3FB] to-[#F3F8FC] px-3 py-3">
            <span className="text-[26px] leading-none">
              {MOCK_WEATHER.current.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-[#6C757D]">
                {MOCK_WEATHER.regionFull} (현재 위치)
              </div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-[20px] font-extrabold tabular-nums text-[#111827]">
                  {MOCK_WEATHER.current.temp}°
                </span>
                <span className="text-[11.5px] text-[#495057]">
                  {MOCK_WEATHER.current.desc}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {MOCK_WEATHER.forecast.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center rounded-lg bg-white/70 px-1.5 py-1"
                >
                  <span className="text-[10px] font-semibold text-[#6C757D]">
                    {f.label}
                  </span>
                  <span className="text-[14px] leading-none">{f.icon}</span>
                  <span className="mt-0.5 text-[10.5px] font-bold tabular-nums text-[#111827]">
                    {f.temp}°
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 인과 체인 */}
          <div className="flex items-stretch gap-1 px-3 py-3">
            {MOCK_WEATHER.cause.steps.map((s, i) => (
              <div key={i} className="flex flex-1 items-center gap-1">
                <div
                  className={
                    "flex flex-1 flex-col items-center rounded-xl border px-1.5 py-2 text-center " +
                    (s.risk
                      ? "border-[#F5C2C2] bg-[#FFF1F1]"
                      : "border-[#E9ECEF] bg-[#F8F9FA]")
                  }
                >
                  <span className="text-[18px] leading-none">{s.icon}</span>
                  <span
                    className={
                      "mt-1 text-[11.5px] font-bold " +
                      (s.risk ? "text-[#E03B3B]" : "text-[#212529]")
                    }
                  >
                    {s.t}
                  </span>
                  <span className="mt-0.5 text-[10px] text-[#6C757D]">
                    {s.sm}
                  </span>
                </div>
                {i < MOCK_WEATHER.cause.steps.length - 1 && (
                  <span className="text-[14px] font-bold text-[#ADB5BD]">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* 결론 */}
          <div className="bg-gradient-to-r from-[#2E9E6B] to-[#1F7A50] px-3 py-2.5 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">📈</span>
              <span className="text-[12px] font-semibold opacity-90">
                예상 결과
              </span>
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-[12px] font-extrabold">
                {MOCK_WEATHER.cause.result}
              </span>
            </div>
            <div className="mt-1 text-[10.5px] text-white/80">
              ※ 틸다 예측 모델 반영 요인
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
