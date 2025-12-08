// src/components/MapBox.jsx

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// 마커 스타일 함수 (📌 네 함수 import)
import { createMarkerElement } from "../features/map/createMarkerEl";  

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapBox({ 
  center = [129.2566, 35.5434],  //내 위치기반으로 돌리고, 내위치 마커 추가해야됨
  zoom = 20
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {

    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      console.error(
        "%c[환경설정 필요] .env 파일에 VITE_MAPBOX_TOKEN을 추가해주세요. \n담당자: 이하은 🙋‍♀️", 
        "color: red; font-size: 15px; font-weight:bold;"
      );
      return; // 지도 생성 중단
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

    /** ⬇ JSON 데이터 불러오기 + 마커 렌더링 */
    map.on("load", async () => {
      try {
        const url = new URL("../data/test/11_22_tree.json", import.meta.url);
        const res = await fetch(url); // public 폴더에 두면 ✓ 자동 접근 가능
        const json = await res.json();

        const teams = Object.keys(json); // team1, team2...

        teams.forEach(team => {
          json[team].forEach(tree => {
            if (!tree.lat || !tree.lng) return; // 위치 없는 데이터 제외

            const el = createMarkerElement(14, 2); // size, colorIndex

            new mapboxgl.Marker({ element: el })
              .setLngLat([tree.lng, tree.lat])
              .setPopup(new mapboxgl.Popup().setHTML(`
                <b>${tree.species ?? "수종 미상"}</b><br/>
                흉고직경: ${tree.diameter_cm ?? "-"} cm<br/>
                수고: ${tree.height_cm ?? "-"} cm<br/>
              `))
              .addTo(map);
          });
        });

        console.log("%c 🌳 트리 로딩 완료!", "color:green;font-size:14px");
        
      } catch (e) {
        console.error("Tree JSON Load Failed ❌", e);
      }
    });

  }, []);

  return <div ref={mapContainer} className="w-full h-full"/>;
}
