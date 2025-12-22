import { create } from 'zustand';

export const useMapStore = create((set) => ({
  selectedTree: null, // 선택된 나무 데이터
  setSelectedTree: (tree) => set({ selectedTree: tree }),
  clearSelection: () => set({ selectedTree: null }),

  // 지도 제어용 (검색 시 이동 등을 위해)
  mapInstance: null,
  setMapInstance: (map) => set({ mapInstance: map }),
}));
