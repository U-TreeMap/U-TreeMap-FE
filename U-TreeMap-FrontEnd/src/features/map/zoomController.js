/**
 * zoomController.js
 *
 * 지도 줌 레벨에 따라
 *  - 전국
 *  - 시도
 *  - 시군구
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
  hideAllKoreaAdministrativeLayers,
  ensureKoreaAdministrativeLevel,
  KOREA_ADMIN_LEVEL,
  showKoreaCountryLabels,
  showKoreaCountryPolygons,
  showKoreaEmdLabels,
  showKoreaEmdPolygons,
  showKoreaSidoLabels,
  showKoreaSidoPolygons,
  showKoreaSigunguLabels,
  showKoreaSigunguPolygons,
} from "./loadKoreaAdministrativePolygons";


/* =========================================================
   줌 레벨 기준값 (여기만 수정하면 동작이 바뀜)
   ========================================================= */

/**
 * 각 행정단위가 나타나는 최소 줌 레벨
 *
 * 예시
 * 5~5.99  : 전국
 * 6~7.99  : 시도
 * 8~10.99 : 시군구
 * 11~14.99 : 읍·면·동
 * 15+ : 개별 나무 마커
 */
export const ZOOM_LEVEL = {

  // 전국 표시 기준
  COUNTRY: 5,

  // 시도 표시 기준
  SIDO: 6,

  // 시군구 표시 기준
  SIGUNGU: 8,

  // 읍·면·동 표시 기준
  EMD: 11,

  // 읍·면·동 라벨 표시 기준
  EMD_LABEL: 13,

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
  const update = async () => {

    const zoom = map.getZoom();

    /* =====================================================
       1️⃣ 나무 마커 단계
       ===================================================== */
    if (zoom >= ZOOM_LEVEL.MARKER) {

      // 🌳 나무 마커 표시
      showTreeMarkers(map);

      hideAllKoreaAdministrativeLayers(map);

      return;
    }

    // 마커 조건이 아니면 마커 숨김
    hideTreeMarkers(map);



    /* =====================================================
       2️⃣ 읍·면·동 단계
       ===================================================== */
    if (zoom >= ZOOM_LEVEL.EMD) {

      await ensureKoreaAdministrativeLevel(map, KOREA_ADMIN_LEVEL.EMD);
      hideAllKoreaAdministrativeLayers(map);
      showKoreaEmdPolygons(map);

      if (zoom >= ZOOM_LEVEL.EMD_LABEL) {
        showKoreaEmdLabels(map);
      }

      return;
    }



    /* =====================================================
       3️⃣ 시군구 단계
       ===================================================== */
    if (zoom >= ZOOM_LEVEL.SIGUNGU) {

      await ensureKoreaAdministrativeLevel(map, KOREA_ADMIN_LEVEL.SIGUNGU);
      hideAllKoreaAdministrativeLayers(map);
      showKoreaSigunguPolygons(map);
      showKoreaSigunguLabels(map);
      return;
    }



    /* =====================================================
       4️⃣ 시도 단계
       ===================================================== */
    if (zoom >= ZOOM_LEVEL.SIDO) {
      await ensureKoreaAdministrativeLevel(map, KOREA_ADMIN_LEVEL.SIDO);
      hideAllKoreaAdministrativeLayers(map);
      showKoreaSidoPolygons(map);
      showKoreaSidoLabels(map);
      return;
    }


    /* =====================================================
       5️⃣ 전국 단계
       ===================================================== */

    await ensureKoreaAdministrativeLevel(map, KOREA_ADMIN_LEVEL.COUNTRY);
    hideAllKoreaAdministrativeLayers(map);
    showKoreaCountryPolygons(map);
    showKoreaCountryLabels(map);
  };


  /* =====================================================
     최초 실행 (지도 로딩 시 한번 실행)
     ===================================================== */

  update();


  /* =====================================================
     줌 변경 시 실행
     ===================================================== */

  map.on("zoomend", update);
  map.on("moveend", update);
}
