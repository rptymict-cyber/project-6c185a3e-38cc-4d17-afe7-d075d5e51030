import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { getAuctionById } from "@/lib/mock/auctions";
import { useMarketFilter } from "@/store/market";

export const Route = createFileRoute("/market/auction/$id")({
  component: AuctionDetail,
  head: () => ({
    meta: [
      { title: "경매 상세 결과 — AGDICT" },
      { name: "description", content: "선택한 경매 낙찰 건의 상세 정보." },
    ],
  }),
});

function AuctionDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const f = useMarketFilter();

  const record = getAuctionById(id, {
    categoryLabel: f.categoryLabel,
    itemLabel: f.itemLabel,
    varietyLabel: f.varietyLabel,
    marketLabel: f.marketLabel,
  });

  return (
    <AppShell
      header={
        <DetailHeader
          title="경매 상세 결과"
          onBack={() => router.history.back()}
        />
      }
    >
      {!record ? (
        <div className="p-8 text-center text-[13px] text-[#6C757D]">
          경매 정보를 찾을 수 없어요.
          <div className="mt-3">
            <Link to="/market" className="text-[#3A8A3A] underline">
              시세 화면으로 돌아가기
            </Link>
          </div>
        </div>
      ) : (
        <dl className="mx-4 mt-4 divide-y divide-[#F1F3F5] rounded-[12px] border border-[#E9ECEF] bg-white">
          <Row label="경매시간" value={`${record.auctionTime}`} />
          <Row label="부류" value={record.category} />
          <Row label="품목" value={record.cropName} />
          <Row label="품종" value={record.varietyName} />
          <Row label="규격" value={record.packageLabel} />
          <Row
            label="경락가"
            value={`${record.price.toLocaleString()}원`}
            highlight
          />
          <Row label="kg당 환산" value={`${record.pricePerKg.toLocaleString()}원/kg`} />
          <Row label="수량" value={`${record.count}건`} />
          <Row label="도매시장" value={record.marketName} />
          <Row label="도매법인" value={record.corporationName} />
          <Row label="출하지" value={record.origin} />
        </dl>
      )}
      <div className="h-6" />
    </AppShell>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <dt className="text-[12.5px] text-[#868E96]">{label}</dt>
      <dd
        className={
          highlight
            ? "text-[15px] font-bold text-[#E03131]"
            : "text-[13.5px] font-semibold text-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}
