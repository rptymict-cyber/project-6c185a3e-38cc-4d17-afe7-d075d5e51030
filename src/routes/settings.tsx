import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MessageSquare, ChevronRight, Bell, Info } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "설정 — AGDICT" },
      { name: "description", content: "알림 설정, 피드백, 앱 평가." },
    ],
  }),
});

// 스토어 등록 후 값만 채우면 자동 연결됩니다.
const STORE_URLS = { ios: "", android: "" };

function openStoreReview() {
  try {
    const ua =
      typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const url = isIOS ? STORE_URLS.ios : STORE_URLS.android;
    if (url) {
      window.location.href = url;
      return true;
    }
    toast("스토어 등록 후 이용하실 수 있어요");
    return false;
  } catch {
    toast("스토어로 이동할 수 없어요");
    return false;
  }
}

function SettingsPage() {
  return (
    <AppShell header={<AppHeader title="설정" />}>
      <div className="px-4 pt-4 pb-8">
        <SectionLabel>알림</SectionLabel>
        <div className="overflow-hidden rounded-[10px] bg-surface">
          <LinkRow
            to="/notifications/settings"
            icon={<Bell className="h-5 w-5" />}
            title="알림 설정"
            subtitle="시세·경매 알림 수신 관리"
          />
        </div>

        <SectionLabel className="mt-8">피드백</SectionLabel>
        <div className="overflow-hidden rounded-[10px] bg-surface">
          <RatingRow />
          <div className="mx-4 h-px bg-border" />
          <MessageRow />
        </div>

        <SectionLabel className="mt-8">정보</SectionLabel>
        <div className="overflow-hidden rounded-[10px] bg-surface">
          <LinkRow
            to="/data-guide"
            icon={<Info className="h-5 w-5" />}
            title="데이터 기준 안내"
            subtitle="가격 단위·출처·기준일 안내"
          />
          <div className="mx-4 h-px bg-border" />
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="text-[14px] font-semibold text-foreground">
                버전 정보
              </div>
              <div className="text-[11px] text-muted-foreground">
                최신 버전을 사용 중입니다
              </div>
            </div>
            <span className="font-data text-[13px] text-muted-foreground">
              v0.1.0 Beta
            </span>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] text-muted-foreground">
          AGDICT · 농산물 시세 조회
        </div>
      </div>
    </AppShell>
  );
}

function LinkRow({
  to,
  icon,
  title,
  subtitle,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Link
      to={to}
      className="flex w-full items-center gap-3 px-4 py-4 text-left"
    >
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#F0F9F0] text-[#3A8A3A]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-foreground">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-muted-foreground">{subtitle}</div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}


function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-2 px-1 text-[12px] font-bold text-muted-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function Row({
  icon,
  title,
  subtitle,
  onClick,
  trigger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  trigger?: boolean;
}) {
  const content = (
    <>
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#F0F9F0] text-[#3A8A3A]">
        {icon}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="text-[14px] font-semibold text-foreground">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-muted-foreground">{subtitle}</div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </>
  );
  if (trigger) {
    return (
      <button
        type="button"
        className="flex w-full items-center gap-3 px-4 py-4 text-left"
      >
        {content}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 text-left"
    >
      {content}
    </button>
  );
}

/* ---------------- Rating (bottom sheet) ---------------- */

function RatingRow({ onSubmitted }: { onSubmitted: () => void }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRating(0);
    setText("");
    setSubmitting(false);
  };

  const canSubmit = rating > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      kind: "rating",
      rating,
      message: text.trim() || "(no message)",
    });
    if (error) {
      setSubmitting(false);
      toast("전송에 실패했어요. 잠시 후 다시 시도해 주세요");
      return;
    }
    setOpen(false);
    reset();
    onSubmitted();
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DrawerTrigger asChild>
        <div>
          <Row
            trigger
            icon={<Star className="h-5 w-5" />}
            title="이 앱을 평가해주세요"
            subtitle="별점과 의견을 남겨주세요"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-[430px] bg-background">
        <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-[#E9ECEF]" />
        <div className="px-5 pb-6 pt-4">
          <h3 className="text-center text-[17px] font-bold text-foreground">
            앱이 마음에 드셨나요?
          </h3>
          <p className="mt-1 text-center text-[12px] text-muted-foreground">
            여러분의 별점이 큰 힘이 됩니다
          </p>

          <div className="mt-5 flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = n <= rating;
              return (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n}점`}
                  onClick={() => setRating(n)}
                  className="p-1"
                >
                  <Star
                    size={36}
                    strokeWidth={1.5}
                    color={active ? "#F08C00" : "#E9ECEF"}
                    fill={active ? "#F08C00" : "transparent"}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 200))}
              placeholder="불편한 점이나 개선 의견을 남겨주세요"
              className="h-[120px] w-full resize-none rounded-[10px] bg-[#F8F9FA] px-3 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#3A8A3A]/30"
              maxLength={200}
            />
            <div className="mt-1 text-right text-[11px] text-muted-foreground">
              {text.length}/200
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={cn(
              "mt-3 w-full rounded-lg py-3 text-[14px] font-bold text-white transition-colors",
              canSubmit ? "bg-[#3A8A3A]" : "bg-[#ADB5BD]",
            )}
          >
            {submitting ? "전송 중..." : "제출하기"}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/* ---------------- Message (bottom sheet) ---------------- */

function MessageRow() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = text.trim().length > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      kind: "message",
      message: text.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast("전송에 실패했어요. 잠시 후 다시 시도해 주세요");
      return;
    }
    setOpen(false);
    setText("");
    toast("소중한 의견 감사합니다! 🙏");
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setText("");
          setSubmitting(false);
        }
      }}
    >
      <DrawerTrigger asChild>
        <div>
          <Row
            trigger
            icon={<MessageSquare className="h-5 w-5" />}
            title="피드백 보내기"
            subtitle="개선 아이디어를 알려주세요"
          />
        </div>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-[430px] bg-background">
        <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-[#E9ECEF]" />
        <div className="px-5 pb-6 pt-4">
          <h3 className="text-center text-[17px] font-bold text-foreground">
            의견을 들려주세요
          </h3>
          <p className="mt-1 text-center text-[12px] text-muted-foreground">
            불편한 점, 원하는 기능 무엇이든 좋아요
          </p>
          <div className="mt-5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 200))}
              placeholder="불편한 점이나 개선 의견을 남겨주세요"
              className="h-[120px] w-full resize-none rounded-[10px] bg-[#F8F9FA] px-3 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#3A8A3A]/30"
              maxLength={200}
            />
            <div className="mt-1 text-right text-[11px] text-muted-foreground">
              {text.length}/200
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={cn(
              "mt-3 w-full rounded-lg py-3 text-[14px] font-bold text-white transition-colors",
              canSubmit ? "bg-[#3A8A3A]" : "bg-[#ADB5BD]",
            )}
          >
            {submitting ? "전송 중..." : "제출하기"}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/* ---------------- Thanks dialog ---------------- */

function ThanksDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto max-w-[340px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-[17px]">
            소중한 의견 감사합니다! 🙏
          </DialogTitle>
          <DialogDescription className="text-center">
            앱스토어에도 별점을 남겨주시면 큰 도움이 됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid gap-2">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => onOpenChange(false)}
            className="grid place-items-center rounded-lg bg-[#3A8A3A] py-2.5 text-[14px] font-bold text-white"
          >
            앱스토어 리뷰 남기기
          </a>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="grid place-items-center rounded-lg bg-[#F1F3F5] py-2.5 text-[14px] font-semibold text-foreground"
          >
            닫기
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
