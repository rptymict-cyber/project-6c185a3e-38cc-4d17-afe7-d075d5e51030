import { useCallback } from "react";
import { useRouter } from "@tanstack/react-router";

/**
 * 공통 뒤로가기 훅.
 *
 * - 앱 내부 히스토리가 있으면 이전 화면으로 돌아간다.
 * - 딥링크/새 탭 진입처럼 히스토리가 없으면 논리적 부모 경로(fallback)로 이동한다.
 *
 * 상세·설정·선택 화면의 DetailHeader `onBack`에는 반드시 이 훅을 사용한다.
 */
export function useBackTo(fallback: string): () => void {
  const router = useRouter();

  return useCallback(() => {
    const canGoBack =
      typeof window !== "undefined" &&
      (router.history.canGoBack?.() ?? window.history.length > 1);

    if (canGoBack) {
      router.history.back();
      return;
    }
    router.navigate({ to: fallback });
  }, [router, fallback]);
}
