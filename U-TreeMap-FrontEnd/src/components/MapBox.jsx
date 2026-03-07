// src/components/MapBox.jsx

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { loadTreeMarkers } from "../features/map/loadTreeMarkers";
import { loadUlsanSubmunicipalities } from "../features/map/loadUlsanSubmunicipalities";
import { setupZoomController } from "../features/map/zoomController";

import MapControls from "./UI/MapControls";
import { loadUlsanDistricts } from "../features/map/loadUlsanDistricts";
import { loadUlsanMetropolitanCity } from "../features/map/loadUlsanMetropolitanCity";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapBox({ 
  center = [129.2566, 35.5434],
  zoom = 10,
  isMobile = false
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // 🔴 환경변수 체크
    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      console.error(
        "%c[환경설정 필요] .env 파일에 VITE_MAPBOX_TOKEN을 추가해주세요.\n담당자: 이하은 🙋‍♀️",
        "color:red;font-size:15px;font-weight:bold;"
      );
      return;
    }

    if (mapRef.current) return;

    

    const MIN_ZOOM = 10;
    const MAX_ZOOM = 20;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom,
      minZoom:MIN_ZOOM,
      maxZoom:MAX_ZOOM,
      pitch: 0,    // 🔒 기울기 제거
      bearing: 0,  // 🔒 회전 제거
    });

    // 지도범위 제한 in 울산광역시
    // const ULSAN_MAX_BOUNDS = [
    //   [128.9, 35.3], // southwest
    //   [129.6, 35.8], // northeast
    // ];
    // map.setMaxBounds(ULSAN_MAX_BOUNDS);

    // 🔒 지도 회전 & 기울기 제스처 차단
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    mapRef.current = map;
    setMapReady(true);

    // ✅ load 시점에 기능 로딩
    map.on("load", async () => {
      await loadTreeMarkers(map);
      await loadUlsanSubmunicipalities(map);
      await loadUlsanDistricts(map);
      await loadUlsanMetropolitanCity(map);
      setupZoomController(map);
    });

    //hover
    let hoveredEmdId = null;
    map.on("mousemove", "ulsan-emd-fill", (e) => {
      if (!e.features.length) return;

      const feature = e.features[0];

      if (hoveredEmdId !== null) {
        map.setFeatureState(
          { source: "ulsan-emd", id: hoveredEmdId },
          { hover: false }
        );
      }

      hoveredEmdId = feature.id;

      map.setFeatureState(
        { source: "ulsan-emd", id: hoveredEmdId },
        { hover: true }
      );
    });

    map.on("mouseleave", "ulsan-emd-fill", () => {
      if (hoveredEmdId !== null) {
        map.setFeatureState(
          { source: "ulsan-emd", id: hoveredEmdId },
          { hover: false }
        );
      }
      hoveredEmdId = null;
    });

    map.on("mouseenter", "ulsan-emd-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });

    map.on("mouseleave", "ulsan-emd-fill", () => {
      map.getCanvas().style.cursor = "";
    });



    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return(
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full">
        {mapReady && <MapControls isMobile={isMobile} map={mapRef.current}/>}
      </div>
    </div>
  )
}
