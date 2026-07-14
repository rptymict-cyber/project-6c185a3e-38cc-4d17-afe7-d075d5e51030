import { create } from "zustand";

type State = {
  granted: boolean | null;
  requested: boolean;
  request: () => void;
  setGranted: (v: boolean) => void;
};

export const useLocation = create<State>((set, get) => ({
  granted: null,
  requested: false,
  setGranted: (v) => set({ granted: v }),
  request: () => {
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
