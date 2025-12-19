import fs from "fs";

const inputPath = "/Users/dlgkdms4660/DEV/U-Tree-Map/U-TreeMap-FE/data/geojson/skorea-submunicipalities-2018-geo.json";
const outputPath = "/Users/dlgkdms4660/DEV/U-Tree-Map/U-TreeMap-FE/U-TreeMap-FrontEnd/src/data/geojson/ulsan_submunicipalities_2018.geojson";

// 원본 GeoJSON 읽기
const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

// 울산 코드 필터링 (앞 2자리 === "26")
const ulsanFeatures = raw.features.filter(
  (f) => String(f.properties?.code).startsWith("26")
);

// 새 GeoJSON 생성
const ulsanGeoJSON = {
  type: "FeatureCollection",
  features: ulsanFeatures,
};

// 파일로 저장
fs.writeFileSync(
  outputPath,
  JSON.stringify(ulsanGeoJSON, null, 2),
  "utf-8"
);

console.log(`✅ 울산 읍·면·동 GeoJSON 생성 완료: ${outputPath}`);
console.log(`총 개수: ${ulsanFeatures.length}`);
