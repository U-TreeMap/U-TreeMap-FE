// src/features/map/loadTreeMarkers.js

import mapboxgl from "mapbox-gl";
import { createMarkerElement,createSelectedMarkerElement } from "./createMarkerEl";
// import { createSelectedMarkerElement } from "./createSelectedMarkerEl";

import { fetchAllTreeMarkers } from "../../api/utreeMap";
import { useMapStore } from "../../stores/UseMapStore";

let treeMarkers = [];

// ✅ 선택 상태 관리
let selectedTreeId = null;
let selectedMarkerEl = null;
let selectedOriginalEl = null;

export async function loadTreeMarkers(map) {
  try {
    const markers = await fetchAllTreeMarkers();

    markers.forEach((tree) => {
      // 기본 마커
      const el = createMarkerElement(
        tree.markerValue / 150 + 10,
        tree.speciesId
      );

      el.addEventListener("click", (e) => {
        e.stopPropagation();

        /** 1️⃣ 이전 선택 마커 복구 */
        if (selectedMarkerEl && selectedOriginalEl) {
          selectedMarkerEl.replaceWith(selectedOriginalEl);
        }

        /** 2️⃣ 현재 마커를 선택 상태로 변경 */
        const selectedEl = createSelectedMarkerElement();

        // 클릭 이벤트 다시 연결 (중요!)
        selectedEl.addEventListener("click", (e) => {
          e.stopPropagation();
          useMapStore.getState().setSelectedTreeId(tree.treeId);
        });

        el.replaceWith(selectedEl);

        /** 3️⃣ 상태 저장 */
        selectedMarkerEl = selectedEl;
        selectedOriginalEl = el;
        selectedTreeId = tree.treeId;

        /** 4️⃣ zustand에 treeId 저장 */
        useMapStore.getState().setSelectedTreeId(tree.treeId);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([tree.longitude, tree.latitude]);

      treeMarkers.push(marker);
    });

    console.log(`🌳 Tree markers prepared: ${treeMarkers.length}`);
  } catch (err) {
    console.error("❌ Tree JSON Load Failed", err);
  }
}

/** 🌳 마커 표시 */
export function showTreeMarkers(map) {
  treeMarkers.forEach((m) => m.addTo(map));
}

/** 🌳 마커 숨기기 */
export function hideTreeMarkers() {
  treeMarkers.forEach((m) => m.remove());
}
