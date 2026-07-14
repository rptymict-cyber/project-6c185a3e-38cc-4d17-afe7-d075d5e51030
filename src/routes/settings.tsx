import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageSquare, ChevronRight, Bell, Info, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";
import { useFeedback } from "@/store/feedback";
import { openStoreReview } from "@/lib/store-review";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "설정 — AGDICT" },
      { name: "description", content: "알림 설정, 의견 보내기, 앱 정보." },
    ],
  }),
});

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
          <FeedbackRow />
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

/* ============================================================
 * 의견 보내기 — 감정 → 후속 질문(칩) → 자유입력 → 제출
 * ============================================================ */

type SentimentValue = 1 | 2 | 3 | 4 | 5;
type SentimentGroup = "negative" | "neutral" | "positive";

const SENTIMENTS: {
  value: SentimentValue;
  emoji: string;
  label: string;
  group: SentimentGroup;
}[] = [
  { value: 1, emoji: "😠", label: "매우나쁨", group: "negative" },
  { value: 2, emoji: "🙁", label: "나쁨", group: "negative" },
  { value: 3, emoji: "😐", label: "보통", group: "neutral" },
  { value: 4, emoji: "🙂", label: "만족", group: "positive" },
  { value: 5, emoji: "😍", label: "매우만족", group: "positive" },
];

const CHIPS_BY_GROUP: Record<
  SentimentGroup,
  { title: string; options: string[] }
> = {
  negative: {
    title: "어떤 점이 아쉬웠나요?",
    options: [
      "시세가 부정확해요",
      "예측이 안 맞아요",
      "원하는 품목이 없어요",
      "화면이 복잡해요",
      "자주 느려요",
      "기타",
    ],
  },
  neutral: {
    title: "가장 개선이 필요한 곳은 어디인가요?",
    options: [
      "시세 정확도",
      "예측 정확도",
      "품목 종류",
      "화면 사용성",
      "속도·안정성",
      "기타",
    ],
  },
  positive: {
    title: "어떤 점이 좋았나요?",
    options: [
      "시세가 정확해요",
      "예측이 도움돼요",
      "화면이 보기 편해요",
      "원하는 품목이 많아요",
      "빠르고 가벼워요",
      "기타",
    ],
  },
};

function groupOf(v: SentimentValue): SentimentGroup {
  if (v <= 2) return "negative";
  if (v === 3) return "neutral";
  return "positive";
}

function FeedbackRow() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-4 text-left"
        >
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#F0F9F0] text-[#3A8A3A]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-foreground">
              의견 보내기
            </div>
            <div className="text-[11px] text-muted-foreground">
              평가와 개선 의견을 한 번에 남겨주세요
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-w-[430px] bg-background">
        <FeedbackSheet onClose={() => setOpen(false)} key={open ? "o" : "c"} />
      </DrawerContent>
    </Drawer>
  );
}

function FeedbackSheet({ onClose }: { onClose: () => void }) {
  const addLocal = useFeedback((s) => s.add);

  const [sentiment, setSentiment] = useState<SentimentValue | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [thanks, setThanks] = useState<null | {
    positive: boolean;
    rating: SentimentValue;
  }>(null);

  const group = sentiment ? groupOf(sentiment) : null;

  const pickSentiment = (v: SentimentValue) => {
    if (sentiment !== null) {
      const prevGroup = groupOf(sentiment);
      const nextGroup = groupOf(v);
      if (prevGroup !== nextGroup) setChips([]);
    }
    setSentiment(v);
  };

  const toggleChip = (opt: string) => {
    setChips((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
    );
  };

  const canSubmit = sentiment !== null && !submitting;

  const submit = async () => {
    if (!canSubmit || sentiment === null) return;
    setSubmitting(true);
    const trimmed = text.trim();
    const message = JSON.stringify({
      tags: chips,
      text: trimmed,
    });
    const { error } = await supabase.from("feedback").insert({
      kind: "sentiment",
      rating: sentiment,
      message,
      tags: chips,
    });
    if (error) {
      setSubmitting(false);
      toast("전송에 실패했어요. 잠시 후 다시 시도해 주세요");
      return;
    }
    addLocal({
      kind: "sentiment",
      rating: sentiment,
      tags: chips,
      text: trimmed,
    });
    setSubmitting(false);
    const positive = sentiment >= 4;
    if (positive) {
      setThanks({ positive: true, rating: sentiment });
    } else {
      toast("소중한 의견 감사합니다. 빠르게 개선할게요");
      onClose();
    }
  };

  if (thanks?.positive) {
    return (
      <StoreReviewPrompt
        rating={thanks.rating}
        onClose={onClose}
      />
    );
  }

  const chipConfig = group ? CHIPS_BY_GROUP[group] : null;

  const freeformTitle =
    group === "positive"
      ? "더 하고 싶은 말이 있나요?"
      : "자세히 알려주시겠어요?";
  const freeformSubtitle =
    group === "negative"
      ? "불편한 점을 남겨주시면 빠르게 개선할게요 (선택)"
      : "자유롭게 남겨주세요 (선택)";
  const placeholder =
    group === "positive"
      ? "예: 시세를 매일 아침 확인하는데 정말 편해요"
      : group === "negative"
        ? "예: 특정 품목에서 가격이 다르게 표시됐어요"
        : "자유롭게 의견을 남겨주세요";

  return (
    <div className="px-5 pb-8 pt-2">
      <div className="mx-auto h-1 w-8 rounded-full bg-[#E9ECEF]" />
      <h3 className="mt-4 text-center text-[17px] font-bold text-foreground">
        AGDICT 어떠셨나요?
      </h3>
      <p className="mt-1 text-center text-[12.5px] text-muted-foreground">
        여러분의 평가가 앱 개선에 큰 힘이 됩니다
      </p>

      {/* Sentiment row */}
      <div className="mt-6 grid grid-cols-5 gap-1">
        {SENTIMENTS.map((s) => {
          const active = sentiment === s.value;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => pickSentiment(s.value)}
              aria-label={s.label}
              aria-pressed={active}
              className="flex min-h-[64px] flex-col items-center justify-start gap-1 py-1"
            >
              <span
                className={cn(
                  "text-[30px] leading-none transition-transform duration-150",
                  active
                    ? "scale-110"
                    : "scale-100 opacity-50 grayscale",
                )}
                style={{ filter: active ? "none" : undefined }}
              >
                {s.emoji}
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  active
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground",
                )}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Follow-up (chips + textarea) — only after sentiment selected */}
      {chipConfig && (
        <>
          <div className="mt-6">
            <div className="text-[13.5px] font-bold text-foreground">
              {chipConfig.title}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {chipConfig.options.map((opt) => {
                const on = chips.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleChip(opt)}
                    aria-pressed={on}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition-colors",
                      on
                        ? "border-[#3A8A3A] bg-[#F0F9F0] font-semibold text-[#2E6E2E]"
                        : "border-border bg-background font-medium text-foreground",
                    )}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[13.5px] font-bold text-foreground">
              {freeformTitle}
            </div>
            <div className="mt-1 text-[11.5px] text-muted-foreground">
              {freeformSubtitle}
            </div>
            <div className="relative mt-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 200))}
                placeholder={placeholder}
                className="h-[110px] w-full resize-none rounded-[10px] bg-[#F8F9FA] px-3 py-3 text-[14px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#3A8A3A]/30"
                maxLength={200}
              />
              <div className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-muted-foreground">
                {text.length}/200
              </div>
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        className={cn(
          "mt-6 w-full rounded-lg py-3.5 text-[14px] font-bold text-white transition-colors",
          canSubmit ? "bg-[#3A8A3A]" : "bg-[#ADB5BD]",
        )}
      >
        {submitting ? "전송 중..." : "제출하기"}
      </button>
    </div>
  );
}

function StoreReviewPrompt({
  rating,
  onClose,
}: {
  rating: SentimentValue;
  onClose: () => void;
}) {
  const heart = useMemo(() => (rating === 5 ? "😍" : "🙂"), [rating]);
  return (
    <div className="px-5 pb-8 pt-2">
      <div className="mx-auto h-1 w-8 rounded-full bg-[#E9ECEF]" />
      <div className="mt-5 text-center text-[40px] leading-none">{heart}</div>
      <h3 className="mt-3 text-center text-[17px] font-bold text-foreground">
        소중한 의견 감사합니다!
      </h3>
      <p className="mt-2 text-center text-[13px] leading-relaxed text-muted-foreground">
        스토어에도 한 줄 남겨주시면
        <br />
        다른 농업인들에게 큰 힘이 됩니다.
      </p>
      <div className="mt-6 grid gap-2">
        <button
          type="button"
          onClick={() => {
            const opened = openStoreReview();
            if (opened) toast("스토어로 이동합니다");
            onClose();
          }}
          className="w-full rounded-lg bg-[#3A8A3A] py-3.5 text-[14px] font-bold text-white"
        >
          스토어에 리뷰 쓰기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-[#F1F3F5] py-3.5 text-[14px] font-semibold text-foreground"
        >
          다음에 할게요
        </button>
      </div>
    </div>
  );
}
