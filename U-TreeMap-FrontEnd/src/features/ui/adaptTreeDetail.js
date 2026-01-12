import { formatDateWithDay } from "./formatDateWithDay";
import { formatTreeId } from "./formatTreeId";

/**
 * Tree Detail API Response → UI Model 변환
 * @param {Object} apiData - 백엔드에서 내려주는 tree 상세 데이터
 * @returns {Object} UI에서 사용하는 TreeDetailModel
 */
export function adaptTreeDetail(apiData) {
  if (!apiData) return null;

  return {
    // 1. 기본 식별 정보
    id: formatTreeId(apiData.speciesId), // ✅ No.006 형식
    name: apiData.speciesNameKr,
    scientificName: apiData.speciesNameEn,

    // 2. 요약 설명
    summary: apiData.shortDescription
      ? apiData.shortDescription.split("\n")
      : [],

    // 3. 이미지
    imageUrl: apiData.imageUrl,

    // 4. 위치 정보
    address: `${apiData.regionSido} ${apiData.regionSigungu} ${apiData.placeName}`,
    coordinates: {
      lat: apiData.latitude,
      lng: apiData.longitude,
    },

    // 5. 탄소 흡수 정보
    carbon: {
      amount: `${apiData.carbonAbsorptionKg}kg`,
      description: "성목 기준 연간 탄소 흡수량",
      effect: "도시 탄소 저감 효과",
    },

    // 6. 상세 스펙
    specs: {
      dbh: apiData.stems?.[0]?.dbhCm
        ? `${apiData.stems[0].dbhCm}cm`
        : "-",
      height: apiData.treeHeightCm
        ? `${apiData.treeHeightCm}cm`
        : "-",
      width: apiData.stems?.[0]?.crownWidthCm
        ? `${apiData.stems[0].crownWidthCm}cm`
        : "-",
      rootHeight: apiData.stems?.[0]?.clearBoleHeightCm
        ? `${apiData.stems[0].clearBoleHeightCm}cm`
        : "-",
    },

    // 7. 메타 정보
    updateDate: apiData.updatedAt
      ? formatDateWithDay(apiData.updatedAt)
      : "",

    // 8. 하단 상세 탭
    details: {
      morphology: apiData.morphology,
      environment: apiData.habitat,
      usage: apiData.purpose,
    },
  };
}
