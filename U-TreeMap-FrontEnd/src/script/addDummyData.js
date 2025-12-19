import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM 환경 대응
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📥 입력: 읍면동 메타 데이터
const INPUT_PATH = path.resolve(
  __dirname,
  "../data/geojson/ulsan_submunicipalities_meta.json"
);

// 📤 출력: 더미 데이터 포함 메타
const OUTPUT_PATH = path.resolve(
  __dirname,
  "../data/geojson/ulsan_submunicipalities_dummy.json"
);

// 파일 읽기
const raw = fs.readFileSync(INPUT_PATH, "utf-8");
const meta = JSON.parse(raw);

// 더미 데이터 추가
const withDummy = meta.map((item) => ({
  ...item,
  treeCount: 7777,        // 🌳 더미 수목량
  carbonStorage: 7777,    // 🌱 더미 탄소 저장량
}));

// 저장
fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(withDummy, null, 2),
  "utf-8"
);

console.log(`✅ 더미 데이터 생성 완료: ${withDummy.length}개`);
console.log(`📄 저장 위치: ${OUTPUT_PATH}`);
