# Korea GeoJSON Polygon 작업 계획

작성일: 2026-05-14

## 목표

기존 울산광역시 중심 지도 행정구역 폴리곤을 대한민국 전국 단위로 확장한다. 지도 확대 수준에 따라 전국, 시도, 시군구, 읍면동 레이어가 전환되도록 구성한다.

## 사용 데이터

- `data/geojson/skorea-submunicipalities-2018-geo.json`
- `data/geojson/korea/skorea-provinces-2018-geo.json`
- `data/geojson/korea/skorea-municipalities-2018-geo.json`
- `data/geojson/korea/korea_*_meta.json`

프론트 번들에서 `new URL(..., import.meta.url)`로 로딩하려면 `U-TreeMap-FrontEnd/src/data/geojson/korea` 아래에도 GeoJSON 파일을 배치한다.

## 구현 단계

1. `src/data/geojson/korea` 데이터 배치
   - 시도 GeoJSON
   - 시군구 GeoJSON
   - 읍면동 GeoJSON
   - 메타 JSON

2. 전국 행정구역 폴리곤 loader 추가
   - `loadKoreaAdministrativePolygons.js` 생성
   - source/layer id는 `korea-country`, `korea-sido`, `korea-sigungu`, `korea-emd` 계열 사용
   - 모든 레이어는 최초 `visibility: none`으로 등록
   - country 레이어는 시도 GeoJSON을 국가 단위 배경 폴리곤처럼 사용

3. 지도 초기값/좌표 제한 변경
   - center: 대한민국 중심 좌표
   - zoom: 전국이 보이는 줌
   - minZoom: 전국 줌아웃 허용
   - maxBounds: 대한민국 전역 범위

4. zoom controller 전국 단위로 교체
   - 낮은 줌: 전국 레이어
   - 중간 줌: 시도 레이어
   - 확대 줌: 시군구 레이어
   - 더 확대: 읍면동 레이어
   - 가장 확대: 나무 마커

5. hover 대상 변경
   - 기존 `ulsan-emd-fill` hover를 `korea-emd-fill` 기준으로 변경
   - hover state source도 `korea-emd`로 변경

## 줌 기준 초안

- `COUNTRY`: 5 이상
- `SIDO`: 6 이상
- `SIGUNGU`: 8 이상
- `EMD`: 11 이상
- `MARKER`: 15 이상

## 테스트 포인트

- `/map` 진입 시 대한민국 전체가 보이는지
- 줌 변경 시 전국 → 시도 → 시군구 → 읍면동 레이어가 전환되는지
- 기존 울산 max bounds 제한이 제거되고 대한민국 전역 이동이 가능한지
- 읍면동 hover 시 런타임 에러가 없는지
- `npm run build` 통과 여부

