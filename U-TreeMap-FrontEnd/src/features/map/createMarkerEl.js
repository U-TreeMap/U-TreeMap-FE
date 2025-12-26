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
export function createMarkerElement(size = 32, color = 4) {
  const el = document.createElement("div");

  // 🎨 컬러 팔레트 (필요하면 확장 가능)
  const colorPalette = [
  "rgba(27, 94, 32, 0.75)",   // 0: 개잎갈나무 (Manchurian fir)
  "rgba(76, 175, 80, 0.75)", // 1: 느티나무 (Zelkova)
  "rgba(102, 187, 106, 0.75)", // 2: 단풍나무 (Maple)
  "rgba(0, 105, 92, 0.75)",  // 3: 메타세쿼이아 (Dawn redwood)
  "rgba(216, 27, 96, 0.65)", // 4: 배롱나무 (Crape myrtle)
  "rgba(244, 143, 177, 0.65)", // 5: 벚나무 (Cherry tree)
  "rgba(141, 110, 99, 0.7)", // 6: 산사나무 (Hawthorn)
  "rgba(46, 125, 50, 0.75)", // 7: 소나무 (Pine)
  "rgba(255, 235, 59, 0.7)", // 8: 은행나무 (Ginkgo)
  "rgba(67, 160, 71, 0.75)", // 9: 잎갈나무 (Larch)
  "rgba(38, 166, 154, 0.75)", // 10: 측백나무 (Oriental arborvitae)
];

  const markerColor = colorPalette[color % colorPalette.length]; // 안전 처리

  // 🟢 Circle Marker Style
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = "50%";
  el.style.backgroundColor = markerColor;

  el.style.cursor = "pointer";
  el.style.border = "1px solid white";
  return el;
}
