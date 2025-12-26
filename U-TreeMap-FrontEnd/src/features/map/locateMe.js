import mapboxgl from "mapbox-gl";


let myLocationMarker = null;
let removeTimer = null;

const ULSAN_BOUNDS = {
  minLng: 128.9,
  maxLng: 129.6,
  minLat: 35.3,
  maxLat: 35.8,
};

/**
 * 울산광역시 범위 내부인지 확인
 */
function isInsideUlsan(lat, lng) {
  return (
    lng >= ULSAN_BOUNDS.minLng &&
    lng <= ULSAN_BOUNDS.maxLng &&
    lat >= ULSAN_BOUNDS.minLat &&
    lat <= ULSAN_BOUNDS.maxLat
  );
}



/**
 * 내 위치 표시 (울산 내부 + 펄스 + 15초 후 제거)
 */
export function showMyLocationOnce(map) {
  if (!map || !navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // ❌ 울산 외부면 중단
      if (!isInsideUlsan(latitude, longitude)) {
        alert(
          "이 서비스는 울산광역시 내에서만 이용할 수 있습니다.\n현재 위치에서는 내 위치 찾기 기능을 사용할 수 없습니다."
        );
        return;
      }

      // 🧹 기존 마커 제거
      if (myLocationMarker) {
        myLocationMarker.remove();
        myLocationMarker = null;
      }
      if (removeTimer) {
        clearTimeout(removeTimer);
        removeTimer = null;
      }

      // 📍 마커 DOM
      const wrapper = document.createElement("div");
      wrapper.className = "my-location-marker";

      const dot = document.createElement("div");
      dot.style.width = "16px";
      dot.style.height = "16px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = "#1E88E5";
      dot.style.border = "3px solid white";
      dot.style.boxShadow = "0 0 8px rgba(30,136,229,0.8)";
      dot.style.position = "relative";
      dot.style.zIndex = "2";

      wrapper.appendChild(dot);

      myLocationMarker = new mapboxgl.Marker(wrapper)
        .setLngLat([longitude, latitude])
        .addTo(map);

      // 🗺 지도 이동
      map.easeTo({
        center: [longitude, latitude],
        zoom: Math.max(map.getZoom(), 16),
        duration: 700,
      });

      // ⏱ 15초 후 제거
      removeTimer = setTimeout(() => {
        if (myLocationMarker) {
          myLocationMarker.remove();
          myLocationMarker = null;
        }
      }, 15000);
    },
    () => {
      alert("위치 정보를 가져올 수 없습니다.\n브라우저 권한을 확인해주세요.");
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0,
    }
  );
}
