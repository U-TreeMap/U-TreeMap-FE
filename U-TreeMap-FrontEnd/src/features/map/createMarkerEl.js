/**
 * Create a custom circular marker element for Mapbox
 *
 * @param {number} size - Marker diameter(px). Controls the size of the circle. Default: 24
 * @param {number} color - Color index used to pick a color from palette. Automatically wraps when index exceeds range
 * @returns {HTMLDivElement} - A styled HTML element usable for mapbox marker
 *
 * @example
 * // 기본 사용
 * const marker = createMarkerElement(32, 1);
 * new mapboxgl.Marker({ element: marker })
 *   .setLngLat([126.9, 37.56])
 *   .addTo(map);
 *
 * @example
 * // 작은 표시(태그형)
 * createMarkerElement(14, 2)
 */
export function createMarkerElement(size = 24, color = 0) {
  const el = document.createElement("div");

  // 🎨 컬러 팔레트 (필요하면 확장 가능)
  const colorPalette = [
    "#4CAF50",
    "#81C784",
    "#A5D6A7",
    "#66BB6A",
    "#2E7D32",
  ];
  
  const markerColor = colorPalette[color % colorPalette.length]; // 안전 처리

  // 🟢 Circle Marker Style
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "50%";
  el.style.backgroundColor = markerColor;

  el.style.cursor = "pointer";
  el.style.border = "2px solid white";
  el.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";

  return el;
}
