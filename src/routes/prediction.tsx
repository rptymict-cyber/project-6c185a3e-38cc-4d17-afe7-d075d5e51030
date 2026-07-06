import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LineChart, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { CROPS } from "@/lib/mock/crops";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prediction")({
  component: PredictionPage,
  head: () => ({
    meta: [
      { title: "AI 예측 (Beta) — AGDICT" },
      {
        name: "description",
        content: "농민·도매상 관점에서 유리한 시점을 알려드릴 AI 가격 예측 기능을 준비 중입니다.",
      },
    ],
  }),
});

const ROLE_KEY = "agdict.userRole";
type UserRole = "farmer" | "wholesaler";

function PredictionPage() {
  const [roleOpen, setRoleOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROLE_KEY) as UserRole | null;
      if (saved === "farmer" || saved === "wholesaler") {
        setRole(saved);
      } else {
        setRoleOpen(true);
      }
    } catch {
      setRoleOpen(true);
    }
  }, []);

  const pickRole = (r: UserRole) => {
    setRole(r);
    try {
      localStorage.setItem(ROLE_KEY, r);
    } catch {
      /* ignore */
    }
    setRoleOpen(false);
  };

  const aiReady = CROPS.filter((c) => c.aiReady).slice(0, 5);

  return (
    <AppShell
      header={
        <AppHeader
          title={
            <span className="inline-flex items-center gap-2">
              AI 예측
              <span className="rounded-full bg-[#F0F9F0] px-2 py-0.5 text-[10px] font-bold text-[#3A8A3A]">
                Beta
              </span>
            </span>
          }
        />
      }
    >
      <div className="flex min-h-full flex-col px-5 pb-10 pt-10">
        {role && (
          <div className="mb-6 text-center text-[12px] text-muted-foreground">
            {role === "farmer"
              ? "🌾 농민 관점 — 팔 때 유리한 시점을 안내할게요"
              : "🏪 도매상 관점 — 살 때 유리한 시점을 안내할게요"}
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <LineChart size={64} color="#3A8A3A" strokeWidth={1.5} />
          <span className="mt-4 inline-flex items-center rounded-full bg-[#F0F9F0] px-2.5 py-1 text-[11px] font-bold text-[#3A8A3A]">
            Beta · 준비 중
          </span>
          <h1 className="mt-3 text-[18px] font-black tracking-tight text-foreground">
            AI 가격 예측 준비 중이에요
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            더 정확한 예측을 위해 열심히 준비하고 있어요.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-center text-[12px] font-bold text-muted-foreground">
            예측 가능 작물
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {aiReady.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1 rounded-full border border-[#3A8A3A] bg-[#F0F9F0] px-3 py-1.5 text-[13px] font-semibold text-[#1F5C1F]"
              >
                <span>{c.emoji}</span>
                {c.name}
              </span>
            ))}
          </div>
        </div>

        <Link
          to="/market"
          className="mt-8 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#3A8A3A] py-3 text-[14px] font-bold text-white"
        >
          시세 바로가기
          <ArrowRight className="h-4 w-4" />
        </Link>

        <button
          type="button"
          onClick={() => setRoleOpen(true)}
          className="mt-3 w-full rounded-lg border border-border bg-background py-3 text-[13px] font-semibold text-foreground"
        >
          사용 목적 다시 선택
        </button>

        <p className="mt-auto pt-8 text-center text-[12px] text-[#ADB5BD]">
          예측 기능이 추가되면 알려드릴게요
        </p>
      </div>

      <RoleDialog open={roleOpen} onOpenChange={setRoleOpen} onPick={pickRole} />
    </AppShell>
  );
}

function RoleDialog({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPick: (r: UserRole) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto max-w-[340px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-[17px]">
            어떤 목적으로 사용하시나요?
          </DialogTitle>
          <DialogDescription className="text-center">
            선택한 관점에 맞춰 예측 정보를 보여드려요
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <RoleButton
            emoji="🌾"
            title="농민"
            sub="팔 때 유리한 시점"
            onClick={() => onPick("farmer")}
          />
          <RoleButton
            emoji="🏪"
            title="도매상"
            sub="살 때 유리한 시점"
            onClick={() => onPick("wholesaler")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RoleButton({
  emoji,
  title,
  sub,
  onClick,
  active,
}: {
  emoji: string;
  title: string;
  sub: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl border border-border bg-surface px-3 py-4 transition-colors hover:border-[#3A8A3A] hover:bg-[#F0F9F0]",
        active && "border-[#3A8A3A] bg-[#F0F9F0]",
      )}
    >
      <span className="text-[28px]">{emoji}</span>
      <span className="text-[14px] font-bold text-foreground">{title}</span>
      <span className="text-[11px] text-muted-foreground">{sub}</span>
    </button>
  );
}
