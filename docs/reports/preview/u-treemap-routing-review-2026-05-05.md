# U-TreeMap Front-End Routing 점검 보고서

작성일: 2026-05-05  
분석 대상: `U-TreeMap-FrontEnd/src` 라우팅, 사이드바, 모바일 화면 연결 구조

## 1. 결론

현재 프로젝트에는 `react-router-dom`이 설치되어 있고 `BrowserRouter`도 적용되어 있지만, 실제 등록된 라우트는 `/` 하나뿐이다. 따라서 여러 페이지성 컴포넌트가 구현되어 있어도 URL로 직접 접근하거나 사이드바/모바일 UI에서 라우터 기반으로 이동할 수 없다.

사이드바는 라우터가 아니라 `activeTab` 로컬 state로 `HomeContent`, `MyTreeContent`, `ProfileContent`를 조건부 렌더링한다. 모바일 뷰도 `MobilePage`와 `MobileBottomSheet`만 렌더링하고, 나무 등록/수정/방 목록/봉사자 페이지로 이동하는 라우트 연결은 없다.

즉, 현재 상태는 "라우터가 프로젝트에 들어와 있지만 앱 구조에는 거의 연결되지 않은 상태"로 보는 것이 맞다.

## 2. 현재 라우터 구성

`src/main.jsx`:

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    {/* login/signup 관련 라우트는 주석 처리 */}
  </Routes>
</BrowserRouter>
```

확인 결과:

- 활성 라우트: `/`
- 주석 라우트: `/login`, `/signup`, `/signup/complete`
- `Outlet`, `useNavigate`, `Link`, `NavLink`, `useParams`, `useLocation` 사용 없음
- 앱 내부 화면 전환은 대부분 로컬 state와 조건부 렌더링으로 처리

## 3. 사이드바 연결 상태

### 3.1 현재 동작

`src/components/SideBar.jsx`는 다음 탭 state를 가진다.

```jsx
export const TABS = {
  HOME: 'HOME',
  MY_TREE: 'MY_TREE',
  PROFILE: 'PROFILE',
};
```

렌더링은 다음처럼 URL이 아니라 state 기준이다.

```jsx
{activeTab === TABS.HOME && <HomeContent selectedTree={selectedTree} />}
{activeTab === TABS.MY_TREE && <MyTreeContent />}
{activeTab === TABS.PROFILE && <ProfileContent />}
```

`NavigationRail.jsx`도 `Link`/`NavLink`가 아니라 버튼 클릭으로 `onTabChange(TABS.HOME)` 같은 함수를 호출한다.

### 3.2 문제점

- `/my-tree`, `/profile` 같은 URL이 존재하지 않는다.
- 새로고침하면 항상 `/`의 기본 `HOME` 탭으로 돌아간다.
- 브라우저 뒤로가기/앞으로가기로 탭 이동을 복원할 수 없다.
- 특정 탭 화면을 외부에서 공유할 수 없다.
- 사이드바 탭이 라우팅 상태와 분리되어 확장 화면을 붙이기 어렵다.

### 3.3 권장 방향

사이드바 탭은 최소한 URL과 동기화하는 것이 좋다.

권장 라우트 예:

| URL | 데스크톱 사이드바 컨텐츠 | 모바일 대응 |
|---|---|---|
| `/` 또는 `/map` | `HomeContent` | 지도 + 모바일 바텀시트 |
| `/my-trees` | `MyTreeContent` | 모바일 내 나무 목록 |
| `/profile` | `ProfileContent` | 모바일 프로필 |

구현 방식은 두 가지 중 하나를 선택할 수 있다.

1. `NavigationRail`을 `NavLink` 기반으로 변경
2. 기존 버튼 UI를 유지하되 `useNavigate()`로 URL을 변경하고 `useLocation()`으로 active 상태를 계산

탭 UI가 명확히 내비게이션 역할을 하므로 `NavLink` 방식이 더 단순하다.

## 4. 모바일 뷰 연결 상태

### 4.1 현재 동작

`App.jsx`는 모바일 여부에 따라 다음처럼 렌더링한다.

```jsx
{isMobile ? <MobilePage selectedTree={selectedTree} /> : <MainPage selectedTree={selectedTree} />}
```

`MobilePage.jsx`는 상단 로고, 필터 버튼, 검색바, `MobileBottomSheet`만 렌더링한다.

필터 버튼은 현재 라우팅이나 모달 연결 없이 `alert('필터 메뉴 열기')`만 실행한다.

### 4.2 문제점

- 모바일 전용 페이지 컴포넌트가 URL에 연결되어 있지 않다.
- 모바일 헤더의 뒤로가기 버튼들은 `navigate(-1)` 같은 동작이 없다.
- `MobVolunteer`, `MobRoomList`, `MobTreeList`, `MobTreeAddRequestPage`, `MobTreeEditRequestPage`가 실제 앱 플로우에 연결되지 않는다.
- 모바일 화면과 데스크톱 화면이 별도 컴포넌트로 중복 구현되어 있어 라우트 설계 없이 계속 확장하면 유지보수가 어려워진다.

### 4.3 권장 방향

모바일/데스크톱을 완전히 다른 URL로 나누기보다, 같은 URL에서 레이아웃만 반응형으로 바꾸는 편이 낫다.

예:

- `/trees/new`: 데스크톱이면 `TreeAddRequestPage`, 모바일이면 `MobTreeAddRequestPage`
- `/trees/:treeId/edit`: 데스크톱이면 `TreeEditRequestPage`, 모바일이면 `MobTreeEditRequestPage`
- `/rooms`: 데스크톱이면 `RoomList`, 모바일이면 `MobRoomList`
- `/volunteer/rooms/:roomId`: 데스크톱이면 `Volunteer`, 모바일이면 `MobVolunteer`

이를 위해 `ResponsiveRoute` 또는 각 route element 내부에서 `useIsMobile()`로 컴포넌트를 분기할 수 있다.

## 5. 페이지성 컴포넌트 연결 현황

| 컴포넌트 | 파일 | 현재 연결 상태 | 비고 |
|---|---|---|---|
| `App` | `src/App.jsx` | `/`에 연결됨 | 유일한 활성 라우트 |
| `MainPage` | `src/pages/MainPage.jsx` | `App`에서 데스크톱일 때 렌더 | 라우트 직접 연결 없음 |
| `MobilePage` | `src/pages/MobilePage.jsx` | `App`에서 모바일일 때 렌더 | 라우트 직접 연결 없음 |
| `HomeContent` | `components/UI/Sidebar/.../HomeContent.jsx` | 사이드바 state로 렌더 | URL 없음 |
| `MyTreeContent` | `components/UI/Sidebar/.../MyTreeContent.jsx` | 사이드바 state로 렌더 | URL 없음 |
| `ProfileContent` | `components/UI/Sidebar/.../ProfileContent.jsx` | 사이드바 state로 렌더 | URL 없음 |
| `TreeAddRequestPage` | `components/TreeData/TreeAddRequestPage.jsx` | 미연결 | `App.jsx`에 import도 없음 |
| `TreeEditRequestPage` | `components/TreeData/TreeEditRequestPage.jsx` | 미연결 | `App.jsx`에 import만 있고 미사용 |
| `TreeList` | `components/TreeData/TreeList.jsx` | 미연결 | `App.jsx`에 import만 있고 미사용 |
| `MobTreeAddRequestPage` | `components/TreeData/MobTreeAddRequestPage.jsx` | 미연결 | import 없음 |
| `MobTreeEditRequestPage` | `components/TreeData/MobTreeEditRequestPage.jsx` | 미연결 | `App.jsx`에 import만 있고 미사용 |
| `MobTreeList` | `components/TreeData/MobTreeList.jsx` | 미연결 | `App.jsx`에 import만 있고 미사용 |
| `MobRoomList` | `components/TreeData/MobRoomList.jsx` | 미연결 | `App.jsx`에 import만 있고 미사용 |
| `MobVolunteer` | `components/TreeData/MobVolunteer.jsx` | 미연결 | `App.jsx`에 import만 있고 미사용 |
| `TreeNameSearchModal` | `components/TreeData/TreeNameSearchModal.jsx` | 미연결 | `App.jsx`에 import만 있고 미사용 |
| `RoomList` | `components/TreeData/RoomList.jsx` | 미구현 | 0 line |
| `TeemList` | `components/TreeData/TeemList.jsx` | 미구현 | 0 line, 파일명 오타 가능성 |
| `Volunteer` | `components/TreeData/Volunteer.jsx` | 미구현 | 0 line |
| `MakeRoom/*` | `components/TreeData/MakeRoom/*.jsx` | 미구현 | 모든 파일 0 line |

## 6. 주요 라우팅 리스크

### 6.1 URL과 UI 상태 불일치

사이드바 탭이 URL과 무관하게 동작하므로 사용자가 보고 있는 화면을 URL로 표현할 수 없다. 탭 추가, 권한 분기, 딥링크, 새로고침 복원에서 문제가 생긴다.

### 6.2 페이지 컴포넌트의 고립

여러 화면이 구현되어 있지만 라우트나 버튼 플로우에 연결되지 않아 실제 앱에서 도달할 수 없다. 결과적으로 코드가 존재해도 사용자 기능으로 검증되지 않는다.

### 6.3 모바일 뒤로가기 미구현

모바일 페이지들에는 뒤로가기 아이콘 버튼이 있지만 `useNavigate()` 또는 `window.history.back()` 연결이 없다. 현재는 눌러도 화면 전환이 발생하지 않는다.

### 6.4 데스크톱/모바일 중복 화면 확장 위험

`TreeAddRequestPage`와 `MobTreeAddRequestPage`처럼 동일 목적의 컴포넌트가 별도 파일로 존재한다. 라우터가 없는 상태에서 각각의 진입점을 따로 붙이면 URL, API 호출, form state, validation이 중복될 가능성이 높다.

### 6.5 미사용 import로 인한 품질 저하

`App.jsx`에는 라우팅되지 않는 컴포넌트 import가 남아 있다. 현재 `npm run lint` 실패 원인 중 하나이며, 라우트 설계가 정리되지 않았다는 신호다.

## 7. 권장 라우트 설계안

초기 정리는 다음 정도가 적절하다.

```text
/
/map
/my-trees
/profile
/trees/new
/trees/:treeId
/trees/:treeId/edit
/rooms
/rooms/new
/rooms/:roomId
/rooms/:roomId/trees
/volunteer/rooms/:roomId
```

권장 매핑:

| URL | 목적 | 데스크톱 컴포넌트 | 모바일 컴포넌트 |
|---|---|---|---|
| `/map` | 지도 홈/상세 | `MainPage + HomeContent` | `MobilePage + MobileBottomSheet` |
| `/my-trees` | 내 나무 목록 | `MyTreeContent` | 신규 모바일 내 나무 화면 또는 `MobTreeList` 재정의 |
| `/profile` | 프로필 | `ProfileContent` | 신규 모바일 프로필 |
| `/trees/new` | 나무 등록 요청 | `TreeAddRequestPage` | `MobTreeAddRequestPage` |
| `/trees/:treeId` | 나무 상세 | 사이드바 상세 또는 독립 상세 | 바텀시트/상세 화면 |
| `/trees/:treeId/edit` | 나무 수정 요청 | `TreeEditRequestPage` | `MobTreeEditRequestPage` |
| `/rooms` | 방 목록 | `RoomList` | `MobRoomList` |
| `/rooms/new` | 방 생성 | `MakeRoom/*` 플로우 | `MakeRoom/*` 모바일 플로우 |
| `/rooms/:roomId/trees` | 방 내 측정 나무 목록 | `TreeList` | `MobTreeList` |
| `/volunteer/rooms/:roomId` | 자원봉사자 방 상세 | `Volunteer` | `MobVolunteer` |

## 8. 구현 방향 제안

### 8.1 라우트 정의를 `main.jsx`에서 분리

현재 `main.jsx`가 router 선언까지 직접 가지고 있다. 라우트가 늘어날 예정이므로 `src/routes/AppRouter.jsx` 같은 파일로 분리하는 것이 좋다.

예:

```jsx
// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import TreeAddRequestPage from '../components/TreeData/TreeAddRequestPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/map" replace />} />
        <Route path="/map" element={<App />} />
        <Route path="/trees/new" element={<TreeAddRequestPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 8.2 지도 레이아웃과 페이지 라우트를 분리

현재 `App`은 지도와 화면 오버레이를 모두 담당한다. 추천 구조는 다음과 같다.

```text
layouts/
  MapLayout.jsx       # MapBox + Outlet 또는 overlay 영역
routes/
  AppRouter.jsx
pages/
  MapPage.jsx
  MyTreesPage.jsx
  ProfilePage.jsx
  TreeFormPage.jsx
```

지도 위에 떠야 하는 화면과 전체 화면으로 떠야 하는 등록/수정 화면을 라우트 레벨에서 구분해야 한다.

### 8.3 사이드바를 URL 기반으로 변경

`NavigationRail`의 버튼을 `NavLink`로 바꾸면 active 상태를 직접 관리하지 않아도 된다.

예:

```jsx
<NavLink to="/map">...</NavLink>
<NavLink to="/my-trees">...</NavLink>
<NavLink to="/profile">...</NavLink>
```

사이드바 열림/닫힘은 UI state로 유지하되, "어떤 탭을 보여줄지"는 라우터가 담당하는 구조가 낫다.

### 8.4 모바일 뒤로가기 연결

모바일 헤더의 뒤로가기 버튼은 공통 컴포넌트로 만들고 `useNavigate()`를 연결한다.

예:

```jsx
const navigate = useNavigate();

<button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
  <LeftArrow />
</button>
```

### 8.5 모달과 라우트 기준 정리

`TreeNameSearchModal`은 페이지 라우트로 볼지, 나무 등록/수정 폼 내부 모달로 볼지 결정해야 한다. 현재 형태로는 route 대상보다는 `TreeAddRequestPage` 또는 `TreeEditRequestPage` 내부의 부분 UI가 더 적합하다.

## 9. 우선순위

| 우선순위 | 작업 | 이유 |
|---|---|---|
| P0 | `/map`, `/my-trees`, `/profile` 라우트 추가 | 사이드바 탭을 URL과 동기화 |
| P0 | `NavigationRail`을 `NavLink` 또는 `useNavigate` 기반으로 변경 | 뒤로가기/새로고침/공유 URL 지원 |
| P0 | 모바일 뒤로가기 버튼에 `navigate(-1)` 연결 | 현재 버튼이 시각 요소에 가까움 |
| P1 | 나무 등록/수정 라우트 추가 | 구현된 페이지를 실제 플로우에 연결 |
| P1 | 방/봉사자 관련 라우트 설계 확정 | `MobRoomList`, `MobVolunteer`, `MobTreeList` 연결 |
| P1 | 비어 있는 `RoomList`, `Volunteer`, `MakeRoom/*` 처리 | 미구현 파일을 route 대상에서 제외하거나 구현 |
| P2 | 데스크톱/모바일 중복 컴포넌트 통합 전략 수립 | form 로직 중복 방지 |
| P2 | lazy loading 적용 | 라우트별 번들 분리로 초기 로딩 개선 |

## 10. 단기 체크리스트

- [ ] `src/routes/AppRouter.jsx` 생성
- [ ] `main.jsx`는 `AppRouter`만 렌더하도록 단순화
- [ ] `/`를 `/map`으로 redirect하거나 `/`를 지도 홈으로 확정
- [ ] `/map`, `/my-trees`, `/profile` 라우트 추가
- [ ] `NavigationRail`의 `button`을 `NavLink`로 교체
- [ ] 사이드바 `activeTab` state 제거 또는 URL에서 파생
- [ ] 모바일 뒤로가기 버튼 공통화
- [ ] `/trees/new`, `/trees/:treeId/edit` 라우트 추가
- [ ] `App.jsx`의 미사용 페이지 import 제거
- [ ] 빈 파일 8개는 구현 예정이면 TODO 문서화, 아니면 삭제 또는 placeholder 컴포넌트 작성

## 11. 요약

현재 프로젝트의 라우터 문제는 단순히 "몇 개 링크가 빠진 상태"가 아니라, 화면 전환 기준이 URL이 아닌 컴포넌트 내부 state에 머물러 있는 구조적 문제에 가깝다. 우선 사이드바의 `HOME/MY_TREE/PROFILE`을 URL 기반으로 바꾸고, 모바일 뒤로가기와 나무 등록/수정 페이지를 라우트에 편입하면 실제 앱 플로우가 명확해진다.

그 다음 방 생성, 봉사자, 나무 목록 같은 확장 화면을 route map에 붙이는 순서가 적절하다.
