import {
  showTreeMarkers,
  hideTreeMarkers,
} from "./loadTreeMarkers";

import {
  showUlsanPolygons,
  hideUlsanPolygons,
} from "./loadUlsanSubmunicipalities";

const MARKER_ZOOM_THRESHOLD = 14;

export function setupZoomController(map) {
  const update = () => {
    const zoom = map.getZoom();

    if (zoom >= MARKER_ZOOM_THRESHOLD) {
      // 🌳 마커 ON, 폴리곤 OFF
      showTreeMarkers(map);
      hideUlsanPolygons(map);
    } else {
      // 🟫 폴리곤 ON, 마커 OFF
      hideTreeMarkers();
      showUlsanPolygons(map);
    }
  };

  // 최초 1회 실행
  update();

  // 줌 변경 시마다 실행
  map.on("zoomend", update);
}
