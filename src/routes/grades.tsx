import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DetailHeader } from "@/components/detail-header";
import { CROPS } from "@/lib/mock/crops";
import { cn } from "@/lib/utils";
import { CropIcon } from "@/components/crop-icon";

export const Route = createFileRoute("/grades")({
  component: GradesPage,
  head: () => ({
    meta: [
      { title: "등급 정보 — AGDICT" },
      { name: "description", content: "상·중·하 등급별 농산물 시세를 확인하세요." },
    ],
  }),
});

function GradesPage() {
  const router = useRouter();
  const withGrades = CROPS.filter((c) => c.grades);
  return (
    <AppShell header={<DetailHeader title="등급별 가격 정보" onBack={() => router.history.back()} />}>
      <div className="px-4 pt-4 pb-8">
        <div className="rounded-[10px] bg-accent px-4 py-3 text-[12px] leading-relaxed text-accent-foreground">
          KAMIS 기준 <strong>상·중·하</strong> 3등급 시세입니다. 등급 구분이
          가능한 품목만 표시됩니다.
        </div>

        <ul className="mt-4 grid gap-3">
          {withGrades.map((c) => {
            const g = c.grades!;
            const max = Math.max(g.top, g.mid, g.low);
            return (
              <li key={c.id} className="rounded-[10px] bg-surface p-4">
                <div className="flex items-center gap-2">
                  <CropIcon name={c.name} size={22} />
                  <span className="text-[15px] font-bold">{c.name}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {c.updatedAt}
                  </span>
                </div>
                <div className="mt-3 grid gap-2">
                  {(
                    [
                      { k: "상", v: g.top, cls: "bg-primary" },
                      { k: "중", v: g.mid, cls: "bg-primary/60" },
                      { k: "하", v: g.low, cls: "bg-primary/30" },
                    ] as const
                  ).map((row) => (
                    <div key={row.k} className="grid grid-cols-[24px_1fr_auto] items-center gap-3">
                      <span className="text-center text-[12px] font-bold text-foreground">
                        {row.k}
                      </span>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn("h-full rounded-full", row.cls)}
                          style={{ width: `${(row.v / max) * 100}%` }}
                        />
                      </div>
                      <span className="font-data text-[13px] font-bold tabular-nums">
                        {row.v.toLocaleString()}
                        <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                          원/kg
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
