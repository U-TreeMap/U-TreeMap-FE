# Router 작업 기록

작성일: 2026-05-05  
브랜치: `feature/codex/router`  
작업 기준 문서: `docs/reports/preview/[DEV]u-treemap-routing-development-plan-2026-05-05.md`

## 1. 작업 요약

라우터 1차 구현을 진행했다. 기존에는 `BrowserRouter`는 있었지만 활성 라우트가 `/` 하나뿐이었고, 사이드바는 `activeTab` 로컬 state로 화면을 전환하고 있었다.

이번 작업에서는 라우트 엔트리를 분리하고, 주요 화면을 URL 기반으로 접근할 수 있도록 연결했다. 사이드바 내비게이션도 `NavLink` 기반으로 변경해 URL과 active icon이 동기화되도록 했다.

## 2. 완료한 Phase

개발 기획서의 세부 Phase 기준으로 다음까지 완료했다.

| Phase | 상태 | 비고 |
|---|---|---|
| Phase 0: 사전 정리와 기준선 확인 | 완료 | 현재 라우팅 구조, 사이드바 state 흐름, 모바일 진입 흐름 확인 |
| Phase 1: Router 엔트리 분리 | 완료 | `AppRouter.jsx` 생성, `main.jsx` 단순화 |
| Phase 2: 지도 Shell과 사이드바 컨텐츠 분리 | 완료 | `/map`, `/my-trees`, `/profile`을 `view` prop 기반으로 연결 |
| Phase 3: NavigationRail을 URL 기반으로 전환 | 완료 | `button + activeTab` 구조를 `NavLink` 기반으로 변경 |
| Phase 4: 모바일 기본 라우트 대응 | 완료 | 모바일 `/map`, `/my-trees`, `/profile` 기본 대응 |
| Phase 5: 나무 등록/수정 라우트 연결 | 완료 | `/trees/new`, `/trees/:treeId/edit` 연결 및 뒤로가기 동작 추가 |
| Phase 6: 미사용 import와 lint 영향 정리 | 부분 완료 | 라우팅 변경 파일의 미사용 import 정리. 전체 lint 기존 오류는 남음 |
| Phase 7 이후 | 미진행 | 방/봉사자 플로우는 아직 설계/구현 대상 |

현재 작업은 기획서 기준으로 Phase 5까지 완료했고, Phase 6은 라우팅 관련 변경 파일 범위에서만 부분 완료한 상태다.

## 3. 주요 변경 사항

### 3.1 라우터 파일 추가

신규 파일:

- `U-TreeMap-FrontEnd/src/routes/AppRouter.jsx`
- `U-TreeMap-FrontEnd/src/routes/ResponsiveRoute.jsx`

추가된 주요 라우트:

```text
/
/map
/my-trees
/profile
/trees/new
/trees/:treeId/edit
*
```

라우트 정책:

- `/`는 `/map`으로 redirect
- 알 수 없는 route는 `/map`으로 redirect
- `/trees/new`, `/trees/:treeId/edit`는 `ResponsiveRoute`로 데스크톱/모바일 컴포넌트를 분기

### 3.2 main.jsx 단순화

기존 `main.jsx`가 `BrowserRouter`, `Routes`, `Route`를 직접 관리하던 구조를 제거했다.

현재는 `AppRouter`만 렌더링한다.

### 3.3 App view 기반 연결

`App.jsx`에 `view` prop을 추가했다.

```jsx
<App view="map" />
<App view="my-trees" />
<App view="profile" />
```

`App`은 `view`를 `MainPage` 또는 `MobilePage`에 전달한다.

### 3.4 사이드바 URL 기반 전환

`SideBar.jsx`의 `activeTab` state와 `TABS` 상수를 제거했다.

이전 구조:

- 버튼 클릭
- `setActiveTab`
- 조건부 렌더링

변경 구조:

- `NavLink` 클릭
- URL 변경
- `view` prop 기준 컨텐츠 렌더링
- `NavLink isActive` 기준 active icon 표시

### 3.5 모바일 기본 화면 대응

`MobilePage.jsx`가 `view` prop을 받도록 수정했다.

현재 모바일 대응:

- `view === 'map'`: 기존 지도 상단 UI + 바텀시트
- `view === 'my-trees'`: 임시 내 나무 화면
- `view === 'profile'`: 임시 프로필 화면

### 3.6 나무 등록/수정 route 연결

연결 route:

- `/trees/new`
- `/trees/:treeId/edit`

데스크톱/모바일 분기:

- 데스크톱 등록: `TreeAddRequestPage`
- 모바일 등록: `MobTreeAddRequestPage`
- 데스크톱 수정: `TreeEditRequestPage`
- 모바일 수정: `MobTreeEditRequestPage`

각 페이지의 뒤로가기 버튼에 `useNavigate()` 기반 `navigate(-1)`를 연결했다.

## 4. 변경 파일

라우팅 작업으로 수정/추가한 파일:

- `U-TreeMap-FrontEnd/src/main.jsx`
- `U-TreeMap-FrontEnd/src/App.jsx`
- `U-TreeMap-FrontEnd/src/routes/AppRouter.jsx`
- `U-TreeMap-FrontEnd/src/routes/ResponsiveRoute.jsx`
- `U-TreeMap-FrontEnd/src/pages/MainPage.jsx`
- `U-TreeMap-FrontEnd/src/pages/MobilePage.jsx`
- `U-TreeMap-FrontEnd/src/components/SideBar.jsx`
- `U-TreeMap-FrontEnd/src/components/UI/Sidebar/SidebarContents/NavigationRail.jsx`
- `U-TreeMap-FrontEnd/src/components/TreeData/TreeAddRequestPage.jsx`
- `U-TreeMap-FrontEnd/src/components/TreeData/MobTreeAddRequestPage.jsx`
- `U-TreeMap-FrontEnd/src/components/TreeData/TreeEditRequestPage.jsx`
- `U-TreeMap-FrontEnd/src/components/TreeData/MobTreeEditRequestPage.jsx`

주의:

- `U-TreeMap-FrontEnd/src/components/UI/MapControlsMobile.jsx`는 작업 전부터 수정 상태였고, 이번 라우팅 작업에서는 의도적으로 건드리지 않았다.

## 5. 검증 결과

### 5.1 통과한 검증

변경 파일 대상 ESLint:

```bash
npx eslint src/main.jsx src/App.jsx src/routes/AppRouter.jsx src/routes/ResponsiveRoute.jsx src/components/SideBar.jsx src/components/UI/Sidebar/SidebarContents/NavigationRail.jsx src/pages/MainPage.jsx src/pages/MobilePage.jsx src/components/TreeData/TreeAddRequestPage.jsx src/components/TreeData/MobTreeAddRequestPage.jsx src/components/TreeData/TreeEditRequestPage.jsx src/components/TreeData/MobTreeEditRequestPage.jsx
```

결과: 통과

빌드:

```bash
npm run build
```

결과: 성공

diff whitespace 검사:

```bash
git diff --check
```

결과: 통과

### 5.2 dev server 확인

dev server:

```bash
npm run dev -- --host 0.0.0.0
```

확인 URL:

- `http://localhost:5173/`
- `http://localhost:5173/map`
- `http://localhost:5173/my-trees`
- `http://localhost:5173/profile`
- `http://localhost:5173/trees/new`
- `http://localhost:5173/trees/123/edit`

HTTP 응답 확인:

- `/map`: 200
- `/my-trees`: 200
- `/profile`: 200
- `/trees/new`: 200
- `/trees/123/edit`: 200

### 5.3 남아 있는 검증 이슈

전체 `npm run lint`는 아직 실패한다.

이번 작업 파일 때문이 아니라 기존 코드의 lint 오류가 남아 있다.

대표 기존 오류:

- `src/api/region.js`: `apiClient` import 누락
- `src/components/MapBox.jsx`: render 중 ref 접근
- `src/components/UI/MapControls.jsx`: 대량 미사용 import/state
- `src/components/TreeData/TreeList.jsx`, `MobTreeList.jsx`: 미사용 변수
- `src/components/UI/TreeLikeButton.jsx`: effect 내부 setState lint
- `src/features/ui/getSelectedTree.js`: hook 규칙 위반

## 6. 현재 한계

- 모바일 `/my-trees`, `/profile`은 임시 기본 화면이다.
- 나무 등록/수정 화면은 route 연결만 완료했고, form submit/API 연동/validation은 처리하지 않았다.
- 방/봉사자 route는 아직 연결하지 않았다.
- `RoomList`, `Volunteer`, `MakeRoom/*`는 현재 비어 있어 바로 route에 연결할 수 없다.
- 지도 상세 데이터 흐름은 이번 작업 범위가 아니므로 기존 mock 기반 흐름이 유지된다.

## 7. 다음 작업 제안

다음 순서로 진행하는 것이 좋다.

1. 전체 lint 기존 오류 중 라우팅에 영향을 줄 수 있는 `region.js`, `MapBox.jsx`부터 정리
2. 모바일 `/my-trees`, `/profile` 실제 UI 구현
3. `/trees/new`, `/trees/:treeId/edit` form state와 API 연결
4. 방/봉사자 플로우 요구사항 확정
5. `/rooms`, `/rooms/:roomId/trees`, `/volunteer/rooms/:roomId` route 연결
6. route 단위 lazy loading 검토
