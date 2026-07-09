/**
 * 앱스토어 리뷰 딥링크 상수와 헬퍼.
 *
 * MVP 단계에서는 웹앱이므로 스토어 링크가 아직 없을 수 있다.
 * URL이 비어 있거나 열기에 실패해도 앱이 깨지지 않게 조용히 fallback 한다.
 * 실제 스토어 등록 시 아래 URL만 교체하면 된다.
 */
export const STORE_URLS = {
  ios: "", // 예: "https://apps.apple.com/app/id0000000000?action=write-review"
  android: "", // 예: "https://play.google.com/store/apps/details?id=app.lovable.agdict&showAllReviews=true"
} as const;

function detectPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

/**
 * 스토어 리뷰 페이지로 이동을 시도한다.
 * - 링크가 비어 있거나 열 수 없으면 조용히 false를 반환한다.
 */
export function openStoreReview(): boolean {
  try {
    const platform = detectPlatform();
    const url =
      platform === "ios"
        ? STORE_URLS.ios
        : platform === "android"
          ? STORE_URLS.android
          : STORE_URLS.ios || STORE_URLS.android;
    if (!url) return false;
    if (typeof window === "undefined") return false;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  } catch {
    return false;
  }
}
