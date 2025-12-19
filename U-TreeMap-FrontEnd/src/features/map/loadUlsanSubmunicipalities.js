import { TargetFeature } from "mapbox-gl";
import { CURRENT_LABEL_MODE, LABEL_MODE } from "./labelConfig";


/**
 * 울산 읍·면·동 GeoJSON을 지도에 로딩
 * @param {mapboxgl.Map} map
 */
export async function loadUlsanSubmunicipalities(map) {
  const url = new URL(
    "../../data/geojson/ulsan_submunicipalities_2018.geojson",
    import.meta.url
  );

  const res = await fetch(url);
  const geojson = await res.json();

  //더미데이터 주입 -> 추후 api 호출 불러오는 로직으로 변경
  //원본 geojson(불변)에 더미데이터(가변) 임시 주입.
  geojson.features.forEach((f)=>{
    f.properties.treeCount = 7777;
    f.properties.carbonStorage = 7777;
  })

  // 🟢 Source 추가
  map.addSource("ulsan-emd", {
    type: "geojson",
    data: geojson,
    promoteId: "code",
  });

  // 🟩 면 채우기
  map.addLayer({
    id: "ulsan-emd-fill",
    type: "fill",
    source: "ulsan-emd",
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#2E7D32", //hover
        "#66BB6A" // 기본
      ],

      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.7,
        0.45,
      ],
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
      "text-font": ["Noto Sans KR Bold", "Open Sans Bold"],
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
