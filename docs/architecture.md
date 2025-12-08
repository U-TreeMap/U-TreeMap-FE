//architecture.md # Architecture Overview

본 문서는 U-TreeMap Front-End 구조 및 기술 스택에 대해 설명합니다.

---

## 1. Tech Stack
- React + Vite
- TailwindCSS v4
- Zustand State Management
- Mapbox / Leaflet

## 2. Directory Structure
src/
├─ assets/ # 파비콘, 아이콘 소스
├─ components/ # UI 재사용 컴포넌트
├─ data/ # 테스트용 더미데이터
├─ hooks/ # custom hooks
├─ stores/ # Zustand store
├─ utils/ # 공용 함수
├─ pages/ # 페이지 단위 라우팅

## 3. Render Flow
사용자 요청 → 지도 로딩 → 마커 렌더링 → zoom level에 따른 View 변화

