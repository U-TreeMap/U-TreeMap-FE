# Router / Responsive Routing 작업 정리

작성일: 2026-05-07  
브랜치: `feature/codex/router`  
작업 대상: `U-TreeMap-FrontEnd/src/routes`, `src/layouts`, `src/components/SideBar.jsx`

## 1. 작업 목적

이번 작업의 목적은 기존에 흩어져 있던 라우팅 구조를 기능 중심으로 정리하고, 모바일/PC 화면을 같은 URL에서 viewport 기준으로 분기하도록 만드는 것이다.

기존 상태는 다음 문제가 있었다.

- 활성 route가 제한적이었다.
- 사이드바 탭이 URL과 완전히 동기화되지 않았다.
- 모바일/PC 컴포넌트가 route 레벨에서 직접 분기되어 라우터가 점점 복잡해질 수 있었다.
- `App.jsx`가 지도 layout, viewport 분기, 페이지 선택 책임을 동시에 가지고 있었다.

## 2. 완료한 작업 범위

### 2.1 Router 엔트리 정리

`main.jsx`에서 직접 `BrowserRouter`, `Routes`, `Route`를 관리하던 구조를 분리했다.

현재 구조:

- `main.jsx`: `AppRouter`만 렌더링
- `routes/AppRouter.jsx`: 전체 route map 관리

### 2.2 route path 상수화

신규 파일:

- `U-TreeMap-FrontEnd/src/routes/routePaths.js`

주요 route 문자열을 `ROUTES` 객체로 관리하도록 했다.

포함된 주요 주소:

```text
/
/map
/my-trees
/my-tree
/profile
/trees/new
/trees/:treeId/edit
/tree-add-request
/tree-edit-request
/rooms
/room-list
/teams
/teem-list
/rooms/:roomId/trees
/tree-list
/tree-name-search
/volunteer
```

### 2.3 MapShell 분리

신규 파일:

- `U-TreeMap-FrontEnd/src/layouts/MapShell.jsx`

기존 `App.jsx`가 담당하던 지도 기반 layout 책임을 `MapShell`로 이동했다.

`MapShell` 책임:

- `MapBox` 렌더링
- 모바일/PC viewport 판단
- `MainPage` 또는 `MobilePage` 선택
- 현재 URL 기준 view 계산
- `selectedTree` mock 데이터 전달

현재 `App.jsx`는 호환 wrapper로 축소했다.

```jsx
import MapShell from './layouts/MapShell';

export default function App({ view = 'map' }) {
  return <MapShell view={view} />;
}
```

`AppRouter`의 지도 계열 route는 이제 `App`이 아니라 `MapShell`을 직접 렌더링한다.

```jsx
<Route path={ROUTES.MAP} element={<MapShell view="map" />} />
<Route path={ROUTES.MY_TREES} element={<MapShell view="my-trees" />} />
<Route path={ROUTES.PROFILE} element={<MapShell view="profile" />} />
```

### 2.4 사이드바 URL 동기화

수정 파일:

- `U-TreeMap-FrontEnd/src/components/SideBar.jsx`
- `U-TreeMap-FrontEnd/src/components/UI/Sidebar/SidebarContents/NavigationRail.jsx`

사이드바 컨텐츠와 active 아이콘이 URL 기준으로 동작하도록 수정했다.

현재 기준:

| URL | 사이드바 컨텐츠 | active icon |
|---|---|---|
| `/map` | `HomeContent` | home |
| `/my-trees` | `MyTreeContent` | tree |
| `/my-tree` | `/my-trees`로 redirect | tree |
| `/profile` | `ProfileContent` | user |

`Sidebar`와 `NavigationRail` 모두 `useLocation()`으로 현재 pathname을 읽는다. 따라서 prop 전달이 꼬여도 URL 기준으로 화면이 맞춰진다.

### 2.5 기능별 route wrapper 추가

라우터가 모바일/PC 컴포넌트 쌍을 직접 많이 알지 않도록 route wrapper를 추가했다.

신규 파일:

- `U-TreeMap-FrontEnd/src/routes/TreeRequestRoute.jsx`
- `U-TreeMap-FrontEnd/src/routes/RoomListRoute.jsx`
- `U-TreeMap-FrontEnd/src/routes/TeamListRoute.jsx`
- `U-TreeMap-FrontEnd/src/routes/TreeListRoute.jsx`
- `U-TreeMap-FrontEnd/src/routes/TreeNameSearchRoute.jsx`
- `U-TreeMap-FrontEnd/src/routes/VolunteerRoute.jsx`

역할:

| wrapper | 역할 |
|---|---|
| `TreeRequestRoute` | 나무 등록/수정 화면을 모바일/PC로 분기 |
| `RoomListRoute` | 방 목록 화면을 모바일/PC로 분기 |
| `TeamListRoute` | 팀 목록 화면 연결 |
| `TreeListRoute` | 나무 목록 화면을 모바일/PC로 분기 |
| `TreeNameSearchRoute` | 나무 이름 검색 모달 route wrapper |
| `VolunteerRoute` | 봉사자 화면을 모바일/PC로 분기 |

### 2.6 직접 접근 route 추가

현재 직접 접근 가능한 주요 route:

```text
/map
/my-trees
/my-tree
/profile
/trees/new
/trees/:treeId/edit
/tree-add-request
/tree-edit-request
/rooms
/room-list
/teams
/teem-list
/rooms/:roomId/trees
/tree-list
/tree-name-search
/volunteer
```

alias 정책:

| alias | 처리 |
|---|---|
| `/my-tree` | `/my-trees`로 redirect |
| `/tree-add-request` | `/trees/new`로 redirect |
| `/room-list` | `/rooms`로 redirect |
| `/teem-list` | `/teams`로 redirect |
| `/tree-list` | `TreeListRoute` 직접 렌더 |
| `/tree-edit-request` | `TreeRequestRoute mode="edit"` 렌더 |

### 2.7 placeholder 컴포넌트 추가

기존에 0 line이던 파일은 route 연결 시 빌드가 깨지므로 최소 placeholder를 추가했다.

수정 파일:

- `U-TreeMap-FrontEnd/src/components/TreeData/RoomList.jsx`
- `U-TreeMap-FrontEnd/src/components/TreeData/TeemList.jsx`
- `U-TreeMap-FrontEnd/src/components/TreeData/Volunteer.jsx`

주의:

- 이 화면들은 실제 기능 구현이 아니라 route 연결 확인용 placeholder다.

### 2.8 라우팅 문서 갱신

수정/추가 문서:

- `docs/routing.md`
- `docs/reports/preview/[DEV]responsive-routing-unification-plan-2026-05-06.md`
- `docs/reports/preview/[DEV]mapshell-separation-plan-2026-05-07.md`

`docs/routing.md`에는 현재 실제 route map과 모바일/PC 분기 정책을 정리했다.

## 3. 현재 AppRouter 구조

현재 핵심 route map:

```jsx
<Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.MAP} replace />} />
<Route path={ROUTES.MAP} element={<MapShell view="map" />} />
<Route path={ROUTES.MY_TREES} element={<MapShell view="my-trees" />} />
<Route path={ROUTES.MY_TREE_ALIAS} element={<Navigate to={ROUTES.MY_TREES} replace />} />
<Route path={ROUTES.PROFILE} element={<MapShell view="profile" />} />
<Route path={ROUTES.TREE_NEW} element={<TreeRequestRoute mode="add" />} />
<Route path={ROUTES.TREE_EDIT} element={<TreeRequestRoute mode="edit" />} />
<Route path={ROUTES.TREE_ADD_REQUEST} element={<Navigate to={ROUTES.TREE_NEW} replace />} />
<Route path={ROUTES.TREE_EDIT_REQUEST} element={<TreeRequestRoute mode="edit" />} />
<Route path={ROUTES.ROOMS} element={<RoomListRoute />} />
<Route path={ROUTES.ROOM_LIST} element={<Navigate to={ROUTES.ROOMS} replace />} />
<Route path={ROUTES.TEAMS} element={<TeamListRoute />} />
<Route path={ROUTES.TEEM_LIST} element={<Navigate to={ROUTES.TEAMS} replace />} />
<Route path={ROUTES.ROOM_TREES} element={<TreeListRoute />} />
<Route path={ROUTES.TREE_LIST} element={<TreeListRoute />} />
<Route path={ROUTES.TREE_NAME_SEARCH} element={<TreeNameSearchRoute />} />
<Route path={ROUTES.VOLUNTEER} element={<VolunteerRoute />} />
<Route path="*" element={<Navigate to={ROUTES.MAP} replace />} />
```

## 4. 검증 결과

### 4.1 통과한 검증

실행한 검증:

```bash
npm run build
git diff --check
```

변경 파일 대상 ESLint도 통과했다.

대표 실행:

```bash
npx eslint src/components/SideBar.jsx src/components/UI/Sidebar/SidebarContents/NavigationRail.jsx src/layouts/MapShell.jsx src/routes/AppRouter.jsx src/routes/routePaths.js
```

### 4.2 dev server route 응답 확인

dev server:

```bash
npm run dev -- --host 0.0.0.0
```

HTTP 200 확인한 route:

```text
/map
/my-trees
/my-tree
/profile
/rooms
/teams
/rooms/1/trees
/volunteer
/tree-name-search
```

### 4.3 남아 있는 전체 lint 이슈

전체 `npm run lint`는 기존 코드 이슈 때문에 아직 실패할 수 있다.

기존 이슈 예:

- `MapBox.jsx` render 중 ref 접근
- `api/region.js`의 `apiClient` import 누락
- 일부 UI 컴포넌트의 미사용 import/state
- `features/ui/getSelectedTree.js` hook 규칙 위반

이번 라우팅 작업 변경 파일 기준으로는 lint를 통과했다.

## 5. 현재 한계

- `RoomList`, `TeemList`, `Volunteer`는 placeholder다.
- 모바일 `/my-trees`, `/profile`은 기본 표시 수준이다.
- `TreeRequestRoute`는 화면 분기만 담당하고 form state 공통화는 아직 하지 않았다.
- `TreeNameSearchModal`은 독립 route로 접근 가능하지만 장기적으로는 등록/수정 form 내부 모달로 들어가는 것이 자연스럽다.
- `TeemList`는 파일명 오타 가능성이 있다. 추후 `TeamList`로 정리 필요.

## 6. 다음 작업 제안

다음 순서가 적절하다.

1. `TreeRequestRoute` 내부 form 상태 공통화
2. `useTreeRequestForm` hook 설계
3. `TreeAddRequestPage`, `TreeEditRequestPage`, 모바일 대응 페이지에 공통 props 주입
4. `TreeNameSearchModal`을 등록/수정 form 내부 흐름에 연결
5. placeholder인 `RoomList`, `TeemList`, `Volunteer` 실제 UI 구현
6. 기존 전체 lint 오류 중 라우팅 안정성에 영향을 주는 `MapBox.jsx`, `api/region.js` 정리

## 7. 확인용 URL

개발 서버 실행 후 아래 URL로 확인한다.

```text
http://localhost:5173/map
http://localhost:5173/my-trees
http://localhost:5173/my-tree
http://localhost:5173/profile
http://localhost:5173/trees/new
http://localhost:5173/trees/123/edit
http://localhost:5173/rooms
http://localhost:5173/teams
http://localhost:5173/rooms/1/trees
http://localhost:5173/tree-name-search
http://localhost:5173/volunteer
```
