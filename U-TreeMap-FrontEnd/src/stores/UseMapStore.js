import { create } from 'zustand';

export const useMapStore = create((set) => ({
  selectedTreeId: null, // 선택된 나무 데이터
  setSelectedTreeId: (tree) => set({ selectedTreeId: tree }),
  clearSelection: () => set({ selectedTree: null }),
}));
