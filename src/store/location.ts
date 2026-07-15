import { create } from "zustand";

type State = {
  granted: boolean | null;
  requested: boolean;
  request: () => void;
  setGranted: (v: boolean) => void;
};

// mock 단계에서는 위치 좌표를 사용하지 않으므로 기본값을 허용 상태로 두어
// 홈/예측/날씨 상세가 권한 응답을 기다리지 않고 즉시 렌더되게 한다.
// 실 연동(틸다) 시 초기값을 null로 되돌리고 request()를 자동 호출.
export const useLocation = create<State>((set, get) => ({
  granted: true,
  requested: true,
  setGranted: (v) => set({ granted: v }),
  request: () => {
    // 실 연동 시 위치 기반 활성화: 아래 geolocation 호출을 사용.
    if (get().requested) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      set({ requested: true, granted: false });
      return;
    }
    set({ requested: true });
    navigator.geolocation.getCurrentPosition(
      () => set({ granted: true }),
      () => set({ granted: false }),
      { timeout: 10000 },
    );
  },
}));
