import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM 환경에서 __dirname 대응
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 입력 / 출력 경로
const INPUT_PATH = path.resolve(
  __dirname,
  "../data/geojson/ulsan_submunicipalities_2018.geojson"
);

const OUTPUT_PATH = path.resolve(
  __dirname,
  "../data/geojson/ulsan_submunicipalities_meta.json"
);

// 📌 GeoJSON 로드
const raw = fs.readFileSync(INPUT_PATH, "utf-8");
const geojson = JSON.parse(raw);

// 📌 필요한 필드만 추출
const result = geojson.features.map((feature) => ({
  code: feature.properties.code,
  name: feature.properties.name,
  name_eng: feature.properties.name_eng,
}));

// 📌 파일 저장
fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(result, null, 2),
  "utf-8"
);

console.log(`✅ 추출 완료: ${result.length}개`);
console.log(`📄 저장 위치: ${OUTPUT_PATH}`);
