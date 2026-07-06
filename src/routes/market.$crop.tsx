import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Share2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { AppShell, TopHeader } from "@/components/app-shell";
import { PeriodChips } from "@/components/period-chips";
import { PriceBadge, priceColor } from "@/components/price-badge";
import { PriceVolumeChart } from "@/components/price-volume-chart";
import { StarToggle } from "@/components/star-toggle";
import { getCrop, seriesFor } from "@/lib/mock/crops";
import { useUi } from "@/store/ui";
import { useWatchlist } from "@/store/watchlist";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/market/$crop")({
  component: CropDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">품목을 찾을 수 없어요.</div>
  ),
  head: ({ params }) => {
    const c = getCrop(params.crop);
    return {
      meta: [
        { title: c ? `${c.name} 시세 — AGDICT` : "시세 — AGDICT" },
        {
          name: "description",
          content: c
            ? `${c.name} 실시간 시세, 가격·거래량 그래프와 등급별 시세.`
            : "농산물 실시간 시세.",
        },
      ],
    };
  },
});

function CropDetail() {
  const { crop: cropId } = Route.useParams();
  const crop = getCrop(cropId);
  const period = useUi((s) => s.period);
  const setPeriod = useUi((s) => s.setPeriod);
  const watched = useWatchlist((s) => s.crops.includes(cropId));
  const toggle = useWatchlist((s) => s.toggleCrop);
  const router = useRouter();

  const series = useMemo(() => (crop ? seriesFor(crop.id, period) : []), [crop, period]);

  if (!crop) {
    return (
      <AppShell header={<TopHeader title="시세 상세" />}>
        <div className="p-8 text-center text-muted-foreground">품목을 찾을 수 없어요.</div>
      </AppShell>
    );
  }

  const changePct = ((crop.currentPrice - crop.prevPrice) / crop.prevPrice) * 100;
  const change = crop.currentPrice - crop.prevPrice;
  const totalVol = series.reduce((s, r) => s + r.volume, 0);
  const avg = Math.round(series.reduce((s, r) => s + r.price, 0) / Math.max(1, series.length));

  return (
    <AppShell
      header={
        <TopHeader
          title={`${crop.emoji} ${crop.name}`}
          left={
            <button
              aria-label="뒤로"
              onClick={() => router.history.back()}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          }
          right={
            <>
              <StarToggle
                active={watched}
                onClick={() => {
                  const added = toggle(cropId);
                  toast(added ? "즐겨찾기에 추가되었습니다 ★" : "즐겨찾기에서 제거되었습니다");
                }}
              />
              <button
                aria-label="공유"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast("링크를 복사했어요");
                }}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </>
          }
        />
      }
      bottom={
        <div className="fixed inset-x-0 bottom-[60px] z-30 mx-auto w-full max-w-[430px] border-t border-border bg-background/95 px-4 py-2.5 backdrop-blur">
          <div className="flex items-center justify-between text-[12px]">
            <div>
              <span className="text-muted-foreground">총 거래량</span>
              <span className="ml-1.5 font-data font-bold tabular-nums">{totalVol.toLocaleString()}t</span>
            </div>
            <div>
              <span className="text-muted-foreground">kg당 평균</span>
              <span className="ml-1.5 font-data font-bold tabular-nums">
                {avg.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="border-b border-border bg-background px-4 pt-3 pb-4">
        <div className="flex items-baseline gap-2">
          <span className="font-data text-[32px] font-black leading-none tabular-nums">
            {crop.currentPrice.toLocaleString()}
          </span>
          <span className="text-[13px] font-medium text-muted-foreground">{crop.unit}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <PriceBadge changePct={changePct} size="md" />
          <span className={cn("text-[13px] font-semibold tabular-nums", priceColor(change))}>
            {change > 0 ? "+" : ""}
            {change.toLocaleString()}원
          </span>
          <span className="text-[12px] text-muted-foreground">전일대비 · {crop.updatedAt}</span>
        </div>
      </div>

      <div className="pt-4">
        <PeriodChips value={period} onChange={setPeriod} />
        <div className="mt-2">
          <PriceVolumeChart data={series} />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-4 border-y border-border bg-surface">
        {[
          { label: "현재가", value: `${crop.currentPrice.toLocaleString()}` },
          { label: "전일대비", value: `${change > 0 ? "+" : ""}${change.toLocaleString()}` },
          { label: "등락률", value: `${changePct > 0 ? "+" : ""}${changePct.toFixed(1)}%` },
          { label: "거래량", value: `${crop.volumeTon.toLocaleString()}t` },
        ].map((k, i) => (
          <div
            key={k.label}
            className={cn(
              "px-2 py-3 text-center",
              i > 0 && "border-l border-border",
            )}
          >
            <div className="text-[10px] font-semibold text-muted-foreground">{k.label}</div>
            <div className="mt-1 font-data text-[13px] font-bold tabular-nums">{k.value}</div>
          </div>
        ))}
      </div>

      {crop.grades && (
        <div className="px-4 py-4">
          <h3 className="mb-2 text-[13px] font-bold text-muted-foreground">
            등급별 가격 (kg당)
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { k: "상", v: crop.grades.top, color: "#3A8A3A", bg: "#F0F9F0" },
                { k: "중", v: crop.grades.mid, color: "#6C757D", bg: "#F1F3F5" },
                { k: "하", v: crop.grades.low, color: "#1971C2", bg: "#EDF2FF" },
              ]
            ).map((g) => (
              <div
                key={g.k}
                className="rounded-[10px] bg-surface px-3 py-3 text-center"
              >
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{ color: g.color, backgroundColor: g.bg }}
                >
                  {g.k}
                </span>
                <div className="mt-1.5 font-data text-[15px] font-bold tabular-nums">
                  {g.v.toLocaleString()}
                  <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                    원
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-24">
        <h3 className="mb-2 text-[13px] font-bold text-muted-foreground">시세 테이블</h3>
        <div className="overflow-hidden rounded-[10px] border border-[#E9ECEF]">
          <table className="w-full text-[12px]">
            <thead className="bg-[#F8F9FA] text-muted-foreground">
              <tr>
                <th className="px-2 py-2 text-left font-semibold">날짜</th>
                <th className="px-2 py-2 text-right font-semibold">가격</th>
                <th className="px-2 py-2 text-right font-semibold">등락률</th>
                <th className="px-2 py-2 text-right font-semibold">거래량</th>
                <th className="px-2 py-2 text-center font-semibold">등급</th>
              </tr>
            </thead>
            <tbody>
              {[...series].reverse().slice(0, 30).map((r, idx) => {
                const gradeKey: "상" | "중" | "하" =
                  idx % 3 === 0 ? "상" : idx % 3 === 1 ? "중" : "하";
                const gradeStyle =
                  gradeKey === "상"
                    ? { color: "#3A8A3A", bg: "#F0F9F0" }
                    : gradeKey === "중"
                      ? { color: "#6C757D", bg: "#F1F3F5" }
                      : { color: "#1971C2", bg: "#EDF2FF" };
                return (
                  <tr key={r.date} className="border-t border-[#E9ECEF]">
                    <td className="px-2 py-2 text-muted-foreground">{r.label}</td>
                    <td className="px-2 py-2 text-right font-data font-semibold tabular-nums">
                      {r.price.toLocaleString()}
                    </td>
                    <td
                      className={cn(
                        "px-2 py-2 text-right font-data font-semibold tabular-nums",
                        priceColor(r.change),
                      )}
                    >
                      {r.change > 0 ? "+" : ""}
                      {r.changePct.toFixed(1)}%
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums text-muted-foreground">
                      {r.volume.toLocaleString()}t
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className="inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                        style={{
                          color: gradeStyle.color,
                          backgroundColor: gradeStyle.bg,
                        }}
                      >
                        {gradeKey}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Link to="/market" className="text-[13px] font-semibold text-primary">
            전체 시세조회 →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

