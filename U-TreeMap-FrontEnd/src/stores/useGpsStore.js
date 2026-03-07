import { create } from "zustand";

import { reverseGeocodeMapbox } from '../lib/reverseGeocode';

export const useMyGpsStore = create((set, get) => ({
  location: null,
  status: "idle", // idle | requesting | watching | error
  loading: false,
  error: null,
  watchId: null,

  getAccuracy: () => get().location?.accuracy ?? null,

  startWatch: (options = {}) => {
    if (!navigator.geolocation) {
      set({ error: "Geolocation 미지원", status: "error" });
      return;
    }

    if (get().watchId != null) return;

    set({ status: "requesting", loading: true, error: null });

    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        
      const {
        placeName: placeUOU,
        buildingName: buildingUOU,
        }= await reverseGeocodeMapbox({
            lng: 129.2555418,
            lat: 35.5383603,
        });
        console.log("UOU: ",placeUOU,buildingUOU);
        
        const { placeName, buildingName } = await reverseGeocodeMapbox({
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
        });
        console.log(`placeName: ${placeName}, buildingName: ${buildingName}`);
        
        console.log(`[GPS], time: ${pos.timestamp}, acc: ${pos.coords.accuracy}, lat: ${pos.coords.latitude}, long: ${pos.coords.longitude}`);
        set({
          location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          },
          status: "watching",
          loading: false,
          error: null,
        });
      },
      (err) => {
        set({
          error: err.message ?? "위치 추적 오류",
          status: "error",
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20_000,
        ...options,
      }
    );

    set({ watchId: id });
  },

  stopWatch: () => {
    const { watchId } = get();
    if (watchId == null) return;
    navigator.geolocation.clearWatch(watchId);
    set({ watchId: null, status: "idle", loading: false });
  },
}));
