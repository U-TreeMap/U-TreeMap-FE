# Korea GeoJSON 최적화 작업 계획

작성일: 2026-05-14

## 현재 문제

전국 행정구역 GeoJSON을 `src/data/geojson/korea`에서 `new URL(..., import.meta.url)`로 참조하고 있다. 이 방식은 Vite build 시 GeoJSON이 dist asset으로 포함되며, 지도 로드 시 `loadKoreaAdministrativePolygons`가 시도/시군구/읍면동 데이터를 한 번에 모두 fetch한다.

빌드 결과 기준 파일 크기:

- 시도 GeoJSON: 약 7.5MB
- 시군구 GeoJSON: 약 18.1MB
- 읍면동 GeoJSON: 약 34.3MB

초기 지도 진입 시 사용자가 아직 시군구/읍면동 줌까지 확대하지 않아도 모든 파일을 받게 되어 초기 로딩이 무겁다.

## 최적화 방향

1. 대형 GeoJSON은 `public/data/geojson/korea`로 이동/복사한다.
   - Vite 번들 asset으로 강제 포함하지 않는다.
   - 정적 URL(`/data/geojson/korea/...`)로 필요 시 fetch한다.

2. 행정구역 레이어를 zoom 단계별 lazy load한다.
   - 초기 로드: 전국 레이어만 로드
   - 시도 줌 진입: 시도 레이어 로드
   - 시군구 줌 진입: 시군구 레이어 로드
   - 읍면동 줌 진입: 읍면동 레이어 로드

3. 이미 로드된 레이어는 다시 fetch하지 않는다.
   - module-level `loadedLevels` 또는 `loadingPromises`로 중복 요청 방지

4. 읍면동 hover 이벤트는 읍면동 레이어가 실제 등록된 후에 바인딩한다.
   - lazy load 이전에 `map.on('mousemove', 'korea-emd-fill', ...)`를 호출하면 레이어 없음 에러가 날 수 있다.

## 구현 순서

1. `public/data/geojson/korea` 생성 및 GeoJSON 복사
2. `loadKoreaAdministrativePolygons.js`를 lazy loader 구조로 변경
3. `zoomController.js`를 async update 구조로 변경
4. `MapBox.jsx`의 직접 hover 바인딩 제거
5. lint/build 검증

## 기대 효과

- `/map` 초기 진입 시 읍면동 34MB GeoJSON을 즉시 받지 않는다.
- 낮은 줌에서는 전국/시도 레이어만 로딩한다.
- 확대할 때만 상세 행정구역 데이터를 가져온다.
- build 결과에서 대형 GeoJSON asset이 JS import asset 목록으로 잡히지 않는다.

## 남은 장기 최적화

- 시도별 읍면동 chunk 분리
- bbox 기반 API 조회
- vector tile 또는 MVT 전환
- Mapbox source clustering/tiling 적용

## 2차 최적화 적용 내용

### 시도별 chunk 분리

시군구와 읍면동 GeoJSON을 전국 단일 파일에서 시도 단위 파일로 분리했다.

생성 경로:

- `public/data/geojson/korea/sigungu-by-sido/{sidoCode}.json`
- `public/data/geojson/korea/emd-by-sido/{sidoCode}.json`
- `public/data/geojson/korea/korea_sigungu_chunk_index.json`
- `public/data/geojson/korea/korea_emd_chunk_index.json`

각 index 항목에는 다음 정보가 들어간다.

```json
{
  "sidoCode": "11",
  "file": "/data/geojson/korea/emd-by-sido/11.json",
  "featureCount": 424,
  "bbox": [126.76, 37.42, 127.18, 37.70]
}
```

### viewport 기반 chunk 로딩

`loadKoreaAdministrativePolygons.js`는 이제 시군구/읍면동 단계에서 전체 파일을 받지 않는다.

- 현재 Mapbox viewport bbox 계산
- bbox와 겹치는 시도 chunk만 선택
- 선택된 chunk만 fetch
- 이미 받은 chunk는 메모리에 캐싱
- 현재 viewport와 관련 있는 feature만 source에 `setData`

### 제거한 파일

런타임에서 더 이상 사용하지 않는 public 전체 파일을 제거했다.

- `public/data/geojson/korea/skorea-municipalities-2018-geo.json`
- `public/data/geojson/korea/skorea-submunicipalities-2018-geo.json`

시도 전체 파일은 country/sido 레이어에서 재사용하므로 유지한다.

### 추가 개선 효과

- zoom 8 진입 시 전국 시군구 18MB 대신 현재 화면과 겹치는 시도 chunk만 로드
- zoom 11 진입 시 전국 읍면동 34MB 대신 현재 화면과 겹치는 시도 chunk만 로드
- 지도 이동 시 `moveend`에서 viewport 기준 chunk를 추가 로딩
- Vite build asset에는 대형 GeoJSON이 포함되지 않고 public 정적 파일로 유지

### 아직 남은 병목

- 시도 GeoJSON 자체가 약 7MB라 초기 country/sido 레이어도 가볍지는 않다.
- 일부 시도 chunk는 여전히 크다. 예: 전라남도 읍면동 chunk 약 7MB대.
- 더 줄이려면 geometry simplification 또는 vector tile 전환이 필요하다.

## 3차 최적화 적용 내용

### geometry simplification 파일 생성

원본 GeoJSON은 보존하고, 지도 표시용 경량 GeoJSON을 별도로 생성했다. 각 polygon ring에 Douglas-Peucker 방식의 좌표 단순화를 적용하고 좌표 소수점은 6자리로 정규화했다.

생성 경로:

- `public/data/geojson/korea/skorea-provinces-2018-simple-geo.json`
- `public/data/geojson/korea/sigungu-by-sido-simple/{sidoCode}.json`
- `public/data/geojson/korea/emd-by-sido-simple/{sidoCode}.json`
- `public/data/geojson/korea/korea_sigungu_simple_chunk_index.json`
- `public/data/geojson/korea/korea_emd_simple_chunk_index.json`

적용 기준:

- 시도: tolerance `0.006`
- 시군구: tolerance `0.0025`
- 읍면동: tolerance `0.0012`

### 런타임 참조 변경

`loadKoreaAdministrativePolygons.js`에서 기존 원본/청크 index 대신 경량 파일을 참조하도록 변경했다.

- country/sido: `skorea-provinces-2018-simple-geo.json`
- sigungu: `korea_sigungu_simple_chunk_index.json`
- emd: `korea_emd_simple_chunk_index.json`

### 크기 개선 예시

- 시도 전체: 약 `7.2MB` -> 약 `147KB`
- 전라남도 시군구 chunk: 약 `5.9MB` -> 약 `279KB`
- 전라남도 읍면동 chunk: 약 `7.5MB` -> 약 `505KB`

### 주의점

- 경계선은 표시용으로 단순화되었으므로 행정구역 정밀 판정, 점 포함 여부 계산, 주소 역매칭 같은 데이터 처리는 원본 또는 서버 API 기준으로 처리해야 한다.
- 현재 지도 화면의 polygon 시각화에는 경량 파일을 사용하고, 원본 데이터는 `data/geojson` 및 기존 public 원본 chunk에 보존한다.

## 3차 최적화 후 조정

읍면동 레벨은 확대 상태에서 경계선 깨짐이 눈에 띄어 원본 chunk로 롤백했다.

최종 런타임 참조:

- country/sido: `skorea-provinces-2018-simple-geo.json`
- sigungu: `korea_sigungu_simple_chunk_index.json`
- emd: `korea_emd_chunk_index.json`

이 조정으로 읍면동 레벨에서는 원본 경계 품질을 유지하고, 낮은 줌의 시도/시군구 레벨에서는 경량 파일 기반 성능 개선을 유지한다.

## 4차 최적화 적용 내용

### 읍면동 원본 chunk를 시군구 단위로 재분리

읍면동 경계 품질을 유지하기 위해 geometry simplification은 사용하지 않고, 원본 읍면동 GeoJSON을 시군구 단위 chunk로 더 잘게 분리했다.

생성 경로:

- `public/data/geojson/korea/emd-by-sigungu/{sigunguCode}.json`
- `public/data/geojson/korea/korea_emd_sigungu_chunk_index.json`

생성 기준:

- 읍면동 `code` 앞 5자리를 `sigunguCode`로 사용
- 각 chunk index에 `chunkId`, `sidoCode`, `sigunguCode`, `file`, `featureCount`, `bbox`, `bytes` 기록
- 읍면동 개별 feature에도 `bbox`를 기록해 런타임 viewport 필터링에 사용

### 런타임 로더 변경

`loadKoreaAdministrativePolygons.js`에서 읍면동 레벨만 다음 index를 사용하도록 변경했다.

- 기존: `korea_emd_chunk_index.json`
- 변경: `korea_emd_sigungu_chunk_index.json`

또한 chunk를 로드한 뒤에도 현재 viewport bbox와 겹치는 feature만 Mapbox source에 넣도록 변경했다. 이로 인해 같은 chunk가 로드되어 있어도 화면 밖 읍면동 polygon은 렌더링 대상에서 제외된다.

### 읍면동 라벨 표시 기준 조정

`zoomController.js`에 `EMD_LABEL: 13` 기준을 추가했다.

- `zoom >= 11`: 읍면동 polygon 표시
- `zoom >= 13`: 읍면동 label 표시

읍면동 polygon 품질은 유지하면서, 낮은 읍면동 줌에서 텍스트 레이어 렌더링 부담을 줄인다.

### 크기 개선 예시

- 전라남도 시도 단위 읍면동 chunk: 약 `7.5MB`
- 시군구 단위 최대 읍면동 chunk: 약 `1.9MB`
- 시군구 단위 읍면동 index: 약 `68KB`

### 최종 런타임 참조

- country/sido: `skorea-provinces-2018-simple-geo.json`
- sigungu: `korea_sigungu_simple_chunk_index.json`
- emd: `korea_emd_sigungu_chunk_index.json`
