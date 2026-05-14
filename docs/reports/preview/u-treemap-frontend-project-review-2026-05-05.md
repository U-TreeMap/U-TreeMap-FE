# U-TreeMap Front-End 프로젝트 프리뷰 리포트

작성일: 2026-05-05  
분석 대상: `U-TreeMap-FrontEnd` Vite/React 앱 및 루트 문서/설정

## 1. 프로젝트 개요

U-TreeMap Front-End는 울산 지역 도시 수목 데이터를 지도 기반으로 시각화하는 프론트엔드 프로젝트다. 핵심 목표는 사용자가 지도에서 지역별 수목 밀도, 탄소 저장량, 개별 나무 상세 정보를 직관적으로 확인하도록 만드는 것이다.

현재 구현은 Mapbox 지도 위에 다음 표현 단계를 얹는 방식이다.

- 낮은 줌: 울산광역시 단위 폴리곤과 집계 라벨
- 중간 줌: 구/군 단위 폴리곤과 집계 라벨
- 높은 줌: 읍/면/동 단위 폴리곤과 집계 라벨
- 상세 줌: 개별 나무 마커

데스크톱은 좌측 사이드바 중심 UI, 모바일은 상단 검색 영역과 하단 바텀시트 중심 UI로 분기된다.

## 2. 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 빌드/런타임 | Vite, React 19 |
| 스타일 | Tailwind CSS v4, PostCSS |
| 지도 | Mapbox GL JS |
| 상태 관리 | Zustand |
| HTTP | Axios |
| 반응형/모바일 UI | react-responsive, vaul |
| 아이콘/에셋 | SVG, vite-plugin-svgr |
| 품질 도구 | ESLint |

특이사항:

- 루트에도 `package.json`이 있고 실제 앱 폴더 `U-TreeMap-FrontEnd`에도 `package.json`이 있다.
- 실제 개발/빌드 명령은 `U-TreeMap-FrontEnd` 하위에서 실행해야 한다.
- `vite`는 `rolldown-vite` alias를 사용한다.
- `VITE_MAPBOX_TOKEN`, `VITE_API_BASE_URL` 환경변수 의존성이 있다.

## 3. 현재 구조

```text
U-TreeMap-FrontEnd/
  src/
    api/                 # 백엔드 API 래퍼
    assets/              # SVG, 이미지 에셋
    components/          # 지도, 사이드바, 모바일 바텀시트, UI 컴포넌트
    data/                # mock 데이터와 울산 GeoJSON/통계 더미 데이터
    features/
      gps/               # 위치 좌표 취득
      map/               # Mapbox 레이어/마커/줌 제어
      ui/                # 상세 데이터 어댑터와 포맷터
    hooks/               # 모바일 판별, 선택 나무 상세 조회
    lib/                 # Axios client, Mapbox reverse geocode
    pages/               # MainPage, MobilePage
    stores/              # Zustand stores
```

루트 `docs/`에는 기존 `architecture.md`, `development-guide.md`, `feature-roadmap.md`, `setup.md`가 있으며, 현재 문서는 실제 코드 기준으로 보강한 프리뷰 리포트다.

## 4. 실행 흐름

1. `src/App.jsx`
   - 모바일 여부를 판별한다.
   - `MapBox`를 전체 화면으로 렌더링한다.
   - 모바일이면 `MobilePage`, 데스크톱이면 `MainPage`를 오버레이한다.

2. `src/components/MapBox.jsx`
   - `VITE_MAPBOX_TOKEN`으로 Mapbox access token을 설정한다.
   - 지도 중심을 울산 좌표 `[129.2566, 35.5434]`로 설정한다.
   - 지도 로드 후 나무 마커와 울산 행정구역 레이어를 로드한다.
   - `setupZoomController(map)`로 줌 레벨에 따라 레이어를 토글한다.

3. `src/features/map/*`
   - `loadUlsanMetropolitanCity`, `loadUlsanDistricts`, `loadUlsanSubmunicipalities`가 GeoJSON과 더미 통계를 병합해 Mapbox source/layer를 추가한다.
   - `loadTreeMarkers`가 API에서 마커 목록을 받아 DOM 기반 Mapbox Marker를 준비한다.
   - `zoomController`가 줌 기준에 따라 광역시/구군/읍면동/마커 표시 상태를 바꾼다.

4. 나무 선택
   - 마커 클릭 시 `useMapStore.getState().setSelectedTreeId(tree.treeId)`로 선택 ID를 저장한다.
   - `useSelectedTree`는 `selectedTreeId`를 감지해 `/api/v1/utree-map/trees/{treeId}` 상세 API를 호출하고 `adaptTreeDetail`로 UI 모델을 만든다.

## 5. 구현된 기능

### 지도 시각화

- Mapbox 기반 지도 렌더링
- 울산 행정구역 GeoJSON 레이어 로딩
- 줌 레벨에 따른 행정구역/마커 전환
- 행정구역별 수목 수 또는 탄소 저장량 라벨 표현 구조
- 읍/면/동 폴리곤 hover 상태 처리
- 지도 회전/기울기 제스처 제한

### 나무 데이터

- 전체 마커 API 호출 구조
- 개별 나무 상세 API 호출 구조
- API 응답을 UI 표시 모델로 변환하는 어댑터
- 상세 패널에 나무명, 학명, 위치, 좌표, 스펙, 설명 탭 표시

### UI

- 데스크톱 좌측 내비게이션 레일과 사이드바
- 모바일 상단 검색바와 필터 버튼
- 모바일 바텀시트 상세 UI
- 지도 줌/현재 위치 컨트롤 분리
- 나무 등록/수정 요청 페이지 일부 시안 컴포넌트

### GPS/위치

- 브라우저 Geolocation watch 구조
- Mapbox reverse geocoding 유틸
- 내 위치 표시 관련 기능 파일 존재

## 6. 개발 의도

현재 코드에서 보이는 개발 의도는 다음과 같다.

- 지도 줌 레벨을 정보 밀도 조절 장치로 사용하려는 설계
- 도시 단위의 큰 환경 지표에서 개별 수목 상세로 자연스럽게 내려가는 탐색 경험
- PC와 모바일 사용 경험을 별도 레이아웃으로 최적화하려는 방향
- 백엔드 API와 더미 GeoJSON을 병행하면서 점진적으로 실제 데이터 연동을 확장하는 방식
- 수목 데이터 등록/수정, 봉사/팀/방 생성 같은 시민 참여 또는 현장 조사 기능까지 확장하려는 흔적

## 7. 확인된 취약점과 리스크

### 7.1 데이터 흐름 불일치

`App.jsx`에서 `useSelectedTree()`를 호출하지만 반환된 `tree`, `loading`은 실제 화면에 전달되지 않는다. 화면에는 여전히 `mockTreeData` 기반 `selectedTree`가 전달된다. 따라서 마커를 클릭해도 상세 API 결과가 UI에 반영되지 않을 가능성이 높다.

개선 방향:

- `selectedTree` 로컬 state를 제거하거나 API 상세 결과와 명확히 병합한다.
- `loading`, `error`, `empty` 상태를 사이드바/바텀시트에서 표시한다.

### 7.2 API 모듈 오류

`src/api/region.js`에서 `apiClient`를 import하지 않고 사용한다. 해당 API를 호출하는 순간 런타임 에러가 발생한다.

개선 방향:

- `import { apiClient } from "../lib/apiClient";` 추가
- API 모듈별 smoke test 또는 최소 단위 테스트 추가

### 7.3 Zustand store 버그

`UseMapStore.js`의 `clearSelection`은 `selectedTree`를 null로 설정하지만 실제 store 필드는 `selectedTreeId`다.

개선 방향:

- `clearSelection: () => set({ selectedTreeId: null })`로 수정
- store 필드명과 액션 인자명을 `treeId`로 통일

### 7.4 React Hook 규칙 위반

`features/ui/getSelectedTree.js`는 일반 함수 안에서 `useMapStore` 훅을 호출한다. ESLint가 Hook 규칙 위반으로 탐지한다.

개선 방향:

- 필요하면 `useSelectedTree` 훅으로 통합한다.
- 비컴포넌트 함수에서 store 값을 읽어야 하면 `useMapStore.getState()`를 사용한다.

### 7.5 Mapbox Marker 관리 리스크

`loadTreeMarkers.js`는 모듈 전역 배열 `treeMarkers`에 마커를 누적한다. `MapBox`가 재마운트되거나 지도 재초기화가 반복되면 중복 마커/메모리 누수 가능성이 있다.

개선 방향:

- `loadTreeMarkers`가 cleanup 함수를 반환하도록 변경한다.
- 지도 인스턴스 생명주기와 마커 배열 생명주기를 일치시킨다.
- 수천 개 이상 마커는 DOM Marker 대신 Mapbox source/layer 또는 clustering으로 전환한다.

### 7.6 지도 데이터와 API 데이터 혼재

행정구역 통계는 더미 JSON에서 읽고, 마커/상세는 API에서 읽는다. 실제 서비스 데이터 정합성 관점에서 집계 값과 개별 마커 값이 서로 다를 수 있다.

개선 방향:

- 행정구역 집계 API와 GeoJSON 속성 병합 기준을 명확히 정의한다.
- 더미 데이터 파일은 개발용으로 분리하고 환경별 data source를 명시한다.

### 7.7 환경변수와 장애 처리 부족

`VITE_API_BASE_URL` 누락 시 Axios baseURL이 undefined가 되고, API 실패 시 사용자에게 표시되는 fallback이 약하다. Mapbox token 누락은 console error만 남기고 화면 상태는 비어 있을 수 있다.

개선 방향:

- 앱 시작 시 필수 환경변수 검증
- 지도/API 실패 시 사용자에게 재시도 가능한 에러 UI 제공
- axios interceptor로 공통 에러 포맷 처리

### 7.8 위치 정보 프라이버시와 디버그 로그

GPS 관련 코드가 좌표, 주소, 정확도 등을 `console.log`로 출력한다. 개발 단계에서는 유용하지만 실제 사용자 위치 데이터는 민감 정보다.

개선 방향:

- production 로그 제거 또는 debug flag 기반 출력
- 위치 권한 요청 시 사용 목적 고지
- 위치 watch 해제 흐름을 UI 생명주기와 명확히 연결

### 7.9 지도 토큰 노출 특성

Mapbox public token은 프론트엔드에 노출될 수밖에 없으나, 도메인 제한/사용량 제한이 없으면 오남용 위험이 있다.

개선 방향:

- Mapbox token URL/domain restriction 설정
- 운영/개발 토큰 분리
- 예산/사용량 alert 설정

### 7.10 빌드 크기와 성능

`npm run build` 결과 단일 JS 번들이 약 2,027.91 kB, gzip 약 572.38 kB로 경고가 발생했다. GeoJSON 에셋도 0.5MB~1.3MB 규모다.

개선 방향:

- 지도/등록 페이지/모바일 전용 페이지 dynamic import
- Mapbox 관련 코드 lazy load
- GeoJSON simplification 또는 tileset/vector tile 사용 검토
- Mapbox layer 기반 렌더링과 clustering 적용

### 7.11 린트 실패

`npm run lint` 결과 40 errors, 1 warning이 발생했다. 주요 유형은 미사용 import/state, React Hook 규칙 위반, 렌더 중 ref 접근, Fast Refresh 규칙 위반이다.

우선 처리할 항목:

- `region.js`의 `apiClient` 누락
- `getSelectedTree.js` Hook 규칙 위반
- `MapBox.jsx`의 `mapRef.current` 렌더 접근
- `App.jsx`의 실제 상세 데이터 연결
- 대량 미사용 import와 주석 처리된 이전 구현 정리

## 8. 검증 결과

분석 중 실행한 명령:

```bash
cd U-TreeMap-FrontEnd
npm run lint
npm run build
```

결과:

- `npm run build`: 성공
- `npm run lint`: 실패

빌드는 성공하므로 현재 산출물 생성은 가능하다. 다만 린트 실패 항목 중 일부는 실제 런타임 장애로 이어질 수 있으므로, 배포 전 품질 기준으로는 아직 불안정하다.

## 9. 개발 방향 제안

### 1단계: 데이터 흐름 정상화

- `selectedTreeId -> fetchTreeDetail -> adapted tree -> UI` 흐름을 완성한다.
- mock 데이터는 초기/empty 상태 전용으로 제한한다.
- `loading`, `error`, `not found` 상태를 상세 패널에 반영한다.

### 2단계: 지도 레이어 생명주기 정리

- Mapbox map instance, source, layer, marker cleanup 정책을 정리한다.
- 중복 addSource/addLayer 방지 로직을 추가한다.
- DOM marker 대량 렌더링 전략을 Mapbox layer 또는 cluster 기반으로 전환할지 결정한다.

### 3단계: API 계약 정리

- 마커 목록, 나무 상세, 행정구역 집계 응답 타입을 문서화한다.
- `adaptTreeDetail` 같은 어댑터를 API별로 두어 UI와 서버 응답 변경을 분리한다.
- Axios 공통 에러 처리와 timeout을 추가한다.

### 4단계: 모바일/데스크톱 라우팅과 화면 전환 정리

- 현재는 `App`에서 모바일 여부에 따라 페이지를 직접 분기한다.
- 등록/수정 요청 페이지가 실제 내비게이션에 연결되어 있지 않으므로 `react-router-dom` 기반 라우트 설계를 확정한다.
- 지도 화면, 상세 화면, 등록/수정 요청 화면, 팀/방/봉사 화면의 진입 경로를 정리한다.

### 5단계: 운영 준비

- 환경변수 문서 업데이트
- Mapbox token 제한
- 위치 정보 처리 정책 정리
- 번들 분할과 GeoJSON 최적화
- CI에서 `lint`와 `build`를 필수 검증으로 설정

## 10. 추천 우선순위

| 우선순위 | 작업 | 이유 |
|---|---|---|
| P0 | `selectedTree` mock 고정 문제 해결 | 핵심 기능인 마커 선택-상세 표시가 완성되지 않음 |
| P0 | `region.js` import 누락, store clear 버그 수정 | 런타임 에러 가능성 |
| P0 | Hook 규칙 위반 제거 | React 동작 안정성과 린트 실패 원인 |
| P1 | Mapbox marker/source cleanup 정리 | 지도 재마운트와 대량 데이터에서 누수/중복 위험 |
| P1 | API 에러/로딩 UI 추가 | 실제 서비스 사용성 확보 |
| P1 | console/alert 디버그 제거 | 운영 품질과 개인정보 보호 |
| P2 | 번들/GeoJSON 최적화 | 초기 로딩 성능 개선 |
| P2 | 라우팅 설계 정리 | 등록/수정/참여 기능 확장 기반 |

## 11. 단기 수정 체크리스트

- [ ] `src/api/region.js`에 `apiClient` import 추가
- [ ] `src/stores/UseMapStore.js`의 `clearSelection` 필드명 수정
- [ ] `src/App.jsx`에서 `useSelectedTree` 결과를 실제 UI로 전달
- [ ] `src/features/ui/getSelectedTree.js` 제거 또는 훅/순수 함수로 재작성
- [ ] `src/components/MapBox.jsx`에서 렌더 중 `mapRef.current` 직접 접근 제거
- [ ] `loadTreeMarkers` 전역 배열 초기화/cleanup 처리
- [ ] production에서 GPS/주소/좌표 console log 제거
- [ ] 미사용 import/state 정리 후 `npm run lint` 통과
- [ ] 대용량 GeoJSON/Mapbox 코드를 lazy load 또는 tileset 기반으로 최적화

## 12. 결론

이 프로젝트는 지도 기반 수목 데이터 서비스의 핵심 컨셉이 비교적 분명하다. 행정구역 단위 집계에서 개별 나무 상세로 내려가는 줌 기반 UX, 데스크톱/모바일 분기, API 연동 구조, 수목 데이터 등록 화면의 초기 형태가 이미 들어와 있다.

다만 현재는 프로토타입과 실제 연동 코드가 섞여 있는 단계다. 특히 선택된 나무 상세 데이터가 UI까지 연결되지 않는 점, 린트 실패, 지도 마커 생명주기 관리, 환경변수/위치정보 처리 방식은 먼저 정리해야 한다. 단기적으로는 데이터 흐름과 린트 실패를 고치고, 중기적으로는 Mapbox 레이어 성능과 API 계약을 안정화하는 방향이 적절하다.
