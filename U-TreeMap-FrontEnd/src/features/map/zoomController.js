/**
 * zoomController.js
 *
 * 지도 줌 레벨에 따라
 *  - 광역시
 *  - 구·군
 *  - 읍·면·동
 *  - 나무 마커
 * 를 자동으로 토글하는 컨트롤러
 *
 * Mapbox 지도 로드 후 setupZoomController(map) 를 호출하면 동작함.
 */


/* =========================================================
   레이어 제어 함수 import
   ========================================================= */

import {
  showTreeMarkers,
  hideTreeMarkers,
} from "./loadTreeMarkers";

import {
  showUlsanSubmunicipalitiesPolygons,
  hideUlsanSubmunicipalitiesPolygons,
  showUlsanSubmunicipalitiesLabels,
  hideUlsanSubmunicipalitiesLabels,
} from "./loadUlsanSubmunicipalities";

import {
  showUlsanDistrictPolygons,
  hideUlsanDistrictPolygons,
  showUlsanDistrictLabels,
  hideUlsanDistrictLabels,
} from "./loadUlsanDistricts";

import {
  showUlsanMetropolitanPolygons,
  hideUlsanMetropolitanPolygons,
  showUlsanMetropolitanLabels,
  hideUlsanMetropolitanLabels,
} from "./loadUlsanMetropolitanCity";


/* =========================================================
   줌 레벨 기준값 (여기만 수정하면 동작이 바뀜)
   ========================================================= */

/**
 * 각 행정단위가 나타나는 최소 줌 레벨
 *
 * 예시
 * 0~9  : 광역시
 * 10~12 : 구·군
 * 13~14 : 읍·면·동
 * 15+ : 개별 나무 마커
 */
export const ZOOM_LEVEL = {

  // 광역시 표시 기준
  METROPOLITAN: 7,

  // 구·군 표시 기준
  DISTRICT: 10,

  // 읍·면·동 표시 기준
  SUBMUNICIPALITY: 13,

  // 개별 나무 마커 표시 기준
  MARKER: 15,
};


/* =========================================================
   줌 컨트롤러
   ========================================================= */

/**
 * 지도 줌 레벨에 따라
 * 적절한 레이어를 표시/숨김 처리하는 함수
 *
 * @param {mapboxgl.Map} map
 */
export function setupZoomController(map) {

  /**
   * 현재 줌 레벨에 따라 레이어 상태 업데이트
   */
  const update = () => {

    const zoom = map.getZoom();

    /* =====================================================
       1️⃣ 나무 마커 단계
       ===================================================== */
    if (zoom >= ZOOM_LEVEL.MARKER) {

      // 🌳 나무 마커 표시
      showTreeMarkers(map);

      // 다른 레이어 숨김
      hideUlsanSubmunicipalitiesPolygons(map);
      hideUlsanSubmunicipalitiesLabels(map);

      hideUlsanDistrictPolygons(map);
      hideUlsanDistrictLabels(map);

      hideUlsanMetropolitanPolygons(map);
      hideUlsanMetropolitanLabels(map);

      return;
    }

    // 마커 조건이 아니면 마커 숨김
    hideTreeMarkers(map);



    /* =====================================================
       2️⃣ 읍·면·동 단계
       ===================================================== */
    if (zoom >= ZOOM_LEVEL.SUBMUNICIPALITY) {

      showUlsanSubmunicipalitiesPolygons(map);
      showUlsanSubmunicipalitiesLabels(map);

      hideUlsanDistrictPolygons(map);
      hideUlsanDistrictLabels(map);

      hideUlsanMetropolitanPolygons(map);
      hideUlsanMetropolitanLabels(map);

      return;
    }



    /* =====================================================
       3️⃣ 구·군 단계
       ===================================================== */
    if (zoom >= ZOOM_LEVEL.DISTRICT) {

      showUlsanDistrictPolygons(map);
      showUlsanDistrictLabels(map);

      hideUlsanSubmunicipalitiesPolygons(map);
      hideUlsanSubmunicipalitiesLabels(map);

      hideUlsanMetropolitanPolygons(map);
      hideUlsanMetropolitanLabels(map);

      return;
    }



    /* =====================================================
       4️⃣ 광역시 단계
       ===================================================== */

    showUlsanMetropolitanPolygons(map);
    showUlsanMetropolitanLabels(map);

    hideUlsanDistrictPolygons(map);
    hideUlsanDistrictLabels(map);

    hideUlsanSubmunicipalitiesPolygons(map);
    hideUlsanSubmunicipalitiesLabels(map);
  };


  /* =====================================================
     최초 실행 (지도 로딩 시 한번 실행)
     ===================================================== */

  update();


  /* =====================================================
     줌 변경 시 실행
     ===================================================== */

  map.on("zoomend", update);
}