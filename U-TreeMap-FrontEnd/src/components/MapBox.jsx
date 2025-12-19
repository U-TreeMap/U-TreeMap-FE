// src/components/MapBox.jsx

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { loadTreeMarkers } from "../features/map/loadTreeMarkers";
import { loadUlsanSubmunicipalities } from "../features/map/loadUlsanSubmunicipalities";
import { setupZoomController } from "../features/map/zoomController";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapBox({ 
  center = [129.2566, 35.5434],
  zoom = 20
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

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

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center,
      zoom,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl());

    // ✅ load 시점에 기능 로딩
    map.on("load", async () => {
      await loadTreeMarkers(map);
      await loadUlsanSubmunicipalities(map);
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

  return <div ref={mapContainer} className="w-full h-full" />;
}
