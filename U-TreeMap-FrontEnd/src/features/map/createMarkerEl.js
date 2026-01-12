// createMarkerEl.js
import selectedTreeIcon from "../../assets/icons/tree-selected.svg";


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

  // 🎨 컬러 팔레트 (필요하면 확장 가능) 나무 배치 엉망임 나중에 바꾸도록
  const colorPalette = [
  "rgba(1, 1, 1, 1)", // 0: zero_index
  "rgba(27, 94, 32, 0.75)",   // 1: 개잎갈나무 (Manchurian fir)
  "rgba(76, 175, 80, 0.75)", // 2: 느티나무 (Zelkova)
  "rgba(102, 187, 106, 0.75)", // 3: 단풍나무 (Maple)
  "rgba(0, 105, 92, 0.75)",  // 4: 메타세쿼이아 (Dawn redwood)
  "rgba(216, 27, 96, 0.65)", // 5: 배롱나무 (Crape myrtle)
  "rgba(244, 143, 177, 0.65)", // 6: 벚나무 (Cherry tree)
  "rgba(141, 110, 99, 0.7)", // 7: 산사나무 (Hawthorn)
  "rgba(46, 125, 50, 0.75)", // 8:  (Pine)
  "rgba(255, 235, 59, 0.7)", // 9: 소나무 (Ginkgo)
  "rgba(67, 160, 71, 0.75)", // 10: 잎갈나무 (Larch)
  "rgba(38, 166, 154, 0.75)", // 11: 잎갈나무 (Oriental arborvitae)
  "rgba(38, 166, 154, 0.75)", // 12: 측백나무 (Oriental arborvitae)
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

/**
 * @param {HTMLElement} markerEl - 선택됨 상태로 바꾸고 싶은 맵박스 마커
 * 함수에 인자로 들어온 맵박스 마커를 선택됨 상태로 바꾸어 줍니다.
 * 순수함수 아니니깐 조심하세요 : 리턴은 없음
 */
export function changeSellectedMarker(markerEl) {
  markerEl.innerHTML = ""; // 기존 원형 제거
  markerEl.style.width = "36px";
  markerEl.style.height = "36px";
  markerEl.style.borderRadius = "0";           // 필요시
  markerEl.style.backgroundColor = "transparent";
  markerEl.style.border = "0";

  const img = document.createElement("img");
  img.src = selectedTreeIcon;
  img.style.width = "36px";
  img.style.height = "36px";
  img.style.display = "block";
  img.style.pointerEvents = "none";
  markerEl.appendChild(img);

}