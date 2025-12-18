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

  // 🟢 Source 추가
  map.addSource("ulsan-emd", {
    type: "geojson",
    data: geojson,
  });

  // 🟩 면 채우기
  map.addLayer({
    id: "ulsan-emd-fill",
    type: "fill",
    source: "ulsan-emd",
    paint: {
      "fill-color": "#66BB6A",
      "fill-opacity": 0.45,
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

