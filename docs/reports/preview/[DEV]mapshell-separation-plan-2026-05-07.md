# U-TreeMap MapShell 분리 개발 기획서

작성일: 2026-05-07  
문서 구분: 개발 기획서  
대상 브랜치: `feature/codex/router`  
대상 영역: `U-TreeMap-FrontEnd/src/App.jsx`, `src/routes/AppRouter.jsx`, `src/pages`, `src/layouts`

## 1. 목적

현재 `/map`, `/my-trees`, `/profile`은 모두 `App` 컴포넌트를 통해 렌더링된다.

```jsx
<Route path={ROUTES.MAP} element={<App view="map" />} />
<Route path={ROUTES.MY_TREES} element={<App view="my-trees" />} />
<Route path={ROUTES.PROFILE} element={<App view="profile" />} />
```

`App.jsx`는 현재 다음 책임을 동시에 가진다.

- 지도 렌더링
- 모바일/PC viewport 판단
- 모바일 화면 선택
- PC 사이드바 화면 선택
- mock selectedTree 주입

이 구조는 처음에는 단순하지만, route가 늘어날수록 `App`이 "앱 전체 root"인지 "지도 화면 전용 layout"인지 모호해진다. 따라서 지도 기반 화면 전용 layout인 `MapShell`을 분리해 책임을 명확히 한다.

## 2. 현재 구조

### 2.1 App.jsx

현재 `App.jsx` 구조:

```jsx
export default function App({ view = 'map' }) {
  const isMobile = useIsMobile();
  const selectedTree = mockTreeData;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapBox isMobile={isMobile} />

      {isMobile ? (
        <MobilePage selectedTree={selectedTree} view={view} />
      ) : (
        <MainPage selectedTree={selectedTree} view={view} />
      )}
    </div>
  );
}
```

### 2.2 AppRouter.jsx

현재 지도 계열 route:

```jsx
<Route path={ROUTES.MAP} element={<App view="map" />} />
<Route path={ROUTES.MY_TREES} element={<App view="my-trees" />} />
<Route path={ROUTES.PROFILE} element={<App view="profile" />} />
```

### 2.3 화면 분기

| view | PC | 모바일 |
|---|---|---|
| `map` | `MainPage -> Sidebar -> HomeContent` | `MobilePage` 지도 상단 UI + 바텀시트 |
| `my-trees` | `MainPage -> Sidebar -> MyTreeContent` | `MobilePage` 임시 내 나무 화면 |
| `profile` | `MainPage -> Sidebar -> ProfileContent` | `MobilePage` 임시 프로필 화면 |

## 3. 목표 구조

### 3.1 핵심 방향

- `MapShell`은 지도 기반 화면의 공통 layout을 담당한다.
- `AppRouter`는 `/map`, `/my-trees`, `/profile`에서 `MapShell`을 렌더링한다.
- `App.jsx`는 제거하거나 얇은 wrapper로만 남긴다.
- `MapShell`이 `MapBox`, `MainPage`, `MobilePage`, viewport 분기, selectedTree 주입을 담당한다.

### 3.2 목표 파일 구조

```text
src/
  layouts/
    MapShell.jsx
  routes/
    AppRouter.jsx
    routePaths.js
  App.jsx
```

1차 구현에서는 `App.jsx`를 바로 삭제하지 않고 호환 wrapper로 유지하는 것이 안전하다.

```jsx
// App.jsx
import MapShell from './layouts/MapShell';

export default function App({ view = 'map' }) {
  return <MapShell view={view} />;
}
```

이후 참조가 사라지면 `App.jsx` 제거 여부를 결정한다.

## 4. 설계안

### 4.1 MapShell 책임

`MapShell`이 담당할 책임:

- 지도 배경 렌더링
- viewport 판단
- PC overlay 렌더링
- 모바일 overlay 렌더링
- 현재 지도 계열 view 전달
- 현재 선택된 나무 데이터 전달

예상 코드:

```jsx
import MainPage from '../pages/MainPage';
import MobilePage from '../pages/MobilePage';
import MapBox from '../components/MapBox';
import { useIsMobile } from '../hooks/hook';
import { mockTreeData } from '../data/mockTreeData';

export default function MapShell({ view = 'map' }) {
  const isMobile = useIsMobile();
  const selectedTree = mockTreeData;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapBox isMobile={isMobile} />

      {isMobile ? (
        <MobilePage selectedTree={selectedTree} view={view} />
      ) : (
        <MainPage selectedTree={selectedTree} view={view} />
      )}
    </div>
  );
}
```

### 4.2 AppRouter 변경

변경 전:

```jsx
import App from '../App';

<Route path={ROUTES.MAP} element={<App view="map" />} />
```

변경 후:

```jsx
import MapShell from '../layouts/MapShell';

<Route path={ROUTES.MAP} element={<MapShell view="map" />} />
```

### 4.3 App.jsx 처리

선택지는 두 가지다.

| 선택지 | 설명 | 권장 |
|---|---|---|
| App wrapper 유지 | `App`이 `MapShell`만 반환 | 1차 권장 |
| App 제거 | `App.jsx` 삭제 및 모든 import 제거 | 2차 검토 |

현재 프로젝트에서 `App.jsx`가 React 앱 root처럼 인식될 가능성이 있으므로, 1차에서는 wrapper로 유지하는 편이 안전하다.

## 5. 작업 범위

### 포함

- `src/layouts/MapShell.jsx` 생성
- `App.jsx`를 wrapper로 축소
- `AppRouter.jsx`에서 지도 계열 route를 `MapShell`로 교체
- 변경 파일 lint 확인
- `npm run build` 확인
- `/map`, `/my-trees`, `/profile` route 동작 확인

### 제외

- `MobilePage` 실제 UI 개선
- `MyTreeContent`, `ProfileContent` 기능 보강
- `selectedTree` mock 제거
- `useSelectedTree` API 흐름 연결
- `MapBox` lint/ref 문제 수정
- 나무 등록/수정 form 공통화

## 6. 세부 작업 Phase

### Phase 0: 사전 확인

목표:

- 현재 변경 상태와 route 연결 상태를 확인한다.

작업:

1. `git status --short --branch` 확인
2. `App.jsx` 현재 책임 확인
3. `AppRouter.jsx`에서 `App` import 위치 확인
4. `/map`, `/my-trees`, `/profile` 현재 route 확인

테스트 포인트:

- 현재 `npm run build` 성공 여부

완료 기준:

- 작업 전 기준 상태를 파악한다.

### Phase 1: MapShell 생성

목표:

- `App.jsx`의 지도 layout 책임을 `MapShell`로 이동한다.

작업:

1. `src/layouts/` 디렉터리 생성
2. `src/layouts/MapShell.jsx` 생성
3. 기존 `App.jsx`의 import와 렌더링 구조를 `MapShell.jsx`로 이동
4. import path를 layouts 기준으로 조정

예상 변경 파일:

- `src/layouts/MapShell.jsx`

테스트 포인트:

- 아직 router 연결 전이므로 빌드 import 오류 여부만 확인

완료 기준:

- `MapShell` 단독 컴포넌트가 기존 `App`과 같은 화면 구조를 가진다.

### Phase 2: App.jsx wrapper 축소

목표:

- `App.jsx`가 직접 지도 layout을 관리하지 않도록 한다.

작업:

1. `App.jsx`에서 기존 지도 관련 import 제거
2. `MapShell` import
3. `App`은 `<MapShell view={view} />`만 반환

예상 코드:

```jsx
import MapShell from './layouts/MapShell';

export default function App({ view = 'map' }) {
  return <MapShell view={view} />;
}
```

테스트 포인트:

- 기존 `App` import가 남아 있어도 화면 동작 유지
- build 성공

완료 기준:

- `App.jsx`가 얇은 wrapper가 된다.

### Phase 3: AppRouter에서 MapShell 직접 사용

목표:

- `/map`, `/my-trees`, `/profile` route가 `App`이 아니라 `MapShell`을 직접 렌더링하도록 한다.

작업:

1. `AppRouter.jsx`에서 `App` import 제거
2. `MapShell` import 추가
3. 지도 계열 route element 교체

변경 전:

```jsx
<Route path={ROUTES.MAP} element={<App view="map" />} />
```

변경 후:

```jsx
<Route path={ROUTES.MAP} element={<MapShell view="map" />} />
```

테스트 포인트:

- `/map` 접근
- `/my-trees` 접근
- `/profile` 접근
- 각 URL 새로고침
- 사이드바 active icon 유지

완료 기준:

- `AppRouter`가 지도 계열 화면에 `MapShell`을 직접 사용한다.

### Phase 4: App.jsx 제거 가능성 검토

목표:

- `App.jsx`를 남길지 제거할지 판단한다.

작업:

1. `rg "from './App|from '../App|<App"`로 참조 검색
2. `main.jsx`, `AppRouter.jsx`에서 더 이상 사용하지 않으면 제거 후보로 표시
3. 이번 작업에서는 삭제하지 않고 유지할지 결정

권장:

- 1차에서는 삭제하지 않는다.
- 이후 프로젝트 팀이 `App.jsx` 유지 정책을 정하면 삭제한다.

테스트 포인트:

- 미사용 파일이 lint 대상에서 문제가 되는지 확인

완료 기준:

- `App.jsx` 유지/삭제 정책이 명확하다.

### Phase 5: 검증과 문서 갱신

목표:

- 변경 후 route 동작과 문서를 맞춘다.

작업:

1. 변경 파일 대상 ESLint 실행
2. `npm run build`
3. `git diff --check`
4. `docs/routing.md`의 `/map`, `/my-trees`, `/profile` 렌더링 항목을 `MapShell` 기준으로 갱신
5. 필요하면 작업 기록 문서 추가

검증 명령:

```bash
cd U-TreeMap-FrontEnd
npx eslint src/App.jsx src/layouts/MapShell.jsx src/routes/AppRouter.jsx
npm run build
git diff --check
```

수동 확인 URL:

```text
http://localhost:5173/map
http://localhost:5173/my-trees
http://localhost:5173/profile
```

완료 기준:

- 빌드 성공
- 변경 파일 lint 성공
- 3개 지도 계열 route가 기존과 같은 화면을 렌더링

## 7. 테스트 체크리스트

### PC

- `/map`: 지도 + 사이드바 홈
- `/my-trees`: 지도 + 사이드바 내 나무
- `/profile`: 지도 + 사이드바 프로필
- 사이드바 아이콘 클릭 시 URL 변경
- 새로고침 후 동일 view 유지

### 모바일

- `/map`: 지도 + 상단 검색 + 바텀시트
- `/my-trees`: 모바일 내 나무 화면
- `/profile`: 모바일 프로필 화면
- 새로고침 후 동일 view 유지

### 공통

- `/`는 `/map`으로 redirect
- 알 수 없는 주소는 `/map`으로 redirect
- `MapBox`가 중복 마운트되지 않는지 브라우저 콘솔 확인

## 8. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| import path 실수 | 빌드 실패 | Phase별 build/lint 확인 |
| `App.jsx` 제거로 팀 관성 깨짐 | 혼란 | 1차에서는 wrapper 유지 |
| `MapShell` 이름과 `MapBox` 혼동 | 역할 혼동 | 문서에 Shell/Layout 역할 명시 |
| 지도 재마운트 증가 | 성능 저하 | route 변경 시 기존 동작과 동일한지 확인 |
| 기존 mock selectedTree 고착 | 데이터 흐름 미해결 | 이번 작업 범위에서 제외하고 후속 작업으로 분리 |

## 9. 후속 작업

MapShell 분리 후 다음 작업은 `TreeRequestRoute` 내부 form 상태 공통화다.

후속 순서:

1. `useTreeRequestForm` hook 설계
2. `TreeAddRequestPage`, `TreeEditRequestPage`, 모바일 대응 페이지에 공통 props 주입
3. 나무 이름 검색 모달을 등록/수정 form 내부로 연결
4. form submit/API 연동

## 10. 수용 기준

- `src/layouts/MapShell.jsx`가 생성되어 지도 계열 layout을 담당한다.
- `AppRouter.jsx`의 `/map`, `/my-trees`, `/profile` route가 `MapShell`을 직접 사용한다.
- `App.jsx`는 wrapper로 축소되거나 유지 정책이 문서화된다.
- 기존 `/map`, `/my-trees`, `/profile` 화면 동작이 유지된다.
- 변경 파일 대상 lint와 build가 통과한다.
- `docs/routing.md`가 `MapShell` 기준으로 갱신된다.
