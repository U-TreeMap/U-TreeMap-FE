// src/api/utreeMap.ts
import { apiClient } from "../lib/apiClient";

export async function fetchRegionSummary() {
  const res = await apiClient.get("/api/v1/utree-map");
  return res.data;
}

export async function fetchAllTreeMarkers() {
  const res = await apiClient.get("/api/v1/utree-map/markers",{
    params: {
      leftTopLat: 35.00000,
      leftTopLng: 129.00000,
      rightBottomLat: 35.99999,
      rightBottomLng: 129.99999,
    }
  });
  return res.data;
}
