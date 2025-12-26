// 🔒 줌 제한값 (필요하면 여기 숫자만 수정)
const MIN_ZOOM = 10;
const MAX_ZOOM = 20;

/**
 * 지도 줌 인
 * @param {mapboxgl.Map} map
 */
export function zoomIn(map) {
  if (!map) return;

  const currentZoom = map.getZoom();
  if (currentZoom >= MAX_ZOOM) return;

  map.easeTo({
    zoom: Math.min(currentZoom + 1, MAX_ZOOM),
    duration: 300,
  });
}

/**
 * 지도 줌 아웃
 * @param {mapboxgl.Map} map
 */
export function zoomOut(map) {
  if (!map) return;

  const currentZoom = map.getZoom();
  if (currentZoom <= MIN_ZOOM) return;

  map.easeTo({
    zoom: Math.max(currentZoom - 1, MIN_ZOOM),
    duration: 300,
  });
}
