/**
 * 앱 전역 작물 선택 상태.
 *
 * - `committed`: 앱 전체에서 실제 사용하는 확정된 선택. localStorage에 persist.
 * - `draft`: 작물 선택 페이지에서 편집 중인 임시 선택. 저장하지 않음.
 *
 * 화면마다 로컬 state로 품목/부류/품종을 들고 있지 말고,
 * 반드시 이 스토어의 `committed` 값을 단일 기준으로 참조할 것.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type VarietyIdOrAll = string | "ALL";

export interface CropSelection {
  categoryId?: string;
  itemId?: string;
  varietyId?: VarietyIdOrAll;
}

interface CropSelectionState {
  committed: CropSelection;
  draft: CropSelection;
  startDraftFromCommitted: () => void;
  setDraftCategory: (categoryId: string) => void;
  setDraftItem: (itemId: string) => void;
  setDraftVariety: (varietyId: VarietyIdOrAll) => void;
  clearDraftCategory: () => void;
  clearDraftItem: () => void;
  clearDraftVariety: () => void;
  discardDraft: () => void;
  commitDraft: () => void;
}

const EMPTY: CropSelection = {};

export const useCropSelection = create<CropSelectionState>()(
  persist(
    (set, get) => ({
      committed: EMPTY,
      draft: EMPTY,

      startDraftFromCommitted: () => set({ draft: { ...get().committed } }),

      setDraftCategory: (categoryId) =>
        set((s) => {
          const current = s.draft;
          if (current.categoryId === categoryId) {
            // 같은 부류 재선택: 하위(item/variety) 유지
            return { draft: { ...current, categoryId } };
          }
          // 다른 부류로 변경: item/variety 초기화
          return {
            draft: {
              categoryId,
              itemId: undefined,
              varietyId: undefined,
            },
          };
        }),

      setDraftItem: (itemId) =>
        set((s) => {
          const current = s.draft;
          if (current.itemId === itemId) {
            // 같은 품목 재선택: variety 유지
            return { draft: { ...current, itemId } };
          }
          // 다른 품목으로 변경: variety 초기화
          return {
            draft: {
              ...current,
              itemId,
              varietyId: undefined,
            },
          };
        }),

      setDraftVariety: (varietyId) =>
        set((s) => ({ draft: { ...s.draft, varietyId } })),

      discardDraft: () => set({ draft: EMPTY }),

      commitDraft: () => set((s) => ({ committed: { ...s.draft } })),
    }),
    {
      name: "agdict:crop-selection",
      storage: createJSONStorage(() => localStorage),
      // committed만 persist. draft는 세션 임시 상태이므로 저장 X.
      partialize: (state) => ({ committed: state.committed }),
    },
  ),
);
