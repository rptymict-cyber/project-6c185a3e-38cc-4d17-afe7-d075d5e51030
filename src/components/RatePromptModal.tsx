import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { openStoreReview } from "@/lib/store-review";
import { cn } from "@/lib/utils";

/**
 * 앱 진입 시 뜨는 별점 유도 팝업.
 *
 * - 매 앱 진입(마운트)마다 1회 노출한다. 라우트 이동에는 반응하지 않는다.
 * - "다시 보지 않기" → hidden 저장 → 이후 미노출.
 * - "나중에" / 딤 클릭 → 이번 세션만 닫힘, 다음 접속 시 다시 노출.
 * - 4~5점 → 스토어 리뷰 페이지로 이동 시도 후 hidden 저장.
 * - 1~3점 → 내부 피드백 입력을 받아 Supabase feedback 테이블에 저장 후 hidden.
 */

const STORAGE_KEY = "agdict:ratePrompt";

type Persist = { hidden: boolean; lastShownAt: string };

function loadPersist(): Persist | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Persist>;
    return {
      hidden: Boolean(parsed.hidden),
      lastShownAt: typeof parsed.lastShownAt === "string" ? parsed.lastShownAt : "",
    };
  } catch {
    return null;
  }
}

function savePersist(next: Persist) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / private-mode errors
  }
}

export function RatePromptModal() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [step, setStep] = useState<"rate" | "feedback">("rate");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 앱 진입 시 1회만 판단
  useEffect(() => {
    const p = loadPersist();
    if (p?.hidden) return;
    setOpen(true);
    savePersist({ hidden: false, lastShownAt: new Date().toISOString() });
  }, []);

  const closeLater = () => {
    // 이번 세션만 닫음. hidden은 유지.
    setOpen(false);
    setTimeout(reset, 200);
  };

  const closeForever = () => {
    savePersist({ hidden: true, lastShownAt: new Date().toISOString() });
    setOpen(false);
    setTimeout(reset, 200);
  };

  const reset = () => {
    setRating(0);
    setHover(0);
    setStep("rate");
    setText("");
    setSubmitting(false);
  };

  const handlePickRating = (n: number) => {
    setRating(n);
    if (n >= 4) {
      const opened = openStoreReview();
      if (opened) toast("스토어로 이동합니다");
      closeForever();
      return;
    }
    // 1~3점 → 내부 피드백으로 전환
    setStep("feedback");
  };

  const submitFeedback = async () => {
    if (submitting) return;
    setSubmitting(true);
    const message = text.trim() || "(별점 피드백)";
    const { error } = await supabase.from("feedback").insert({
      kind: "rating",
      rating,
      message,
    });
    if (error) {
      setSubmitting(false);
      toast("전송에 실패했어요. 잠시 후 다시 시도해 주세요");
      return;
    }
    toast("소중한 의견 감사합니다! 🙏");
    closeForever();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-label="앱 평가"
    >
      {/* Dim */}
      <button
        type="button"
        aria-label="닫기"
        onClick={closeLater}
        className="absolute inset-0 bg-black/50"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[320px] rounded-[20px] bg-white p-6 shadow-2xl">
        {/* App icon badge */}
        <div className="flex justify-center">
          <div
            className="grid h-16 w-16 place-items-center rounded-[18px] shadow-md"
            style={{
              background: "linear-gradient(135deg, #3A8A3A 0%, #62B347 100%)",
            }}
          >
            <Star className="h-8 w-8 fill-white text-white" strokeWidth={1.5} />
          </div>
        </div>

        {step === "rate" ? (
          <>
            <h2 className="mt-4 text-center text-[17px] font-bold text-foreground">
              앱이 마음에 드시나요?
            </h2>
            <p className="mt-1 text-center text-[12.5px] text-[#868E96]">
              별점을 남겨주시면 큰 힘이 됩니다!
            </p>

            {/* Stars */}
            <div
              className="mt-5 flex items-center justify-center gap-1.5"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= (hover || rating);
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n}점`}
                    onClick={() => handlePickRating(n)}
                    onMouseEnter={() => setHover(n)}
                    className="p-1 transition-transform active:scale-95"
                  >
                    <Star
                      size={32}
                      strokeWidth={1.5}
                      color={active ? "#F59F00" : "#DEE2E6"}
                      fill={active ? "#F59F00" : "transparent"}
                    />
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={closeLater}
                className="px-2 py-2 text-[13px] font-semibold text-[#868E96]"
              >
                나중에
              </button>
              <button
                type="button"
                onClick={closeForever}
                className="px-2 py-2 text-[13px] font-semibold text-[#495057]"
              >
                다시 보지 않기
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-center text-[17px] font-bold text-foreground">
              의견을 들려주세요
            </h2>
            <p className="mt-1 text-center text-[12.5px] text-[#868E96]">
              불편하거나 아쉬웠던 점을 알려주시면 개선하겠습니다.
            </p>

            <div className="mt-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 200))}
                placeholder="개선 의견을 남겨주세요"
                className="h-[110px] w-full resize-none rounded-[10px] bg-[#F8F9FA] px-3 py-3 text-[13px] outline-none placeholder:text-[#ADB5BD] focus:ring-2 focus:ring-[#3A8A3A]/30"
                maxLength={200}
              />
              <div className="mt-1 text-right text-[11px] text-[#868E96]">
                {text.length}/200
              </div>
            </div>

            <button
              type="button"
              onClick={submitFeedback}
              disabled={submitting}
              className={cn(
                "mt-2 w-full rounded-lg py-3 text-[14px] font-bold text-white transition-colors",
                submitting ? "bg-[#ADB5BD]" : "bg-[#3A8A3A]",
              )}
            >
              {submitting ? "전송 중..." : "보내기"}
            </button>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={closeLater}
                className="px-2 py-2 text-[12.5px] font-semibold text-[#868E96]"
              >
                나중에
              </button>
              <button
                type="button"
                onClick={closeForever}
                className="px-2 py-2 text-[12.5px] font-semibold text-[#495057]"
              >
                다시 보지 않기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
