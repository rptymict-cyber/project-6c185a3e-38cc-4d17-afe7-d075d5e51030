import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Database, Clock, Scale, Gavel, Info } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import type { ComponentType } from "react";

export const Route = createFileRoute("/data-guide")({
  component: DataGuidePage,
  head: () => ({
    meta: [
      { title: "데이터 기준 안내 — AGDICT" },
      {
        name: "description",
        content:
          "AGDICT 시세 데이터의 출처, 기준일, 가격 단위, 경매일 기준 표시 규칙을 안내합니다.",
      },
    ],
  }),
});

type GuideItem = {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

const items: GuideItem[] = [
  {
    Icon: Database,
    title: "데이터 출처",
    body: "KAMIS 및 aT 농산물유통정보에서 제공하는 도매시장 경매 데이터를 기반으로 합니다.",
  },
  {
    Icon: Clock,
    title: "기준일 및 업데이트 시간",
    body: "시세는 최근 경매일 기준으로 집계되며, 매일 오후 업데이트됩니다. 휴장일에는 직전 경매일 데이터가 표시됩니다.",
  },
  {
    Icon: Scale,
    title: "가격 단위",
    body: "가격은 kg 기준으로 환산해 표시하는 것을 원칙으로 합니다. 다만 품목 특성에 따라 5kg, 8kg, 10kg, 20kg 등 표준 거래 단위가 함께 사용됩니다.",
  },
  {
    Icon: Gavel,
    title: "경매일 기준 표시",
    body: "차트와 시세 카드의 날짜는 실제 경매가 이루어진 경매일을 기준으로 하며, 조회일과 다를 수 있습니다.",
  },
  {
    Icon: Info,
    title: "일부 데이터 안내",
    body: "현재 일부 화면의 데이터는 데모용 mock 데이터를 사용하고 있으며, 실제 API 연동 시 동일한 구조로 교체될 수 있습니다.",
  },
];

function DataGuidePage() {
  const router = useRouter();
  return (
    <AppShell
      header={
        <DetailHeader
          title="데이터 기준 안내"
          onBack={() => router.history.back()}
        />
      }
    >
      <div className="px-4 pb-16 pt-4">
        <p className="mb-4 text-[13px] leading-relaxed text-[#495057]">
          AGDICT는 KAMIS와 aT의 농산물 유통정보를 기반으로 시세를 제공합니다.
          아래 기준을 참고하시면 시세를 더 정확하게 이해하실 수 있어요.
        </p>
        <ul className="grid gap-2.5">
          {items.map((it) => (
            <li
              key={it.title}
              className="flex gap-3 rounded-2xl border border-[#E9ECEF] bg-white p-4"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F1F8F1] text-primary">
                <it.Icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <h2 className="text-[14px] font-bold text-foreground">
                  {it.title}
                </h2>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#6C757D]">
                  {it.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[11px] leading-relaxed text-[#868E96]">
          데이터 제공: KAMIS 농산물유통정보 / aT 한국농수산식품유통공사
        </p>
      </div>
    </AppShell>
  );
}
