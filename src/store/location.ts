import { create } from "zustand";

export type Coords = { lat: number; lng: number };

/** 위치 권한 미허용/실패 시 사용하는 기본 좌표(서울시청) */
const DEFAULT_COORDS: Coords = { lat: 37.5665, lng: 126.978 };

type State = {
  granted: boolean | null;
  requested: boolean;
  pending: boolean;
  coords: Coords | null;
  /**
   * ⚠️ 임시(개발/프리뷰 확인용) 상태.
   * 실제 사양은 브라우저(OS)의 네이티브 위치 권한 팝업이며, 이 확인용 모달은
   * 러버블 프리뷰(iframe)에서 네이티브 팝업이 노출되지 않아 흐름 확인이
   * 불가능한 문제를 우회하기 위한 임시 장치다. 배포(iframe 밖) 환경에서
   * 네이티브 팝업 동작을 확인한 뒤 제거 대상.
   */
  promptOpen: boolean;
  /** 임시 확인용 모달의 허용/거부 응답 처리 (임시, 제거 대상) */
  resolvePrompt: (allow: boolean) => void;
  /** 실제 브라우저 Geolocation 권한을 요청한다. 허용 여부를 반환. */
  request: (opts?: { silent?: boolean }) => Promise<boolean>;
  setGranted: (v: boolean) => void;
};

/** 프리뷰(iframe) 환경에서만 임시 확인용 모달을 사용한다. (임시, 제거 대상) */
function shouldUseDevPrompt() {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

let promptResolver: ((allow: boolean) => void) | null = null;

export const useLocation = create<State>((set, get) => ({
  granted: false,
  requested: false,
  pending: false,
  coords: null,
  promptOpen: false,
  setGranted: (v) => set({ granted: v, requested: true }),

  // 임시 확인용 모달 응답 처리 (실제 사양은 OS 네이티브 팝업)
  resolvePrompt: (allow) => {
    set({ promptOpen: false });
    const r = promptResolver;
    promptResolver = null;
    r?.(allow);
  },

  request: async (opts) => {
    if (get().pending) return get().granted === true;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      set({ requested: true, granted: false, pending: false });
      return false;
    }

    // ⚠️ 임시: 프리뷰(iframe)에서는 OS 네이티브 권한 팝업이 뜨지 않으므로
    // 개발 확인용 모달을 먼저 띄운다. 배포 환경 검증 후 이 블록은 제거한다.
    if (!opts?.silent && shouldUseDevPrompt()) {
      const allowed = await new Promise<boolean>((resolve) => {
        promptResolver = resolve;
        set({ promptOpen: true });
      });
      if (!allowed) {
        set({ granted: false, requested: true, pending: false, coords: null });
        return false;
      }
    }

    set({ pending: true });
    const nativeAllowed = await new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          set({
            granted: true,
            requested: true,
            pending: false,
            coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
          resolve(true);
        },
        () => {
          set({ granted: false, requested: true, pending: false, coords: null });
          resolve(false);
        },
        { timeout: 10000, maximumAge: 5 * 60 * 1000 },
      );
    });

    // ⚠️ 임시: 프리뷰에서는 실제 API가 막혀 실패하므로, 확인용 모달에서 "허용"을
    // 누른 흐름을 이어볼 수 있도록 기본 좌표로 대체한다. 배포 시 제거 대상.
    if (!nativeAllowed && !opts?.silent && shouldUseDevPrompt()) {
      set({
        granted: true,
        requested: true,
        pending: false,
        coords: DEFAULT_COORDS,
      });
      return true;
    }

    return nativeAllowed;
  },
}));
