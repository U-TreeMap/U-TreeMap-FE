# 페이지 구현 작업 목록

작성일: 2026-05-07  
브랜치: `feature/codex/router`  
대상: 라우팅은 연결되었지만 구현이 부족한 페이지와 후속 기능

## 1. 우선 구현 필요 페이지

### 1. Profile

현재 상태:

- PC: `ProfileContent`에 `Profile` 텍스트만 표시
- 모바일: `/profile`에서 임시 텍스트 화면 표시

필요 작업:

- 사용자 기본 정보 UI
- 활동 내역 요약
- 내 나무/봉사 관련 요약
- 설정 또는 로그인 상태 UI
- 모바일/PC view 분리 또는 공통 데이터 구조 정리

우선순위: P0

### 2. Volunteer

현재 상태:

- PC: `Volunteer.jsx`는 placeholder
- 모바일: `MobVolunteer.jsx`는 UI 초안 존재

필요 작업:

- PC 봉사자 화면 구현
- 봉사 방/위치/날짜/설명 데이터 구조 정리
- “나무 데이터 측정하기” 버튼 이동 연결
- 튜토리얼 페이지 이동 정책 결정

우선순위: P0

### 3. RoomList

현재 상태:

- PC: `RoomList.jsx`는 placeholder
- 모바일: `MobRoomList.jsx`는 UI 초안 존재

필요 작업:

- PC 방 목록 UI 구현
- 모바일 헤더 문구 정리
- 방 클릭 시 `/rooms/:roomId/trees` 이동
- 방 목록 데이터 구조 정리

우선순위: P0

### 4. TeemList / TeamList

현재 상태:

- `TeemList.jsx`는 placeholder
- 파일명 `TeemList`는 오타 가능성 있음
- 현재 route는 `/teams`, alias는 `/teem-list`

필요 작업:

- `TeamList`로 명칭 정리 여부 결정
- 팀 목록 UI 구현
- 팀 선택/입장/생성 정책 결정
- `/teams` 화면 완성

우선순위: P2

### 5. TreeList

현재 상태:

- PC: `TreeList.jsx` 초안 존재
- 모바일: `MobTreeList.jsx` 초안 존재
- 현재 더미 데이터 기반
- 항목 클릭 이동 없음

필요 작업:

- 방 내부 나무 목록 역할 확정
- 더미 데이터 제거 또는 API 연동 준비
- 항목 클릭 시 수정/측정 페이지 이동
- `/rooms/:roomId/trees`와 `/tree-list` 동작 정리

우선순위: P1

## 2. 기능 연결이 부족한 페이지

### 6. TreeAddRequestPage / MobTreeAddRequestPage

현재 상태:

- 화면 초안 존재
- 입력값 하드코딩
- `/trees/new`, `/tree-add-request` route 연결 완료

필요 작업:

- form state 구성
- 좌표 선택/현재 위치 연동
- 나무 이름 검색 모달 연결
- 입력값 validation
- submit/API 연결

우선순위: P1

### 7. TreeEditRequestPage / MobTreeEditRequestPage

현재 상태:

- 등록 페이지와 거의 동일한 초안
- `/trees/:treeId/edit`, `/tree-edit-request` route 연결 완료

필요 작업:

- 기존 나무 데이터 로딩
- 수정 form state 구성
- 변경값 validation
- submit/API 연결
- 수정 완료 후 이동 정책 결정

우선순위: P1

### 8. TreeNameSearchModal

현재 상태:

- 독립 route `/tree-name-search` 연결 완료
- 실제 등록/수정 페이지 내부 흐름에는 미연결

필요 작업:

- 나무 이름 필드 클릭 시 모달 오픈
- 선택값을 등록/수정 form에 반영
- 검색 API 또는 로컬 목록 정책 결정
- 독립 route 유지 여부 결정

우선순위: P1

## 3. 정리 또는 결정 필요

### 9. MakeRoom 플로우

현재 상태:

- 아래 파일들이 0 line 상태
  - `MakeRoom/AddRoomName.jsx`
  - `MakeRoom/AddCoor.jsx`
  - `MakeRoom/AddTems.jsx`
  - `MakeRoom/QRPage.jsx`
  - `MakeRoom/TypoWarningModal.jsx`

필요 작업:

- 방 생성 플로우를 실제 구현할지 결정
- 구현한다면 `/rooms/new` route 설계
- 단계형 form인지 단일 form인지 결정
- QR 공유 페이지 필요 여부 결정

우선순위: P3

### 10. 모바일 My Trees

현재 상태:

- 모바일 `/my-trees`는 임시 “내 나무” 텍스트 화면
- PC는 `MyTreeContent` 초안 존재

필요 작업:

- 모바일 내 나무 목록 실제 UI 구현
- PC `MyTreeContent`와 데이터 구조 통일
- 나무 항목 클릭 시 상세 이동 또는 지도 포커싱 정책 결정

우선순위: P1

## 4. 추천 작업 순서

1. `Profile`
2. `Volunteer`
3. `RoomList`
4. `TreeList`
5. `TreeAddRequestPage` / `TreeEditRequestPage`
6. `TreeNameSearchModal` form 연결
7. `TeamList`
8. `MakeRoom` 플로우

## 5. 다음 작업 제안

가장 먼저 `Profile`부터 구현하는 것이 좋다.

이유:

- 현재 placeholder 수준이라 작업 범위가 명확하다.
- 라우팅 구조와 반응형 분기를 검증하기 좋다.
- 지도/방/나무 등록 API와 직접 충돌하지 않는다.
- PC 사이드바와 모바일 화면을 동시에 정리하는 첫 사례로 적합하다.
