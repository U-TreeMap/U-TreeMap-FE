import { CURRENT_LABEL_MODE, LABEL_MODE } from "./labelConfig";
import {
  CURRENT_HEATMAP_MODE,
  HEATMAP_MODE,
  HEATMAP_RANGE,
} from "./heatmapConfig";

/**
 * 울산 구·군 단위 GeoJSON을 지도에 로딩
 * @param {mapboxgl.Map} map
 */
export async function loadUlsanDistricts(map) {
  // 1️⃣ GeoJSON 불러오기
  const geoUrl = new URL(
    "../../data/geojson/ulsan_district_2018.json",
    import.meta.url
  );
  const geoRes = await fetch(geoUrl);
  const geojson = await geoRes.json();

  // 2️⃣ 통계 JSON 불러오기
  const statUrl = new URL(
    "../../data/geojson/ulsan_districts_dummy.json",
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
  map.addSource("ulsan-sgg", {
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
    id: "ulsan-sgg-fill",
    type: "fill",
    source: "ulsan-sgg",
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#004D40",
        [
          "interpolate",
          ["linear"],
          heatmapValueExpression,
          HEATMAP_RANGE.MIN, "#E8F5E9",
          HEATMAP_RANGE.MID, "#81C784",
          HEATMAP_RANGE.MAX, "#1B5E20",
        ],
      ],
      "fill-opacity": 0.5,
    },
  });

  // 🟫 경계선
  map.addLayer({
    id: "ulsan-sgg-line",
    type: "line",
    source: "ulsan-sgg",
    paint: {
      "line-color": "#1B5E20",
      "line-width": 2,
    },
  });

  const labelValueExpression =
    CURRENT_LABEL_MODE == LABEL_MODE.TREE
      ? ["number-format", ["get", "treeCount"], { locale: "ko-KR" }]
      : ["number-format", ["get", "carbonStorage"], { locale: "ko-KR" }];

  // 텍스트 라벨
  map.addLayer({
    id: "ulsan-sgg-label",
    type: "symbol",
    source: "ulsan-sgg",
    layout: {
      "text-field": [
        "format",
        ["get", "name"], { "font-scale": 1.2 },
        "\n",
        {},
        labelValueExpression,
        { "font-scale": 0.95 },
      ],
      "text-size": 16,
      "text-anchor": "center",
      "text-allow-overlap": false,
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "rgba(0,0,0,0.65)",
      "text-halo-width": 2,
    },
  });

  console.log(
    "%c🧩 Ulsan districts loaded",
    "color:#EF6C00;font-weight:bold;"
  );
}

export function showUlsanDistrictPolygons(map) {
  map.setLayoutProperty("ulsan-sgg-fill", "visibility", "visible");
  map.setLayoutProperty("ulsan-sgg-line", "visibility", "visible");
}

export function hideUlsanDistrictPolygons(map) {
  map.setLayoutProperty("ulsan-sgg-fill", "visibility", "none");
  map.setLayoutProperty("ulsan-sgg-line", "visibility", "none");
}

export function showUlsanDistrictLabels(map) {
  map.setLayoutProperty("ulsan-sgg-label", "visibility", "visible");
}

export function hideUlsanDistrictLabels(map) {
  map.setLayoutProperty("ulsan-sgg-label", "visibility", "none");
}