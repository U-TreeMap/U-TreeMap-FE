  // src/components/MapBox.jsx

  import { useEffect, useRef, useState } from "react";
  import mapboxgl from "mapbox-gl";
  import "mapbox-gl/dist/mapbox-gl.css";

  import { loadTreeMarkers } from "../features/map/loadTreeMarkers";
  import { loadKoreaAdministrativePolygons } from "../features/map/loadKoreaAdministrativePolygons";
  import { setupZoomController } from "../features/map/zoomController";

  import MapControls from "./UI/MapControls";
  import { fetchRegionSummary } from "../api/utreeMap";

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  export default function MapBox({ 
    center = [127.7669, 35.9078],
    zoom = 5.4,
    isMobile = false
  }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    const [mapReady, setMapReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);

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
      
      //geojson API 테스트
      const testGeojson = async ()=>{
        const geoData = await fetchRegionSummary();
        console.log("geoData" ,geoData);
      }
      testGeojson();
      
      const MIN_ZOOM = 5;
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

      // 지도범위 제한: 남한 본토, 제주, 백령도, 흑산면, 독도 포함
      const KOREA_MAX_BOUNDS = [
        [124.45, 33.0], // southwest
        [132.05, 38.7], // northeast
      ];
      map.setMaxBounds(KOREA_MAX_BOUNDS);

      // 🔒 지도 회전 & 기울기 제스처 차단
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();

      mapRef.current = map;
      setMapInstance(map);
      setMapReady(true);

      // ✅ load 시점에 기능 로딩
      map.on("load", async () => {
        await loadTreeMarkers(map);
        await loadKoreaAdministrativePolygons(map);
        setupZoomController(map);
      });

      return () => {
        map.remove();
        mapRef.current = null;
        setMapInstance(null);
      };
    }, []);

    return(
      <div className="relative w-full h-full">
        <div ref={mapContainer} className="w-full h-full">
          {mapReady && mapInstance && <MapControls isMobile={isMobile} map={mapInstance}/>}
        </div>
      </div>
    )
  }
