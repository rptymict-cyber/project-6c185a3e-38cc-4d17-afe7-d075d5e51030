import { create } from "zustand";

type State = {
  /** 사용자가 직접 선택한 지역 id. null이면 현재 위치/기본 지역 사용 */
  regionId: string | null;
  setRegionId: (id: string | null) => void;
};

export const useWeatherRegion = create<State>((set) => ({
  regionId: null,
  setRegionId: (id) => set({ regionId: id }),
}));
