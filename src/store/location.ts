import { create } from "zustand";

export type Coords = { lat: number; lng: number };

type State = {
  granted: boolean | null;
  requested: boolean;
  pending: boolean;
  coords: Coords | null;
  /** 실제 브라우저 Geolocation 권한을 요청한다. 허용 여부를 반환. */
  request: () => Promise<boolean>;
  setGranted: (v: boolean) => void;
};

export const useLocation = create<State>((set, get) => ({
  granted: false,
  requested: false,
  pending: false,
  coords: null,
  setGranted: (v) => set({ granted: v, requested: true }),
  request: async () => {
    if (get().pending) return get().granted === true;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      set({ requested: true, granted: false, pending: false });
      return false;
    }

    set({ pending: true });
    return new Promise<boolean>((resolve) => {
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
  },
}));
