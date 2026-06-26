# [DEV] GeoJSON 전국 확장 기획서

작성일: 2026-05-14  
대상 프로젝트: U-TREE MAP Frontend / 지도 데이터 확장

## 1. 목적

현재 서비스는 울산광역시 중심의 지도/나무 데이터를 전제로 동작한다. 향후 대한민국 전역으로 확장하려면 단순히 GeoJSON 범위를 넓히는 수준이 아니라, 행정구역 경계, 행정구역 코드, 주소/좌표 변환, 전국 나무 원천 데이터, 데이터 정규화 규칙, 지도 성능 최적화 전략을 함께 설계해야 한다.

이번 기획의 목표는 전국 확장 시 필요한 데이터 종류와 우선순위, 수집/가공 방향, 프론트엔드와 백엔드가 합의해야 할 GeoJSON 구조를 정리하는 것이다.

## 2. 현재 전제

- 현재 지도는 특정 지역 중심의 GeoJSON과 더미 나무 데이터를 사용한다.
- 지도 UI는 Mapbox 기반으로 보이며, 지도 위에 나무 마커/필터/사이드바를 얹는 구조다.
- 전국 확장 시 한 번에 모든 나무와 행정구역을 브라우저에 로딩하면 성능 문제가 발생한다.
- 따라서 전국 데이터는 원본 GeoJSON 직접 로딩이 아니라, 서버 필터링 또는 타일 기반 제공을 전제로 설계해야 한다.

## 3. 필요한 데이터

### 3.1 행정구역 경계 데이터

전국 확장의 기준 레이어다. 시도, 시군구, 읍면동 단위 경계가 필요하다.

필요 데이터:
- 시도 경계
- 시군구 경계
- 읍면동 경계
- 가능하면 법정동/행정동 구분
- 행정구역 코드
- 데이터 기준일
- 좌표계 정보

용도:
- 사용자가 지역 단위로 탐색할 때 지도 범위 계산
- 특정 지역 선택 시 나무 데이터 필터링
- 관리자/봉사자 권한 범위 설정
- 전국 데이터를 지역 단위로 쪼개는 기준

후보 출처:
- 국가공간정보포털
- SGIS 통계지리정보서비스
- VWorld WFS/공간정보 API

주의점:
- 법정동과 행정동은 일치하지 않는다.
- 행정구역은 통폐합/분동/명칭 변경이 발생하므로 `effectiveDate` 또는 `baseDate`를 저장해야 한다.
- 프론트엔드 GeoJSON은 WGS84, EPSG:4326 기준으로 통일하는 것이 안전하다.

### 3.2 행정구역 코드 마스터

경계 GeoJSON만 있으면 안 되고, 각 피처를 안정적으로 식별할 코드 체계가 필요하다.

필요 데이터:
- 시도 코드
- 시군구 코드
- 읍면동 코드
- 법정동 코드
- 행정동 코드
- 코드명
- 상위 행정구역 코드
- 사용 여부
- 폐지/변경 일자

용도:
- `/regions/:sidoCode/:sigunguCode` 같은 API 설계
- 나무 데이터와 행정구역 경계 join
- 지역 검색, 권한 관리, 통계 집계
- URL 라우팅 및 필터 상태 저장

권장 구조:

```json
{
  "sidoCode": "31",
  "sidoName": "울산광역시",
  "sigunguCode": "31140",
  "sigunguName": "남구",
  "emdCode": "31140560",
  "emdName": "무거동",
  "type": "legal-dong",
  "baseDate": "2026-01-01"
}
```

### 3.3 주소/좌표 변환 데이터

전국 서비스에서는 사용자가 주소로 검색하거나 봉사자가 현장에서 위치를 등록한다. 주소와 좌표를 서로 변환하는 체계가 필요하다.

필요 데이터/기능:
- 도로명주소 검색
- 지번주소 검색
- 주소 → 좌표 geocoding
- 좌표 → 주소 reverse geocoding
- 건물/도로명/법정동 매핑

후보 출처:
- 도로명주소 개발자센터 API
- VWorld geocoder API
- 공공데이터포털 주소 관련 API

주의점:
- 주소 검색과 행정구역 경계 판정은 별도다.
- 좌표가 경계 밖에 찍히는 경우를 대비해 point-in-polygon 검증이 필요하다.
- 사용자가 입력한 주소 문자열은 그대로 저장하지 말고 정규화된 주소/코드/좌표를 함께 저장해야 한다.

### 3.4 전국 나무 데이터

서비스의 핵심 데이터다. 전국 단위에서 가장 어려운 부분은 지자체마다 공개 방식, 필드명, 좌표 품질, 갱신 주기가 다르다는 점이다.

필요 데이터:
- 나무 고유 ID
- 수종명
- 수종 코드
- 좌표
- 주소
- 관리 기관
- 식재 위치
- 흉고직경
- 수고
- 수관폭
- 생육 상태
- 보호수/가로수/공원수 등 유형
- 데이터 출처
- 데이터 기준일
- 마지막 검증일

후보 출처:
- 공공데이터포털 지자체 가로수 데이터
- 지자체별 열린데이터 광장
- 산림청/지자체 보호수 데이터
- 도시공원/녹지 데이터
- 현장 등록 데이터

중요 판단:
- 전국 나무 데이터를 한 출처에서 완전하게 얻기는 어렵다.
- 1차 목표는 “전국 행정구역 기반 + 지자체별 나무 데이터 순차 수집”이 현실적이다.
- 원천 데이터 품질이 낮은 지역은 사용자/봉사자 등록 데이터로 보완해야 한다.

권장 표준 필드:

```json
{
  "treeId": "ulsan-namgu-000001",
  "sourceId": "source-original-id",
  "sourceName": "울산광역시 남구 가로수 데이터",
  "treeType": "street-tree",
  "speciesName": "은행나무",
  "speciesCode": "ginkgo-biloba",
  "status": "good",
  "heightCm": 420,
  "diameterCm": 10,
  "crownWidthCm": 200,
  "branchHeightCm": 80,
  "address": "울산광역시 남구 무거동 ...",
  "regionCode": "31140",
  "position": {
    "lat": 35.5383603,
    "lng": 129.2555418
  },
  "baseDate": "2026-01-19"
}
```

### 3.5 수종 사전 데이터

필터, 검색, 통계, UI 표시를 안정화하려면 수종명을 정규화해야 한다.

필요 데이터:
- 대표 수종명
- 동의어/표기 변형
- 학명
- 분류
- 아이콘/색상 매핑
- 검색 키워드

예시:

```json
{
  "speciesCode": "ginkgo-biloba",
  "displayName": "은행나무",
  "aliases": ["은행", "은행 나무", "Ginkgo"],
  "scientificName": "Ginkgo biloba",
  "color": "#7FAE3A"
}
```

### 3.6 지도 표시용 파생 데이터

원본 GeoJSON은 관리용으로 필요하지만, 브라우저에 직접 모두 로딩하면 무겁다. 지도 표시용 파생 데이터가 필요하다.

필요 데이터:
- 지역별 나무 point GeoJSON
- zoom level별 cluster 데이터
- vector tile 또는 MVT
- bbox 기반 조회 API
- simplified boundary GeoJSON

권장:
- 전국 경계: zoom별 simplification 적용
- 나무 point: 현재 지도 viewport bbox 기준으로 서버 조회
- 대량 marker: 프론트 단일 GeoJSON 로딩 대신 clustering/source layer 사용
- 운영 단계에서는 GeoJSON보다 vector tile이 유리

## 4. 데이터 저장/제공 전략

### 4.1 원본과 서비스용 데이터 분리

원본 데이터:
- 기관에서 받은 CSV, SHP, GeoJSON, API 원본
- 수정하지 않고 보관
- 출처/다운로드일/라이선스 기록

정규화 데이터:
- 서비스 표준 스키마로 변환한 데이터
- 좌표계 통일
- 필드명 통일
- 행정구역 코드 join

서비스 데이터:
- 지도 조회에 최적화한 데이터
- bbox 조회용 DB index
- tile 또는 region chunk
- 프론트 API 응답용 JSON

### 4.2 좌표계

권장 기준:
- 저장/전송: WGS84, EPSG:4326
- 지도 표시: Mapbox 기본 좌표계와 호환
- 원천 데이터가 다른 좌표계이면 ingest 단계에서 변환

검증:
- 대한민국 bbox 범위 밖 좌표 제거
- 위도/경도 뒤바뀐 데이터 탐지
- 행정구역 polygon 내부 여부 검증
- 주소의 시군구와 좌표의 시군구 불일치 탐지

## 5. API 설계 방향

프론트엔드가 전국 데이터를 직접 들고 있지 않도록 API 중심으로 전환한다.

필수 API:

```txt
GET /api/regions/sido
GET /api/regions/sigungu?sidoCode=...
GET /api/regions/emd?sigunguCode=...
GET /api/trees?bbox=minLng,minLat,maxLng,maxLat&zoom=...
GET /api/trees/:treeId
GET /api/trees/clusters?bbox=...&zoom=...
GET /api/search/address?q=...
GET /api/search/tree-name?q=...
```

관리자/봉사자 API:

```txt
POST /api/tree-requests
GET /api/admin/tree-requests?status=pending&regionCode=...
GET /api/admin/tree-requests/:requestId
PATCH /api/admin/tree-requests/:requestId/approve
PATCH /api/admin/tree-requests/:requestId/reject
```

## 6. 프론트엔드 변경 방향

현재 프론트엔드는 지역 GeoJSON과 mock tree 데이터를 전제로 한다. 전국 확장 시 다음 구조로 바꾸는 것이 좋다.

변경 필요:
- `mockTreeData` 의존 제거
- 지도 이동/줌 변경 시 bbox 기반 나무 데이터 요청
- 행정구역 선택 상태를 URL query 또는 route state로 관리
- 필터 조건을 API query로 전달
- marker 직접 렌더링 수가 많아질 경우 Mapbox source/layer 방식 사용
- 지역 경계 GeoJSON은 필요한 zoom/지역만 lazy load

권장 상태 구조:

```ts
mapState = {
  bbox,
  zoom,
  selectedRegionCode,
  filters: {
    speciesCodes,
    healthStatus,
    treeType
  }
}
```

## 7. 단계별 작업 계획

### Phase 1. 데이터 기준 정의

- 전국 행정구역 코드 체계 확정
- 법정동/행정동 중 서비스 기준 결정
- GeoJSON 좌표계 기준 확정
- 나무 표준 스키마 확정
- 데이터 출처별 라이선스/갱신 주기 조사

산출물:
- `region.schema.json`
- `tree.schema.json`
- 데이터 출처 목록
- 좌표계 변환 규칙

### Phase 2. 행정구역 데이터 구축

- 시도/시군구/읍면동 경계 수집
- 좌표계 EPSG:4326 변환
- 경계 단순화 버전 생성
- 행정구역 코드 join
- region API 또는 정적 chunk 생성

테스트 포인트:
- 시도별 polygon 누락 여부
- 제주/세종/광역시 특수 구조 확인
- 경계 겹침/빈 polygon 검증

### Phase 3. 울산 데이터 표준화

- 현재 울산 데이터를 전국 표준 스키마로 마이그레이션
- 기존 UI가 새 스키마로 정상 동작하는지 확인
- bbox 조회 구조를 울산부터 적용

테스트 포인트:
- 기존 울산 지도 기능 회귀 없음
- 기존 필터 조건 정상 동작
- 선택한 나무 상세 정보 정상 표시

### Phase 4. 전국 데이터 수집 파이프라인

- 지자체별 가로수/보호수/공원수 데이터 수집
- CSV/SHP/GeoJSON/API별 ingest adapter 작성
- 필드명 정규화
- 수종명 정규화
- 좌표 검증
- regionCode 매핑

테스트 포인트:
- 좌표 없는 데이터 처리
- 주소만 있는 데이터 geocoding 처리
- 수종명 alias 처리
- 중복 나무 탐지

### Phase 5. 지도 성능 최적화

- bbox 기반 나무 조회 적용
- zoom별 cluster 적용
- 행정구역 경계 lazy loading
- 필요 시 vector tile 전환 검토

테스트 포인트:
- 전국 줌아웃 시 렌더링 성능
- 특정 시군구 확대 시 marker 정확도
- 모바일에서 로딩 시간/메모리 사용량

### Phase 6. 관리자/봉사자 검수 흐름 연결

- 현장 등록 데이터와 원천 데이터를 분리 저장
- 관리자 승인 후 정식 tree 데이터로 반영
- 반려 사유/수정 이력 저장
- 지역별 관리자 권한 적용

테스트 포인트:
- 승인 전 데이터가 일반 사용자에게 노출되지 않는지
- 승인 후 지도에 반영되는지
- 같은 좌표/수종 중복 등록 방지

## 8. 위험요소

- 지자체별 데이터 품질 편차가 크다.
- 전국 가로수 데이터가 단일 표준으로 제공되지 않을 수 있다.
- 좌표가 없는 데이터는 geocoding 비용과 오차가 발생한다.
- 행정구역 개편이 발생하면 과거 데이터와 현재 경계가 어긋날 수 있다.
- 전국 GeoJSON을 프론트에서 직접 로딩하면 초기 로딩과 메모리 문제가 커진다.

## 9. 우선순위 제안

1. 전국 행정구역 경계/코드 구축
2. 울산 기존 데이터를 표준 스키마로 전환
3. bbox 기반 조회 구조 적용
4. 광역시 단위로 추가 확장
5. 전국 지자체 데이터 수집 자동화
6. vector tile 또는 clustering 최적화
7. 관리자 승인 플로우와 데이터 반영 파이프라인 연결

## 10. 참고 데이터 출처 후보

- 국가공간정보포털: https://www.nsdi.go.kr
- SGIS 통계지리정보서비스: https://sgis.kostat.go.kr
- VWorld 공간정보 플랫폼: https://www.vworld.kr
- 도로명주소 개발자센터: https://www.juso.go.kr
- 공공데이터포털: https://www.data.go.kr

