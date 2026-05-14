# U-TreeMap Routing 개발 기획서

작성일: 2026-05-05  
문서 구분: 개발 기획서  
기반 문서: `u-treemap-routing-review-2026-05-05.md`  
대상 범위: `U-TreeMap-FrontEnd/src` 라우팅, 사이드바, 모바일 화면 연결

## 1. 개발 목적

현재 U-TreeMap Front-End는 `react-router-dom`과 `BrowserRouter`가 적용되어 있으나 실제 활성 라우트는 `/` 하나뿐이다. 사이드바와 모바일 화면 전환도 URL이 아니라 컴포넌트 내부 state 또는 미연결 버튼 상태에 머물러 있다.

본 개발의 목적은 다음과 같다.

- 사이드바 탭을 URL 기반 내비게이션으로 전환한다.
- 모바일 전용 화면에도 라우터 기반 진입 경로를 제공한다.
- 이미 구현된 나무 등록/수정, 나무 목록, 방 목록, 봉사자 화면을 실제 앱 플로우에 편입할 수 있는 라우트 구조를 만든다.
- 새로고침, 뒤로가기, 직접 URL 접근, 링크 공유가 가능한 구조로 개선한다.
- 향후 인증, 권한, 방 생성, 봉사자 플로우 확장을 받을 수 있는 라우팅 기반을 만든다.

## 2. 현재 문제 정의

### 2.1 라우트가 사실상 `/` 하나뿐임

`src/main.jsx`에는 다음 라우트만 활성화되어 있다.

```jsx
<Route path="/" element={<App />} />
```

다른 페이지 컴포넌트들은 존재하지만 URL로 접근할 수 없다.

### 2.2 사이드바 탭이 라우터와 분리됨

`SideBar.jsx`는 `activeTab` state로 탭을 전환한다.

- `HOME`
- `MY_TREE`
- `PROFILE`

이 방식은 화면 전환은 가능하지만 URL이 바뀌지 않는다. 따라서 새로고침, 뒤로가기, 딥링크, 공유 URL을 지원하지 못한다.

### 2.3 모바일 화면들이 실제 플로우에 미연결

다음 모바일 화면들은 구현되어 있으나 라우트에 연결되어 있지 않다.

- `MobTreeAddRequestPage`
- `MobTreeEditRequestPage`
- `MobTreeList`
- `MobRoomList`
- `MobVolunteer`

또한 모바일 화면의 뒤로가기 버튼은 UI만 있고 실제 `navigate(-1)` 동작이 없다.

### 2.4 빈 파일과 미사용 import가 섞여 있음

다음 파일들은 0 line 상태다.

- `RoomList.jsx`
- `TeemList.jsx`
- `Volunteer.jsx`
- `MakeRoom/AddCoor.jsx`
- `MakeRoom/AddRoomName.jsx`
- `MakeRoom/AddTems.jsx`
- `MakeRoom/QRPage.jsx`
- `MakeRoom/TypoWarningModal.jsx`

`App.jsx`에는 여러 페이지 컴포넌트가 import되어 있지만 실제 렌더링되지 않아 lint 실패와 구조 혼란을 유발한다.

## 3. 개발 목표

### 3.1 1차 목표

- `/map`, `/my-trees`, `/profile` 라우트 추가
- `/` 접근 시 `/map`으로 redirect
- 사이드바 `NavigationRail`을 URL 기반으로 변경
- 사이드바 `activeTab` state 제거 또는 URL 기반 파생 값으로 대체
- 모바일/데스크톱 모두 동일 URL에서 화면을 볼 수 있게 구성

### 3.2 2차 목표

- `/trees/new` 나무 등록 요청 화면 연결
- `/trees/:treeId/edit` 나무 수정 요청 화면 연결
- 모바일 뒤로가기 버튼에 `useNavigate()` 연결
- 미사용 import 제거
- 최소 `npm run build` 유지, 가능하면 관련 lint 오류 감소

### 3.3 3차 목표

- `/rooms`, `/rooms/:roomId/trees`, `/volunteer/rooms/:roomId` 플로우 연결
- 방 생성 플로우 `/rooms/new` 설계
- 비어 있는 데스크톱 컴포넌트 구현 또는 라우트 대상에서 제외
- 라우트 단위 lazy loading 검토

## 4. 비개발 범위

이번 라우팅 개선의 1차 범위에는 다음을 포함하지 않는다.

- 로그인/회원가입 기능 완성
- 백엔드 API 계약 변경
- 나무 등록/수정 form validation 완성
- 방 생성 세부 단계 UI 완성
- 지도 마커/상세 데이터 흐름 개선
- 디자인 전체 리팩터링

단, 라우트 연결 과정에서 미사용 import 제거, 공통 뒤로가기 동작 추가처럼 직접 관련된 정리는 포함할 수 있다.

## 5. 목표 라우트 맵

### 5.1 1차 적용 라우트

| URL | 목적 | 데스크톱 | 모바일 |
|---|---|---|---|
| `/` | 진입점 | `/map` redirect | `/map` redirect |
| `/map` | 지도 홈/나무 상세 | `MapBox + MainPage + HomeContent` | `MapBox + MobilePage + MobileBottomSheet` |
| `/my-trees` | 내 나무 목록 | `MapBox + MainPage + MyTreeContent` | 모바일 내 나무 목록 화면 |
| `/profile` | 프로필 | `MapBox + MainPage + ProfileContent` | 모바일 프로필 화면 |

### 5.2 2차 적용 라우트

| URL | 목적 | 데스크톱 | 모바일 |
|---|---|---|---|
| `/trees/new` | 나무 등록 요청 | `TreeAddRequestPage` | `MobTreeAddRequestPage` |
| `/trees/:treeId/edit` | 나무 수정 요청 | `TreeEditRequestPage` | `MobTreeEditRequestPage` |
| `/trees/:treeId` | 나무 상세 | 지도 사이드바 상세 | 지도 바텀시트 상세 |

### 5.3 3차 적용 라우트

| URL | 목적 | 데스크톱 | 모바일 |
|---|---|---|---|
| `/rooms` | 방 목록 | `RoomList` 또는 신규 구현 | `MobRoomList` |
| `/rooms/new` | 방 생성 | `MakeRoom` 플로우 | `MakeRoom` 플로우 |
| `/rooms/:roomId/trees` | 방 내 나무 목록 | `TreeList` | `MobTreeList` |
| `/volunteer/rooms/:roomId` | 봉사자 방 상세 | `Volunteer` 또는 신규 구현 | `MobVolunteer` |

## 6. 권장 구조

### 6.1 라우터 파일 분리

`main.jsx`에서 라우트 선언을 제거하고 `src/routes/AppRouter.jsx`로 분리한다.

권장 구조:

```text
src/
  routes/
    AppRouter.jsx
  layouts/
    MapLayout.jsx
  pages/
    MapPage.jsx
    MyTreesPage.jsx
    ProfilePage.jsx
```

### 6.2 역할 분리

| 모듈 | 역할 |
|---|---|
| `main.jsx` | React root 렌더링만 담당 |
| `routes/AppRouter.jsx` | 전체 route map 관리 |
| `layouts/MapLayout.jsx` | `MapBox`와 데스크톱/모바일 overlay 공통 처리 |
| `pages/MapPage.jsx` | 지도 홈 컨텐츠 선택 |
| `pages/MyTreesPage.jsx` | 내 나무 화면 라우트 |
| `pages/ProfilePage.jsx` | 프로필 화면 라우트 |
| `components/SideBar.jsx` | 사이드바 열림/닫힘과 레이아웃만 담당 |
| `NavigationRail.jsx` | `NavLink` 기반 탭 내비게이션 담당 |

### 6.3 반응형 라우트 처리

동일 URL에서 모바일/데스크톱 컴포넌트를 분기한다.

예:

```jsx
function ResponsiveRoute({ desktop: Desktop, mobile: Mobile, ...props }) {
  const isMobile = useIsMobile();
  const Component = isMobile ? Mobile : Desktop;
  return <Component {...props} />;
}
```

이 방식은 `/trees/new` 같은 URL을 모바일/데스크톱으로 따로 나누지 않아도 되므로 유지보수에 유리하다.

## 7. 상세 개발 항목

### 7.1 AppRouter 생성

작업 내용:

- `src/routes/AppRouter.jsx` 생성
- `BrowserRouter`, `Routes`, `Route`, `Navigate`를 이 파일로 이동
- `/`는 `/map`으로 redirect
- `/map`, `/my-trees`, `/profile` 등록

완료 기준:

- `/` 접속 시 `/map`으로 이동한다.
- `/map`, `/my-trees`, `/profile` 직접 URL 접근이 가능하다.
- 새로고침해도 해당 화면이 유지된다.

### 7.2 main.jsx 단순화

작업 내용:

- `main.jsx`에서 `BrowserRouter`, `Routes`, `Route` 제거
- `AppRouter`만 import해서 렌더링

완료 기준:

- `main.jsx`가 root 렌더링 책임만 가진다.
- 앱 실행과 빌드가 기존처럼 동작한다.

### 7.3 사이드바 URL 기반 전환

작업 내용:

- `NavigationRail.jsx`의 `button`을 `NavLink`로 교체
- `/map`, `/my-trees`, `/profile`로 이동하도록 변경
- active icon은 `NavLink`의 `isActive` 값으로 결정
- `SideBar.jsx`의 `activeTab` state 제거

완료 기준:

- 사이드바 홈 아이콘 클릭 시 `/map`
- 나무 아이콘 클릭 시 `/my-trees`
- 프로필 아이콘 클릭 시 `/profile`
- URL을 직접 입력해도 active icon이 맞게 표시된다.
- 브라우저 뒤로가기/앞으로가기로 탭 이동이 복원된다.

### 7.4 지도 레이아웃 정리

작업 내용:

- 기존 `App.jsx`의 `MapBox + MainPage/MobilePage` 구조를 유지하되 route별 content를 받을 수 있게 정리
- 1차에서는 큰 리팩터링보다 라우트 연결 우선
- 필요 시 `MapLayout.jsx`로 분리

완료 기준:

- `/map`은 기존 지도 홈과 동일하게 보인다.
- `/my-trees`, `/profile`도 지도 배경 위에 해당 사이드바 컨텐츠가 표시된다.
- 모바일에서는 같은 URL에서 모바일용 화면이 표시된다.

### 7.5 나무 등록/수정 라우트 연결

작업 내용:

- `/trees/new` 라우트 추가
- `/trees/:treeId/edit` 라우트 추가
- `useIsMobile()` 기준으로 데스크톱/모바일 컴포넌트 분기
- 각 페이지의 뒤로가기 버튼에 `navigate(-1)` 연결

완료 기준:

- `/trees/new` 직접 접근 가능
- `/trees/123/edit` 직접 접근 가능
- 모바일/데스크톱 viewport에서 각 대응 컴포넌트 표시
- 뒤로가기 버튼 클릭 시 이전 페이지로 이동

### 7.6 미사용 import와 빈 파일 처리

작업 내용:

- `App.jsx`의 미사용 페이지 import 제거
- 빈 파일은 당장 라우트 대상에서 제외
- `TeemList`는 `TeamList`로 이름 변경 여부 검토

완료 기준:

- 라우팅과 무관한 import가 `App.jsx`에 남지 않는다.
- 아직 구현되지 않은 파일을 route map에 연결하지 않는다.
- 미구현 플로우는 별도 TODO 또는 이슈로 관리한다.

## 8. 개발 순서

### Phase 1: 핵심 내비게이션 복구

1. `src/routes/AppRouter.jsx` 생성
2. `main.jsx` 단순화
3. `/`, `/map`, `/my-trees`, `/profile` 라우트 등록
4. `NavigationRail`을 `NavLink` 기반으로 변경
5. `SideBar`에서 `activeTab` 의존성 제거
6. 직접 URL 접근, 새로고침, 뒤로가기 검증

### Phase 2: 모바일/폼 페이지 연결

1. 공통 뒤로가기 동작 추가
2. `/trees/new` 라우트 연결
3. `/trees/:treeId/edit` 라우트 연결
4. 데스크톱/모바일 responsive route 분기
5. `App.jsx` 미사용 import 제거

### Phase 3: 방/봉사자 플로우 확장

1. `/rooms` 라우트 연결
2. `/rooms/:roomId/trees` 라우트 연결
3. `/volunteer/rooms/:roomId` 라우트 연결
4. 비어 있는 데스크톱 대응 컴포넌트 구현 여부 결정
5. 방 생성 플로우 route 설계 확정

## 9. 우선순위

| 우선순위 | 개발 항목 | 사유 |
|---|---|---|
| P0 | `/map`, `/my-trees`, `/profile` 연결 | 사이드바 라우팅 문제의 핵심 |
| P0 | `NavigationRail` URL 기반 변경 | active state와 URL 동기화 |
| P0 | `/` redirect 정책 확정 | 앱 진입점 안정화 |
| P1 | 모바일 뒤로가기 연결 | 현재 버튼이 동작하지 않음 |
| P1 | `/trees/new`, `/trees/:treeId/edit` 연결 | 구현된 페이지를 실제 플로우에 편입 |
| P1 | 미사용 import 제거 | lint 실패와 구조 혼란 감소 |
| P2 | 방/봉사자 플로우 연결 | 확장 기능 진입 경로 마련 |
| P2 | 라우트 lazy loading | 초기 번들 크기 개선 |

## 10. 검증 계획

### 10.1 수동 검증

- `/` 접속 시 `/map`으로 이동하는지 확인
- `/map` 새로고침 시 지도 홈 유지
- `/my-trees` 직접 접근 시 내 나무 화면 표시
- `/profile` 직접 접근 시 프로필 화면 표시
- 사이드바 아이콘 클릭 시 URL 변경 확인
- 브라우저 뒤로가기/앞으로가기로 탭 이동 복원 확인
- 모바일 viewport에서 `/map`, `/trees/new`, `/trees/:treeId/edit` 확인
- 모바일 뒤로가기 버튼 동작 확인

### 10.2 명령 검증

```bash
cd U-TreeMap-FrontEnd
npm run build
npm run lint
```

현재 lint는 기존 오류가 많으므로 1차 목표는 다음으로 둔다.

- 라우팅 작업으로 새 lint 오류를 만들지 않는다.
- 라우팅 관련 미사용 import는 제거한다.
- 가능하면 `App.jsx`, `main.jsx`, `NavigationRail.jsx`, `SideBar.jsx`의 라우팅 관련 lint 오류를 해소한다.

## 11. 예상 변경 파일

### 신규 파일

- `src/routes/AppRouter.jsx`
- 선택: `src/layouts/MapLayout.jsx`
- 선택: `src/routes/ResponsiveRoute.jsx`

### 주요 수정 파일

- `src/main.jsx`
- `src/App.jsx`
- `src/components/SideBar.jsx`
- `src/components/UI/Sidebar/SidebarContents/NavigationRail.jsx`
- `src/pages/MainPage.jsx`
- `src/pages/MobilePage.jsx`
- `src/components/TreeData/TreeAddRequestPage.jsx`
- `src/components/TreeData/MobTreeAddRequestPage.jsx`
- `src/components/TreeData/TreeEditRequestPage.jsx`
- `src/components/TreeData/MobTreeEditRequestPage.jsx`

### 후속 검토 파일

- `src/components/TreeData/RoomList.jsx`
- `src/components/TreeData/TeemList.jsx`
- `src/components/TreeData/Volunteer.jsx`
- `src/components/TreeData/MakeRoom/*`

## 12. 수용 기준

개발 완료 판단 기준:

- `/map`, `/my-trees`, `/profile`이 URL로 직접 접근 가능하다.
- 사이드바 탭 클릭 시 URL과 active UI가 함께 바뀐다.
- 새로고침 후에도 현재 탭 화면이 유지된다.
- 브라우저 뒤로가기/앞으로가기가 탭 이동에 반영된다.
- `/trees/new`, `/trees/:treeId/edit` 라우트가 모바일/데스크톱 대응 화면을 렌더링한다.
- 모바일 뒤로가기 버튼이 실제 이전 페이지 이동을 수행한다.
- 라우팅 미연결 import가 `App.jsx`에 남아 있지 않다.
- `npm run build`가 성공한다.

## 13. 개발 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 기존 사이드바 state 제거 중 UI 회귀 | 탭 active 표시 깨짐 | `NavLink isActive` 기반으로 아이콘 상태 재구현 |
| 모바일/데스크톱 컴포넌트 중복 | form 로직 중복 | 1차는 연결 우선, 2차에서 form hook 분리 |
| 빈 데스크톱 페이지 파일 | route 연결 불가 | 미구현 파일은 route 대상에서 제외 |
| 기존 lint 오류와 신규 오류 혼재 | 작업 검증 어려움 | 변경 파일 중심으로 오류를 줄이고 전체 lint 상태는 별도 이슈화 |
| 지도 화면과 전체 화면 route 충돌 | 등록 페이지 위에 지도 잔존 가능 | 지도 overlay route와 full-screen route를 라우트 레벨에서 분리 |

## 14. 최종 방향

라우팅 개선은 단순 링크 추가가 아니라 앱의 화면 상태 기준을 URL로 옮기는 작업이다. 1차로 사이드바의 `HOME/MY_TREE/PROFILE`을 URL 기반으로 바꾸면 사용자 경험과 개발 구조가 동시에 안정된다. 이후 나무 등록/수정, 방 목록, 봉사자 플로우를 순차적으로 붙이면 현재 고립된 페이지 컴포넌트들을 실제 기능 흐름으로 편입할 수 있다.

권장 개발 순서는 사이드바 라우팅을 먼저 고정하고, 그 다음 모바일 뒤로가기와 나무 등록/수정 라우트를 연결하는 것이다. 방/봉사자 플로우는 비어 있는 컴포넌트가 많으므로 라우트 설계만 먼저 확정하고 구현은 별도 단계로 분리하는 편이 안전하다.

## 15. 세부 작업 Phase

이 섹션은 실제 개발 순서를 기준으로 작성한다. 앞 단계의 결과물이 뒤 단계의 의존성이 되므로, Phase 순서를 지키는 것이 좋다. 각 Phase는 가능한 한 빌드 가능한 상태로 끝내야 한다.

### Phase 0: 사전 정리와 기준선 확인

목표:

- 현재 라우팅 상태와 빌드 가능 상태를 기준선으로 잡는다.
- 기존 사용자 변경 파일을 건드리지 않도록 작업 범위를 확인한다.

수정 방향:

- 코드 변경 전 `git status --short`로 기존 변경 파일을 확인한다.
- `src/main.jsx`, `src/App.jsx`, `src/components/SideBar.jsx`, `NavigationRail.jsx`를 먼저 읽고 현재 흐름을 재확인한다.
- 라우팅 작업과 직접 관련 없는 지도, API, 스타일 리팩터링은 하지 않는다.

작업 순서:

1. 현재 변경 상태 확인
2. 현재 라우트 검색
3. 사이드바 state 흐름 확인
4. 모바일 페이지 진입 흐름 확인
5. `npm run build` 실행 가능 여부 확인

테스트 포인트:

- `npm run build`가 현재 기준선에서 성공하는지 확인
- `npm run lint`는 기존 오류가 많으므로 전체 성공을 목표로 삼지 않고, 라우팅 변경 파일의 신규 오류 여부를 따로 본다.

의존성:

- 없음

완료 기준:

- 변경 전 상태가 문서화되어 있고, 라우팅 작업 범위가 명확하다.

### Phase 1: Router 엔트리 분리

목표:

- `main.jsx`에서 라우트 선언을 분리해 라우팅 확장 기반을 만든다.

수정 방향:

- `src/routes/AppRouter.jsx`를 새로 만든다.
- `BrowserRouter`, `Routes`, `Route`, `Navigate`는 `AppRouter.jsx`에서 관리한다.
- `main.jsx`는 `AppRouter` 렌더링만 담당하도록 단순화한다.

코드 작성 순서:

1. `src/routes/` 디렉터리 생성
2. `src/routes/AppRouter.jsx` 생성
3. 기존 `/` 라우트를 `AppRouter.jsx`로 이동
4. `/`는 `/map`으로 redirect하도록 `Navigate` 추가
5. `/map`은 기존 `App`을 렌더하도록 연결
6. `main.jsx`에서 `BrowserRouter`, `Routes`, `Route` import 제거
7. `main.jsx`에서 `AppRouter` import 후 렌더링

예상 변경 파일:

- `src/routes/AppRouter.jsx`
- `src/main.jsx`

테스트 포인트:

- `/` 접속 시 `/map`으로 이동
- `/map` 직접 접근 시 기존 지도 화면 렌더
- 새로고침 시 화면 유지
- `npm run build` 성공

의존성:

- Phase 0 완료

완료 기준:

- 라우트 선언이 `AppRouter.jsx`로 이동한다.
- 기존 홈 화면 기능이 `/map`에서 유지된다.

### Phase 2: 지도 Shell과 사이드바 컨텐츠 분리

목표:

- `/map`, `/my-trees`, `/profile`이 같은 지도 Shell을 공유하되 사이드바 컨텐츠만 달라지도록 만든다.

수정 방향:

- 지금의 `App.jsx`는 `MapBox`와 모바일/데스크톱 overlay를 함께 가지고 있다.
- 대규모 리팩터링 없이 먼저 route prop 또는 route key를 받아 화면을 분기하는 방식으로 접근한다.
- 이후 필요하면 `MapLayout.jsx`로 분리한다.

권장 구현안:

- 1차 구현에서는 `App`에 `view` prop을 추가한다.
- `AppRouter.jsx`에서 `/map`, `/my-trees`, `/profile` 각각 `<App view="map" />`, `<App view="my-trees" />`, `<App view="profile" />`처럼 연결한다.
- `MainPage`와 `SideBar`에도 `view`를 내려보낸다.
- `SideBar`는 `view` 값에 따라 `HomeContent`, `MyTreeContent`, `ProfileContent`를 렌더링한다.

코드 작성 순서:

1. `App.jsx`에 `view = 'map'` prop 추가
2. `MainPage.jsx`에 `view` prop 전달
3. `SideBar.jsx`에 `view` prop 추가
4. `SideBar.jsx`의 `activeTab` state 제거 또는 임시 호환 처리
5. `view` 값 기준으로 컨텐츠 렌더링
6. `AppRouter.jsx`에 `/my-trees`, `/profile` route 추가

예상 변경 파일:

- `src/routes/AppRouter.jsx`
- `src/App.jsx`
- `src/pages/MainPage.jsx`
- `src/components/SideBar.jsx`

테스트 포인트:

- `/map`에서 홈 상세 패널 표시
- `/my-trees`에서 내 나무 패널 표시
- `/profile`에서 프로필 패널 표시
- 각 URL 새로고침 시 같은 패널 유지
- 데스크톱 지도 배경이 유지되는지 확인

의존성:

- Phase 1 완료

주의점:

- `SideBar`의 열림/닫힘 state는 라우팅과 무관하므로 유지한다.
- `TABS` export는 `NavigationRail`이 의존 중이므로 Phase 3 전까지 바로 제거하지 않는다.

완료 기준:

- 사이드바 컨텐츠 선택 기준이 URL route에서 내려온 `view`로 바뀐다.

### Phase 3: NavigationRail을 URL 기반으로 전환

목표:

- 사이드바 아이콘 클릭 시 URL이 변경되고 active icon도 URL 기준으로 표시되게 한다.

수정 방향:

- `NavigationRail.jsx`의 `button`을 `NavLink`로 교체한다.
- `activeTab`, `onTabChange`, `TABS` 의존성을 제거한다.
- active 여부는 `NavLink`의 `isActive` 값으로 계산한다.

코드 작성 순서:

1. `NavigationRail.jsx`에서 `NavLink` import
2. `TABS` import 제거
3. `getIcon(isActive, defaultIcon, filledIcon)` 형태로 변경
4. 홈 링크를 `/map`으로 연결
5. 내 나무 링크를 `/my-trees`로 연결
6. 프로필 링크를 `/profile`로 연결
7. `SideBar.jsx`에서 `NavigationRail`에 넘기던 `activeTab`, `onTabChange` prop 제거
8. `SideBar.jsx`의 `TABS` export 제거 가능 여부 확인

예상 변경 파일:

- `src/components/UI/Sidebar/SidebarContents/NavigationRail.jsx`
- `src/components/SideBar.jsx`

테스트 포인트:

- 홈 아이콘 클릭 시 URL `/map`
- 나무 아이콘 클릭 시 URL `/my-trees`
- 프로필 아이콘 클릭 시 URL `/profile`
- active icon이 현재 URL과 일치
- 브라우저 뒤로가기/앞으로가기로 active icon 변경
- 사이드바가 닫힌 상태에서 아이콘 클릭 시 동작 정책 확인

의존성:

- Phase 2 완료

주의점:

- 기존 `handleTabChange`는 닫힌 사이드바를 다시 여는 역할도 했다.
- `NavLink` 전환 후에도 아이콘 클릭 시 사이드바를 열어야 한다면 `NavigationRail`에 `onNavigate` prop만 남기고 `SideBar`에서 `setIsOpen(true)`를 넘긴다.
- 이 경우에도 어떤 컨텐츠를 보여줄지는 URL이 결정해야 한다.

완료 기준:

- 사이드바 탭 전환이 로컬 state가 아니라 URL로 동작한다.

### Phase 4: 모바일 기본 라우트 대응

목표:

- `/map`, `/my-trees`, `/profile`에서 모바일도 최소한 깨지지 않는 화면을 제공한다.

수정 방향:

- `App.jsx`의 모바일 분기에도 `view`를 전달한다.
- `MobilePage`는 `/map`에서 기존 지도 상단 UI와 바텀시트를 유지한다.
- `/my-trees`, `/profile`의 모바일 대응 화면이 아직 없다면 임시 placeholder 또는 기존 컴포넌트 재사용 여부를 결정한다.

권장 구현안:

- `/map`: 기존 `MobilePage`
- `/my-trees`: `MobTreeList`를 바로 쓰기보다 "내 나무" 목적에 맞는 모바일 페이지가 없으면 최소 placeholder를 둔다.
- `/profile`: 모바일 프로필 placeholder 또는 `ProfileContent`를 모바일 wrapper 안에서 렌더링한다.

코드 작성 순서:

1. `MobilePage.jsx`에 `view` prop 추가
2. `App.jsx`에서 모바일 분기 시 `view` 전달
3. `view === 'map'`일 때 기존 UI 렌더링
4. `view === 'my-trees'` 대응 화면 임시 연결
5. `view === 'profile'` 대응 화면 임시 연결
6. 필터 버튼의 `alert`는 이번 Phase에서 유지하거나 별도 TODO로 남긴다.

예상 변경 파일:

- `src/App.jsx`
- `src/pages/MobilePage.jsx`
- 필요 시 신규 모바일 placeholder 컴포넌트

테스트 포인트:

- 모바일 viewport에서 `/map` 렌더
- 모바일 viewport에서 `/my-trees` 직접 접근 시 빈 화면이 아닌 의미 있는 화면 표시
- 모바일 viewport에서 `/profile` 직접 접근 시 빈 화면이 아닌 의미 있는 화면 표시
- 새로고침 시 모바일 화면 유지

의존성:

- Phase 2 완료
- Phase 3은 권장되지만 필수는 아님

주의점:

- `MobTreeList`는 방 안의 측정 나무 목록에 가까운 UI라 `/my-trees`와 의미가 다를 수 있다.
- 의미가 맞지 않으면 재사용보다 임시 페이지를 두고 후속 구현으로 넘긴다.

완료 기준:

- 핵심 3개 라우트가 데스크톱/모바일 모두에서 접근 가능하다.

### Phase 5: 나무 등록/수정 라우트 연결

목표:

- 구현되어 있는 나무 등록/수정 페이지를 URL로 접근 가능하게 한다.

수정 방향:

- `/trees/new`와 `/trees/:treeId/edit`를 `AppRouter.jsx`에 추가한다.
- 동일 URL에서 `useIsMobile()`로 데스크톱/모바일 컴포넌트를 분기한다.
- 등록/수정 페이지는 지도 Shell 위 overlay가 아니라 full-screen route로 다룬다.

코드 작성 순서:

1. `src/routes/ResponsiveRoute.jsx` 생성 여부 결정
2. `ResponsiveRoute`를 만든다면 `useIsMobile()` 기반으로 컴포넌트 분기 구현
3. `/trees/new` route 추가
4. 데스크톱: `TreeAddRequestPage`
5. 모바일: `MobTreeAddRequestPage`
6. `/trees/:treeId/edit` route 추가
7. 데스크톱: `TreeEditRequestPage`
8. 모바일: `MobTreeEditRequestPage`
9. 각 페이지의 뒤로가기 버튼에 `useNavigate()` 연결

예상 변경 파일:

- `src/routes/AppRouter.jsx`
- 선택: `src/routes/ResponsiveRoute.jsx`
- `src/components/TreeData/TreeAddRequestPage.jsx`
- `src/components/TreeData/MobTreeAddRequestPage.jsx`
- `src/components/TreeData/TreeEditRequestPage.jsx`
- `src/components/TreeData/MobTreeEditRequestPage.jsx`

테스트 포인트:

- `/trees/new` 직접 접근 가능
- `/trees/123/edit` 직접 접근 가능
- 모바일 viewport에서 모바일 컴포넌트 표시
- 데스크톱 viewport에서 데스크톱 컴포넌트 표시
- 뒤로가기 버튼 클릭 시 이전 페이지로 이동
- 직접 접근 후 뒤로갈 history가 없을 때 정책 확인

의존성:

- Phase 1 완료
- Phase 4에서 responsive route 방식을 결정했다면 그 결정을 따른다.

주의점:

- `TreeAddRequestPage`와 `MobTreeAddRequestPage`는 입력값이 하드코딩되어 있으므로 이번 Phase에서는 라우트 연결까지만 목표로 한다.
- form submit, API 연동, validation은 별도 Phase로 분리한다.

완료 기준:

- 나무 등록/수정 화면이 실제 route로 접근 가능하다.

### Phase 6: 미사용 import와 lint 영향 정리

목표:

- 라우팅 작업으로 생긴 미사용 코드와 기존 미연결 import를 정리한다.

수정 방향:

- `App.jsx`에 남아 있는 미사용 페이지 import를 제거한다.
- `SideBar.jsx`에서 더 이상 쓰지 않는 `TABS`, `activeTab`, `handleTabChange`를 제거한다.
- `NavigationRail.jsx`에서 더 이상 쓰지 않는 props를 제거한다.

코드 작성 순서:

1. `App.jsx` 미사용 import 제거
2. `App.jsx` 미사용 state 확인
3. `SideBar.jsx` 미사용 상수/함수 제거
4. `NavigationRail.jsx` prop signature 정리
5. 변경 파일 중심 lint 확인
6. 전체 `npm run build` 확인

예상 변경 파일:

- `src/App.jsx`
- `src/components/SideBar.jsx`
- `src/components/UI/Sidebar/SidebarContents/NavigationRail.jsx`

테스트 포인트:

- `npm run build` 성공
- 라우팅 관련 변경 파일에서 미사용 import/state가 남지 않음
- `/map`, `/my-trees`, `/profile`, `/trees/new`, `/trees/:treeId/edit` 재검증

의존성:

- Phase 3 완료
- Phase 5 완료

주의점:

- 전체 lint는 기존 코드 오류가 많으므로 전체 통과가 안 될 수 있다.
- 그래도 이번 작업 파일에서 새 오류를 만들지 않는 것을 목표로 한다.

완료 기준:

- 라우팅 작업과 관련된 미사용 코드가 정리된다.

### Phase 7: 방/봉사자 플로우 연결 전 설계 정리

목표:

- 비어 있는 파일과 구현된 모바일 파일의 의미를 확정한 뒤 route 연결 여부를 결정한다.

수정 방향:

- `RoomList`, `Volunteer`, `MakeRoom/*`는 현재 0 line이므로 바로 route에 연결하지 않는다.
- `MobRoomList`, `MobTreeList`, `MobVolunteer`는 구현되어 있으나 더미 데이터 중심이므로 route 연결 전 목적을 확정한다.

작업 순서:

1. 방 플로우 사용자 역할 정의
2. `/rooms`가 관리자/개설자용인지 봉사자용인지 결정
3. `/rooms/:roomId/trees`가 측정 대상 목록인지 수정 요청 목록인지 결정
4. `/volunteer/rooms/:roomId`의 진입 조건 정의
5. 비어 있는 데스크톱 컴포넌트 구현 범위 산정
6. route 연결은 구현 가능한 화면부터 제한적으로 진행

테스트 포인트:

- 아직 route에 연결하지 않은 빈 파일이 직접 import되지 않는지 확인
- 연결하는 모바일 화면의 뒤로가기 동작 확인
- 더미 데이터가 실제 서비스 데이터처럼 오해되지 않도록 표시/주석 정책 확인

의존성:

- Phase 5 완료 후 진행 권장

완료 기준:

- 방/봉사자 route를 구현할 수 있는 요구사항과 컴포넌트 상태가 정리된다.

### Phase 8: 방/봉사자 route 1차 연결

목표:

- 구현된 모바일 중심 화면을 제한적으로 route에 연결한다.

수정 방향:

- 데스크톱 컴포넌트가 비어 있으면 데스크톱 route는 placeholder를 사용하거나 연결하지 않는다.
- 모바일 route는 `MobRoomList`, `MobTreeList`, `MobVolunteer`를 우선 연결할 수 있다.

코드 작성 순서:

1. `/rooms` route 추가 여부 결정
2. 모바일 `/rooms`에 `MobRoomList` 연결
3. `/rooms/:roomId/trees` route 추가
4. 모바일 `/rooms/:roomId/trees`에 `MobTreeList` 연결
5. `/volunteer/rooms/:roomId` route 추가
6. 모바일 `/volunteer/rooms/:roomId`에 `MobVolunteer` 연결
7. 각 페이지 뒤로가기 버튼에 `useNavigate()` 연결

예상 변경 파일:

- `src/routes/AppRouter.jsx`
- `src/components/TreeData/MobRoomList.jsx`
- `src/components/TreeData/MobTreeList.jsx`
- `src/components/TreeData/MobVolunteer.jsx`
- 선택: 데스크톱 placeholder 컴포넌트

테스트 포인트:

- 모바일 viewport에서 `/rooms` 표시
- 모바일 viewport에서 `/rooms/1/trees` 표시
- 모바일 viewport에서 `/volunteer/rooms/1` 표시
- 뒤로가기 버튼 동작
- 데스크톱 접근 시 의도한 placeholder 또는 안내 화면 표시

의존성:

- Phase 7 완료

주의점:

- `MobRoomList`의 헤더 텍스트가 현재 "나무 수정 요청"으로 되어 있어 `/rooms` 의미와 맞는지 확인이 필요하다.
- `MobTreeList`도 "나무 데이터 측정" 목적과 `/my-trees` 목적이 다르므로 라우트 재사용에 주의한다.

완료 기준:

- 방/봉사자 모바일 route가 최소한 직접 접근 가능한 상태가 된다.

### Phase 9: 회귀 검증과 문서 업데이트

목표:

- 라우팅 변경 후 기존 지도 홈 동작과 신규 route 동작을 검증한다.

수정 방향:

- 코드 변경은 최소화하고 검증 결과를 문서 또는 체크리스트에 반영한다.
- 실제 구현과 기획서 route map이 달라졌다면 문서를 수정한다.

검증 순서:

1. `npm run build`
2. 가능하면 `npm run lint`
3. 데스크톱 `/map`
4. 데스크톱 `/my-trees`
5. 데스크톱 `/profile`
6. 모바일 `/map`
7. 모바일 `/my-trees`
8. 모바일 `/profile`
9. `/trees/new`
10. `/trees/:treeId/edit`
11. 브라우저 뒤로가기/앞으로가기
12. 직접 URL 접근 후 새로고침

테스트 포인트:

- URL과 화면이 일치하는지
- active icon이 URL과 일치하는지
- 지도 화면이 의도치 않게 사라지지 않는지
- full-screen form route에서 지도 overlay가 같이 뜨지 않는지
- 모바일 뒤로가기 버튼이 동작하는지
- 미구현 route가 빈 화면을 만들지 않는지

의존성:

- 구현한 모든 Phase 완료

완료 기준:

- 개발자가 기획서 기준으로 라우팅 작업 완료 여부를 판단할 수 있다.
- 남은 미구현 route와 후속 작업이 명확히 구분된다.
