# U-TreeMap 반응형 라우팅 통합 개발 기획서

작성일: 2026-05-06  
문서 구분: 개발 기획서  
대상 브랜치: `feature/codex/router`  
대상 영역: `U-TreeMap-FrontEnd/src/routes`, `src/pages`, `src/components/TreeData`, `src/components/SideBar`

## 1. 목적

현재 프로젝트는 모바일 화면과 PC 화면이 별도 컴포넌트로 나뉘어 있고, 일부 route는 `ResponsiveRoute`로 데스크톱/모바일 컴포넌트를 직접 분기한다. 이 구조는 빠르게 연결하기에는 좋지만, 기능이 늘어날수록 같은 기능의 상태, API 호출, form validation, 뒤로가기 동작이 모바일/PC 양쪽에 중복될 가능성이 높다.

이번 기획의 목적은 "주소는 하나, 화면 구성만 반응형"인 구조로 정리하는 것이다.

예:

- 모바일에서 `/trees/new` 접근: 모바일 폼 레이아웃
- 큰 화면에서 `/trees/new` 접근: PC/사이드바 또는 데스크톱 폼 레이아웃
- URL은 동일하게 유지

## 2. 현재 구조 요약

현재 주요 route는 다음과 같다.

| 주소 | 현재 렌더링 |
|---|---|
| `/map` | `App view="map"` |
| `/my-trees` | `App view="my-trees"` |
| `/profile` | `App view="profile"` |
| `/trees/new` | `ResponsiveRoute desktop={TreeAddRequestPage} mobile={MobTreeAddRequestPage}` |
| `/trees/:treeId/edit` | `ResponsiveRoute desktop={TreeEditRequestPage} mobile={MobTreeEditRequestPage}` |
| `/tree-add-request` | 등록 요청 alias |
| `/tree-edit-request` | 수정 요청 alias |
| `/room-list` | `RoomList` |
| `/teem-list` | `TeemList` |
| `/tree-list` | `TreeList` |
| `/tree-name-search` | `TreeNameSearchModal` |
| `/volunteer` | `Volunteer` |

현재 문제:

- 같은 기능이 `TreeAddRequestPage`와 `MobTreeAddRequestPage`처럼 분리되어 있다.
- route 레벨에서 모바일/PC 컴포넌트를 고르는 방식이 늘어나면 라우터가 복잡해진다.
- 모바일 컴포넌트와 PC 컴포넌트가 같은 데이터를 서로 다른 방식으로 관리할 위험이 있다.
- 화면의 "기능"과 "레이아웃"이 분리되어 있지 않다.

## 3. 목표 구조

### 3.1 원칙

- URL은 기능 단위로 하나만 둔다.
- 모바일/PC 판단은 route 주소가 아니라 layout에서 처리한다.
- 기능 상태와 API 호출은 공통 컨테이너 또는 hook에 둔다.
- 모바일/PC 컴포넌트는 가능하면 순수 presentational view로 유지한다.
- PC에서는 사이드바 또는 데스크톱 패널 방식으로 보이고, 모바일에서는 전체 화면 또는 모바일 전용 shell로 보이게 한다.

### 3.2 목표 route map

| 주소 | 기능 | 모바일 화면 | PC 화면 |
|---|---|---|---|
| `/map` | 지도 홈 | 상단 검색 + 바텀시트 | 지도 + 사이드바 홈 |
| `/my-trees` | 내 나무 | 모바일 내 나무 화면 | 지도 + 사이드바 내 나무 |
| `/profile` | 프로필 | 모바일 프로필 화면 | 지도 + 사이드바 프로필 |
| `/trees/new` | 나무 등록 | 모바일 등록 폼 | 데스크톱 등록 폼 또는 사이드 패널 |
| `/trees/:treeId/edit` | 나무 수정 | 모바일 수정 폼 | 데스크톱 수정 폼 또는 사이드 패널 |
| `/rooms` | 방 목록 | 모바일 방 목록 | PC 방 목록 |
| `/teams` | 팀 목록 | 모바일 팀 목록 | PC 팀 목록 |
| `/rooms/:roomId/trees` | 방 내 나무 목록 | 모바일 나무 목록 | PC 나무 목록 |
| `/volunteer` | 봉사자 페이지 | 모바일 봉사자 화면 | PC 봉사자 화면 |
| `/tree-name-search` | 나무 이름 검색 | 모바일 모달/페이지 | PC 모달/페이지 |

### 3.3 alias 정리 방향

현재 직접 접근용 alias:

- `/tree-add-request`
- `/tree-edit-request`
- `/room-list`
- `/teem-list`
- `/tree-list`

장기적으로는 아래 표준 URL로 정리하는 편이 좋다.

| 현재 alias | 표준 URL 제안 |
|---|---|
| `/tree-add-request` | `/trees/new` |
| `/tree-edit-request` | `/trees/:treeId/edit` 또는 `/trees/edit` |
| `/room-list` | `/rooms` |
| `/teem-list` | `/teams` |
| `/tree-list` | `/rooms/:roomId/trees` |

단, 지금 당장 기존 alias를 제거하면 확인용 URL이 깨질 수 있으므로 1차 작업에서는 alias를 유지하고 redirect 또는 동일 컴포넌트 연결로 처리한다.

## 4. 권장 아키텍처

### 4.1 Route는 기능 컨테이너만 렌더링

현재:

```jsx
<Route
  path="/trees/new"
  element={<ResponsiveRoute desktop={TreeAddRequestPage} mobile={MobTreeAddRequestPage} />}
/>
```

목표:

```jsx
<Route path="/trees/new" element={<TreeRequestRoute mode="add" />} />
<Route path="/trees/:treeId/edit" element={<TreeRequestRoute mode="edit" />} />
```

`TreeRequestRoute` 내부에서 viewport에 따라 view만 고른다.

```jsx
function TreeRequestRoute({ mode }) {
  const isMobile = useIsMobile();
  const form = useTreeRequestForm({ mode });

  return isMobile
    ? <TreeRequestMobileView mode={mode} form={form} />
    : <TreeRequestDesktopView mode={mode} form={form} />;
}
```

### 4.2 Layout 계층 분리

권장 파일 구조:

```text
src/
  routes/
    AppRouter.jsx
    routePaths.js
  layouts/
    ResponsiveLayout.jsx
    MapShell.jsx
    FullScreenShell.jsx
  pages/
    map/
      MapRoute.jsx
    trees/
      TreeRequestRoute.jsx
      TreeListRoute.jsx
      TreeNameSearchRoute.jsx
    rooms/
      RoomListRoute.jsx
    teams/
      TeamListRoute.jsx
    volunteer/
      VolunteerRoute.jsx
  components/
    TreeData/
      TreeRequestDesktopView.jsx
      TreeRequestMobileView.jsx
```

### 4.3 Shell 구분

화면은 크게 두 종류로 나눈다.

| Shell | 사용 화면 | 모바일 | PC |
|---|---|---|---|
| `MapShell` | 지도 위에 올리는 화면 | 지도 + 모바일 오버레이 | 지도 + 사이드바 |
| `FullScreenShell` | 등록/수정/목록/봉사자 화면 | 모바일 full-screen | PC full-screen 또는 고정 폭 패널 |

`/map`, `/my-trees`, `/profile`은 `MapShell` 성격이다.

`/trees/new`, `/trees/:treeId/edit`, `/rooms`, `/teams`, `/volunteer`은 우선 `FullScreenShell`로 다루는 것이 안전하다. 이후 UX가 확정되면 PC에서 지도 사이드 패널로 옮길 수 있다.

## 5. 페이지별 통합 방향

### 5.1 Map / My Trees / Profile

현재:

- `App.jsx`가 `view` prop으로 화면을 분기
- 데스크톱은 `MainPage -> Sidebar`
- 모바일은 `MobilePage`

개선 방향:

- `MapShell`로 이름과 책임을 명확히 한다.
- `view` 문자열 대신 route path 또는 route config에서 screen type을 내려준다.
- 사이드바/모바일 상단 화면 모두 같은 route config를 바라보게 한다.

테스트 포인트:

- `/map`에서 PC는 사이드바 홈, 모바일은 지도 + 바텀시트
- `/my-trees`에서 PC는 사이드바 내 나무, 모바일은 모바일 내 나무
- `/profile`에서 PC는 사이드바 프로필, 모바일은 모바일 프로필
- 새로고침 후 같은 화면 유지
- 사이드바 active icon과 URL 일치

### 5.2 TreeAddRequest / TreeEditRequest

현재:

- PC: `TreeAddRequestPage`, `TreeEditRequestPage`
- 모바일: `MobTreeAddRequestPage`, `MobTreeEditRequestPage`
- route에서 `ResponsiveRoute`로 직접 분기

개선 방향:

- `TreeRequestRoute`를 만든다.
- `mode="add" | "edit"`로 등록/수정을 통합한다.
- form 상태, API 연동, validation은 `useTreeRequestForm` 같은 공통 hook으로 이동한다.
- 기존 PC/Mobile 컴포넌트는 `TreeRequestDesktopView`, `TreeRequestMobileView`로 점진적으로 바꾼다.

1차에서는 파일명을 크게 바꾸지 않고 다음처럼 시작할 수 있다.

```jsx
<Route path="/trees/new" element={<TreeRequestRoute mode="add" />} />
<Route path="/trees/:treeId/edit" element={<TreeRequestRoute mode="edit" />} />
```

`TreeRequestRoute` 내부:

- 모바일이면 기존 `MobTreeAddRequestPage` 또는 `MobTreeEditRequestPage`
- PC면 기존 `TreeAddRequestPage` 또는 `TreeEditRequestPage`

이후 2차에서 중복 form 로직을 공통화한다.

테스트 포인트:

- 모바일/PC 모두 같은 URL 사용
- 뒤로가기 동작 유지
- 직접 URL 접근 가능
- 등록/수정 mode가 올바르게 표시

### 5.3 RoomList / TeemList / TreeList

현재:

- `RoomList`, `TeemList`는 placeholder
- `TreeList`는 구현되어 있으나 PC 고정 폭 UI
- 모바일 대응 컴포넌트로 `MobRoomList`, `MobTreeList`가 존재

개선 방향:

- `/rooms`는 `RoomListRoute`로 통합
- `/teams`는 `TeamListRoute`로 통합
- `/rooms/:roomId/trees`는 `TreeListRoute`로 통합
- 기존 `/room-list`, `/teem-list`, `/tree-list`는 alias로 유지하거나 redirect

권장 route:

```text
/rooms
/teams
/rooms/:roomId/trees
```

테스트 포인트:

- 모바일 `/rooms`는 모바일 방 목록 UI
- PC `/rooms`는 PC 방 목록 UI 또는 placeholder
- `/teem-list`는 `/teams`로 redirect하거나 동일 화면 표시
- `/tree-list`는 `/rooms/demo/trees`로 redirect하거나 동일 화면 표시

### 5.4 Volunteer

현재:

- `Volunteer`는 placeholder
- `MobVolunteer`는 구현되어 있음

개선 방향:

- `/volunteer`는 `VolunteerRoute`로 통합
- 모바일에서는 `MobVolunteer`
- PC에서는 `Volunteer` 또는 PC placeholder
- 향후 `/volunteer/rooms/:roomId`로 확장 가능하게 route path를 열어둔다.

테스트 포인트:

- 모바일 `/volunteer`에서 모바일 봉사자 화면
- PC `/volunteer`에서 PC 화면 또는 placeholder
- 뒤로가기 버튼 동작

### 5.5 TreeNameSearchModal

현재:

- `/tree-name-search`가 모달 컴포넌트를 직접 렌더링

개선 방향:

- 장기적으로는 독립 route보다 `/trees/new` 또는 `/trees/:treeId/edit` 내부 모달로 사용하는 것이 자연스럽다.
- 그래도 직접 접근 확인용 route는 유지할 수 있다.
- `TreeNameSearchRoute`를 두고 모바일/PC에서 같은 모달을 중앙에 띄우는 wrapper를 제공한다.

테스트 포인트:

- 직접 접근 시 배경 dim과 모달이 보임
- 취소 버튼 동작 정책 결정
- form 내부에서 열릴 때와 독립 route에서 열릴 때 동작 분리

## 6. 작업 Phase

### Phase 0: 현 상태 고정

목표:

- 현재 route map과 컴포넌트 대응 상태를 기준선으로 확정한다.

작업:

1. `docs/routing.md` 기준으로 현재 route 목록 확인
2. 모바일/PC 짝이 있는 컴포넌트 목록화
3. placeholder 화면과 실제 구현 화면 구분
4. alias route 유지 여부 결정

완료 기준:

- 통합 대상과 제외 대상이 명확하다.

### Phase 1: 공통 route path 상수화

목표:

- route 주소 문자열이 여러 파일에 흩어지지 않도록 정리한다.

작업:

1. `src/routes/routePaths.js` 생성
2. `/map`, `/my-trees`, `/profile`, `/trees/new`, `/rooms`, `/teams` 등 상수화
3. `AppRouter.jsx`, `NavigationRail.jsx`에서 상수 사용

테스트:

- 기존 URL 모두 접근 가능
- 사이드바 이동 정상

의존성:

- 없음

### Phase 2: ResponsiveRoute 책임 축소

목표:

- 라우터가 모바일/PC 컴포넌트 쌍을 직접 많이 알지 않도록 만든다.

작업:

1. `TreeRequestRoute` 생성
2. `/trees/new`, `/trees/:treeId/edit`를 `TreeRequestRoute`로 연결
3. 기존 `ResponsiveRoute` 사용처를 줄임
4. route 내부에서 `useIsMobile()`로 view 선택

테스트:

- `/trees/new` 모바일/PC 표시
- `/trees/:treeId/edit` 모바일/PC 표시
- 뒤로가기 유지

의존성:

- Phase 1 권장

### Phase 3: MapShell 정리

목표:

- `/map`, `/my-trees`, `/profile`의 반응형 분기를 명확한 shell로 분리한다.

작업:

1. `src/layouts/MapShell.jsx` 생성
2. 기존 `App.jsx`의 지도 + 반응형 overlay 구조를 `MapShell`로 이동
3. `App` 이름을 유지할지, `MapShell`로 대체할지 결정
4. `AppRouter.jsx`에서 `<MapShell view="map" />` 형태로 연결

테스트:

- PC `/map`, `/my-trees`, `/profile`
- 모바일 `/map`, `/my-trees`, `/profile`
- 지도 렌더링 유지
- 사이드바 active 유지

의존성:

- Phase 1 완료 권장

### Phase 4: 등록/수정 form 공통화 준비

목표:

- 모바일/PC 등록/수정 컴포넌트 중복을 줄일 수 있는 기반을 만든다.

작업:

1. `useTreeRequestForm` hook 초안 생성
2. 좌표, 나무 이름, 흉고직경, 수고, 수관폭, 지하고 상태를 공통 hook으로 이동
3. 기존 모바일/PC view는 hook 결과를 props로 받도록 점진 변경
4. submit/API 연동은 아직 하지 않음

테스트:

- 입력값 표시 유지
- 모바일/PC layout 유지
- 등록/수정 route 빌드 성공

의존성:

- Phase 2 완료

### Phase 5: 목록류 route 통합

목표:

- 방/팀/나무 목록 route를 URL 하나에 모바일/PC view로 통합한다.

작업:

1. `RoomListRoute` 생성
2. `TeamListRoute` 생성
3. `TreeListRoute` 생성
4. `/rooms`, `/teams`, `/rooms/:roomId/trees` 연결
5. 기존 `/room-list`, `/teem-list`, `/tree-list`는 redirect 또는 alias 유지

테스트:

- 모바일/PC viewport별 화면 확인
- alias URL 확인
- placeholder가 필요한 PC 화면은 명확히 표시

의존성:

- Phase 1 완료

### Phase 6: Volunteer route 통합

목표:

- 봉사자 화면도 같은 URL에서 모바일/PC view만 다르게 보이도록 만든다.

작업:

1. `VolunteerRoute` 생성
2. 모바일은 `MobVolunteer`
3. PC는 `Volunteer`
4. `/volunteer` 연결
5. 후속 확장 주소 `/volunteer/rooms/:roomId` 설계만 반영

테스트:

- 모바일 `/volunteer`
- PC `/volunteer`
- 뒤로가기 동작

의존성:

- Phase 1 완료

### Phase 7: TreeNameSearch route wrapper 추가

목표:

- 모달 컴포넌트를 route에서 직접 렌더링하지 않고 wrapper를 통해 안정적으로 표시한다.

작업:

1. `TreeNameSearchRoute` 생성
2. `TreeNameSearchModal`을 wrapper 내부에서 렌더
3. `onClose` 동작은 `navigate(-1)` 또는 `/trees/new` 이동 중 하나로 결정

테스트:

- `/tree-name-search` 직접 접근
- 취소 버튼 동작
- 모바일/PC 표시 위치 확인

의존성:

- Phase 1 완료

### Phase 8: alias 정리와 문서 갱신

목표:

- 직접 접근용 alias와 표준 URL을 명확히 정리한다.

작업:

1. `docs/routing.md` 업데이트
2. alias 유지/redirect 여부 표기
3. 실제 route map과 문서 일치 확인
4. 사용하지 않을 route 제거 계획 작성

테스트:

- 표준 URL 접근
- alias URL 접근
- fallback `/map` 동작

의존성:

- Phase 2~7 완료

## 7. 테스트 계획

### 7.1 viewport 테스트

각 route는 최소 두 viewport에서 확인한다.

| 구분 | 예시 크기 | 기대 |
|---|---|---|
| 모바일 | 390x844 | 모바일 view |
| PC | 1440x900 | 사이드바 또는 PC view |

### 7.2 핵심 URL 테스트

```text
/map
/my-trees
/profile
/trees/new
/trees/123/edit
/rooms
/teams
/rooms/1/trees
/volunteer
/tree-name-search
```

확인 항목:

- 직접 접근 가능
- 새로고침 유지
- 모바일/PC view 분기 정상
- 뒤로가기 버튼 동작
- 사이드바 active 상태 정상
- 빌드 성공

### 7.3 명령 검증

```bash
cd U-TreeMap-FrontEnd
npm run build
npx eslint <변경 파일 목록>
git diff --check
```

전체 `npm run lint`는 기존 오류가 남아 있으므로, 통합 작업에서는 변경 파일 대상 lint 통과를 우선 기준으로 둔다.

## 8. 수용 기준

- 같은 기능에 대해 모바일 URL과 PC URL을 따로 만들지 않는다.
- 모바일/PC 분기는 route 주소가 아니라 viewport 기준으로 동작한다.
- `/trees/new`, `/trees/:treeId/edit`는 route 레벨에서 모바일/PC 컴포넌트를 직접 받지 않고 `TreeRequestRoute`에서 처리한다.
- `/rooms`, `/teams`, `/volunteer`도 route wrapper를 통해 모바일/PC view를 고른다.
- 기존 alias route는 문서화되어 있고, 유지/redirect 정책이 명확하다.
- `docs/routing.md`가 실제 route map과 일치한다.

## 9. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 모바일/PC view 통합 중 UI 회귀 | 기존 화면 깨짐 | route wrapper를 먼저 만들고 view 컴포넌트는 점진 변경 |
| form 로직 공통화 범위 과대 | 작업 지연 | 1차는 route 통합, 2차에서 hook 공통화 |
| alias route 제거로 접근 경로 손실 | 테스트 불편 | alias는 당분간 유지하거나 redirect |
| 빈 placeholder 화면 증가 | 실제 기능처럼 오해 | docs에 placeholder 상태 명시 |
| 기존 lint 오류와 혼재 | 검증 어려움 | 변경 파일 대상 lint를 별도 실행 |

## 10. 최종 방향

최종적으로는 `AppRouter`가 "어떤 기능 route인지"만 정의하고, 모바일/PC 화면 차이는 각 route container 또는 layout이 책임지는 구조가 좋다. 이렇게 하면 URL 체계가 안정되고, 기능 로직은 한 곳에서 관리하며, 모바일/PC는 view 차이만 표현할 수 있다.

우선순위는 `TreeRequestRoute` 통합과 `MapShell` 정리다. 이 두 부분을 먼저 정리하면 이후 `RoomList`, `TeamList`, `Volunteer`, `TreeNameSearch`도 같은 패턴으로 확장할 수 있다.
