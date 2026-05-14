# U-TreeMap Front-End Routing Map

작성일: 2026-05-06  
브랜치: `feature/codex/router`  
대상 파일: `U-TreeMap-FrontEnd/src/routes/AppRouter.jsx`, `U-TreeMap-FrontEnd/src/layouts/MapShell.jsx`

## 1. 라우팅 정책

현재 라우팅은 `react-router-dom`의 `BrowserRouter`, `Routes`, `Route`, `Navigate` 기반으로 구성한다.

- `/` 접근 시 `/map`으로 redirect
- 알 수 없는 주소는 `/map`으로 redirect
- 사이드바에서 직접 접근 가능한 주소는 `/map`, `/my-trees`, `/profile`
- 추가 작업 화면들은 별도 버튼/메뉴 없이 도메인 주소로 직접 접근하는 방식으로만 라우팅
- 모바일/PC 분기는 주소가 아니라 route wrapper 내부의 viewport 판단으로 처리
- 지도 계열 화면의 사이드바 view는 `MapShell`에서 현재 URL pathname 기준으로 계산

## 2. 주요 앱 라우트

| 주소 | 렌더링 화면 | 설명 |
|---|---|---|
| `/` | `/map`으로 redirect | 기본 진입점 |
| `/map` | `MapShell view="map"` | 지도 홈, 데스크톱 사이드바 홈, 모바일 지도/바텀시트 |
| `/my-trees` | `MapShell view="my-trees"` | 내 나무 화면 |
| `/my-tree` | `/my-trees`로 redirect | 내 나무 화면 alias |
| `/profile` | `MapShell view="profile"` | 프로필 화면 |
| `*` | `/map`으로 redirect | 정의되지 않은 주소 fallback |

## 3. 나무 등록/수정 라우트

| 주소 | route wrapper | 모바일 화면 | PC 화면 | 설명 |
|---|---|---|---|---|
| `/trees/new` | `TreeRequestRoute mode="add"` | `MobTreeAddRequestPage` | `TreeAddRequestPage` | 나무 데이터 등록 요청 |
| `/trees/:treeId/edit` | `TreeRequestRoute mode="edit"` | `MobTreeEditRequestPage` | `TreeEditRequestPage` | 특정 나무 수정 요청 |
| `/tree-add-request` | redirect | `/trees/new` | `/trees/new` | 나무 등록 요청 alias |
| `/tree-edit-request` | `TreeRequestRoute mode="edit"` | `MobTreeEditRequestPage` | `TreeEditRequestPage` | 나무 수정 요청 직접 접근용 alias |

`/trees/new`, `/trees/:treeId/edit`, `/tree-edit-request`는 `TreeRequestRoute` 내부에서 viewport 기준으로 모바일/PC 화면을 분기한다.

## 4. 직접 접근용 작업 화면 라우트

아래 주소들은 현재 메뉴나 버튼에서 접근하지 않고, 브라우저 주소창에 직접 입력해서 확인하는 용도다.

| 주소 | route wrapper | 모바일 화면 | PC 화면 | 설명 |
|---|---|---|---|---|
| `/rooms` | `RoomListRoute` | `MobRoomList` | `RoomList` | 방 목록 |
| `/room-list` | redirect | `/rooms` | `/rooms` | 방 목록 alias |
| `/teams` | `TeamListRoute` | `TeemList` | `TeemList` | 팀 목록. 파일명이 `TeemList`로 되어 있어 현재는 그대로 사용 |
| `/teem-list` | redirect | `/teams` | `/teams` | 팀 목록 alias |
| `/rooms/:roomId/trees` | `TreeListRoute` | `MobTreeList` | `TreeList` | 방 내 나무 목록 |
| `/tree-list` | `TreeListRoute` | `MobTreeList` | `TreeList` | 나무 목록 직접 접근용 alias |
| `/tree-name-search` | `TreeNameSearchRoute` | `TreeNameSearchModal` | `TreeNameSearchModal` | 나무 이름 검색 모달 직접 접근 |
| `/volunteer` | `VolunteerRoute` | `MobVolunteer` | `Volunteer` | 자원봉사자 페이지 |

## 5. 현재 placeholder 처리된 화면

다음 파일은 기존에 0 line이었기 때문에 라우팅 시 빌드가 깨지지 않도록 최소 placeholder 컴포넌트를 추가했다.

- `U-TreeMap-FrontEnd/src/components/TreeData/Volunteer.jsx`
- `U-TreeMap-FrontEnd/src/components/TreeData/RoomList.jsx`
- `U-TreeMap-FrontEnd/src/components/TreeData/TeemList.jsx`

placeholder는 실제 기능 구현이 아니라 라우팅 연결 확인용이다. 추후 실제 UI와 데이터 연동이 필요하다.

## 6. 확인할 주소 목록

개발 서버 실행 후 아래 주소를 직접 입력해서 확인한다.

```text
http://localhost:5173/map
http://localhost:5173/my-trees
http://localhost:5173/my-tree
http://localhost:5173/profile
http://localhost:5173/trees/new
http://localhost:5173/trees/123/edit
http://localhost:5173/tree-add-request
http://localhost:5173/tree-edit-request
http://localhost:5173/rooms
http://localhost:5173/volunteer
http://localhost:5173/room-list
http://localhost:5173/teams
http://localhost:5173/teem-list~
http://localhost:5173/rooms/1/trees
http://localhost:5173/tree-list
http://localhost:5173/tree-name-search
```

## 7. 후속 정리 필요 사항

- `TeemList`는 오타 가능성이 있으므로 `TeamList`로 파일명/컴포넌트명을 정리할지 결정 필요
- `/tree-add-request`, `/tree-edit-request`, `/room-list`, `/teem-list`, `/tree-list`는 직접 접근 alias이므로, 실제 서비스 URL은 표준 URL을 기준으로 유지하는 편이 좋음
- `Volunteer`, `RoomList`, `TeemList`는 실제 UI 구현 필요
- `TreeNameSearchModal`은 원래 모달 컴포넌트이므로 장기적으로는 독립 페이지보다 등록/수정 폼 내부 모달로 사용하는 것이 자연스러움
