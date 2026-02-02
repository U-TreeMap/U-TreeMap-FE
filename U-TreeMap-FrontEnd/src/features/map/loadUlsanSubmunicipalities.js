import { TargetFeature } from "mapbox-gl";
import { CURRENT_LABEL_MODE, LABEL_MODE } from "./labelConfig";
import {
  CURRENT_HEATMAP_MODE,
  HEATMAP_MODE,
  HEATMAP_RANGE,
} from "./heatmapConfig";


/**
 * 울산 읍·면·동 GeoJSON을 지도에 로딩
 * @param {mapboxgl.Map} map
 */
export async function loadUlsanSubmunicipalities(map) {
  // 1️⃣ GeoJSON 불러오기
  const geoUrl = new URL(
    "../../data/geojson/ulsan_submunicipalities_2018.geojson",
    import.meta.url
  );
  const geoRes = await fetch(geoUrl);
  const geojson = await geoRes.json();

  // 2️⃣ 통계 JSON 불러오기
  const statUrl = new URL(
    "../../data/geojson/ulsan_submunicipalities_dummy.json",
    import.meta.url
  );
  const statRes = await fetch(statUrl);
  const stats = await statRes.json();

  // 3️⃣ code → 통계 데이터 Map 생성
  const statMap = new Map();
  stats.forEach((item) => {
    statMap.set(item.code, item);
  });

  // 4️⃣ GeoJSON에 통계 주입
  geojson.features.forEach((feature) => {
    const code = feature.properties.code;
    const stat = statMap.get(code);

    feature.properties.treeCount = stat?.treeCount ?? 0;
    feature.properties.carbonStorage = stat?.carbonStorage ?? 0;
  });

  // 🟢 Source 추가
  map.addSource("ulsan-emd", {
    type: "geojson",
    data: geojson,
    promoteId: "code",
  });

  const heatmapValueExpression =
    CURRENT_HEATMAP_MODE === HEATMAP_MODE.TREE
      ? ["get", "treeCount"]
      : ["get", "carbonStorage"];

  // 🟩 면 채우기
  map.addLayer({
    id: "ulsan-emd-fill",
    type: "fill",
    source: "ulsan-emd",
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#004D40", // hover 시
        [
          "interpolate",
          ["linear"],
          heatmapValueExpression,
          HEATMAP_RANGE.MIN, "#E8F5E9",
          HEATMAP_RANGE.MID, "#81C784",
          HEATMAP_RANGE.MAX, "#1B5E20",
        ],
      ],
      "fill-opacity": 0.6,
    },
  });

  // 🟫 경계선
  map.addLayer({
    id: "ulsan-emd-line",
    type: "line",
    source: "ulsan-emd",
    paint: {
      "line-color": "#1B5E20",
      "line-width": 1,
    },
  });

  //라벨값 변경 토글? (숫자 콤마)
  const labelValueExpression =
    CURRENT_LABEL_MODE == LABEL_MODE.TREE
    ? ["number-format", ["get", "treeCount"], { locale: "ko-KR" }]
    : ["number-format", ["get", "carbonStorage"], { locale: "ko-KR" }];

  // 텍스트 라벨
  map.addLayer({
    id: "ulsan-emd-label",
    type: "symbol",
    source: "ulsan-emd",
    layout: {
      "text-field": [
        "format",
        ["get", "name"], { "font-scale": 1.15 },
        "\n",
        {},
        labelValueExpression,
        { "font-scale": 0.95 },
      ],
      //"text-font": ["Noto Sans KR Bold", "Open Sans Bold"],
      "text-size": 14,
      "text-anchor": "center",
      "text-allow-overlap": false,
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "rgba(0,0,0,0.65)",
      "text-halo-width": 2,
    },
  });


  console.log("%c🧩 Ulsan submunicipalities loaded", "color:#2E7D32;font-weight:bold;");
}

export function showUlsanPolygons(map) {
  map.setLayoutProperty("ulsan-emd-fill", "visibility", "visible");
  map.setLayoutProperty("ulsan-emd-line", "visibility", "visible");
  console.log("polygon visualbe🐵");
}

export function hideUlsanPolygons(map) {
  map.setLayoutProperty("ulsan-emd-fill", "visibility", "none");
  map.setLayoutProperty("ulsan-emd-line", "visibility", "none");
  console.log("polygon unvisuable🙈");
}

// 🏷 읍·면·동 라벨 보이기
export function showUlsanLabels(map) {
  map.setLayoutProperty("ulsan-emd-label", "visibility", "visible");
}

// 🏷 읍·면·동 라벨 숨기기
export function hideUlsanLabels(map) {
  map.setLayoutProperty("ulsan-emd-label", "visibility", "none");
}
