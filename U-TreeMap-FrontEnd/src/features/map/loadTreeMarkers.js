// src/features/map/loadTreeMarkers.js

import mapboxgl from "mapbox-gl";
import { createMarkerElement } from "./createMarkerEl";

let treeMarkers = []; // 🔥 전역 상태로 관리

export async function loadTreeMarkers(map) {
  try {
    const url = new URL("../../data/test/11_22_tree.json", import.meta.url);
    const res = await fetch(url);
    const json = await res.json();

    const teams = Object.keys(json);

    teams.forEach((team) => {
      json[team].forEach((tree) => {
        if (!tree.lat || !tree.lng) return;

        const el = createMarkerElement(14, 2);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([tree.lng, tree.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <b>${tree.species ?? "수종 미상"}</b><br/>
              흉고직경: ${tree.diameter_cm ?? "-"} cm<br/>
              수고: ${tree.height_cm ?? "-"} cm
            `)
          );

        treeMarkers.push(marker);
      });
    });

    // 처음엔 지도에 안 올림 (줌 기준으로 제어)
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
