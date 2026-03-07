

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;


/**
 * Mapbox Reverse Geocoding
 * 좌표(lng, lat)를 기반으로 도로명 주소 / 건물명(POI)을 조회한다.
 *
 * ⚠️ Mapbox는 좌표 순서가 (longitude, latitude) 이다.
 *
 * @param {Object} params
 * @param {number} params.lng - 경도 (longitude)
 * @param {number} params.lat - 위도 (latitude)
 *
 * @returns {Promise<{
 *   placeName: string,
 *   buildingName: string | null
 * } | null>}
 *  - placeName: 사람이 읽을 수 있는 전체 주소
 *  - buildingName: 건물/장소명 (없으면 null)
 *
 * @throws {Error} Mapbox 요청 실패 또는 토큰 누락 시
 */
export async function reverseGeocodeMapbox({
  lng,
  lat,
  language = "ko",
  country = "kr",
}) {
  if (!MAPBOX_TOKEN) {
    throw new Error("Mapbox access token이 설정되지 않았습니다.");
  }

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
    `?access_token=${MAPBOX_TOKEN}` +
    `&language=${language}` +
    `&country=${country}` +
    `&types=poi,address` +
    `&limit=5`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Mapbox 요청 실패 (${res.status})`);
  }

  const data = await res.json();
  const features = data.features || [];

  if (features.length === 0) return null;

  const poi = features.find((f) => f.place_type.includes("poi"));
  const address = features.find((f) => f.place_type.includes("address"));
  const best = poi || address || features[0];

  return {
    placeName: best.place_name,
    buildingName: poi ? poi.text : null,
  };
}
