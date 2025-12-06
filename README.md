# 🌳 U-TreeMap  
도시 속 수목 정보를 한눈에 — **친환경 도시 데이터 시각화 플랫폼**

<p align="center">
  <img src="(프로젝트 대표 이미지 또는 로고 위치)" width="300"/>
</p>

## 📌 프로젝트 소개
**U-TreeMap**은 도시 내 수목 정보를 수집·저장하고, 시민들이 직관적으로 확인할 수 있도록 시각화한 지도 기반 웹 서비스입니다.  
내 주변 나무 현황을 확인하고, 지역별 수목 밀도 및 탄소 저장량 등의 환경 정보를 보다 친숙한 방식으로 제공합니다.

> 🔎 목표 — "도시의 나무를 기록하고, 데이터로 바라보자."

---

## ✨ 주요 기능
- 🗺 **지도 기반 수목 데이터 제공** (MapBox / Leaflet)
- 📍 **대량 마커 최적화 렌더링** (수천~수만 개 데이터 처리 고려)
- 📊 **Zoom 수준에 따라 시각화 방식 변경**
  - 확대 → 개별 나무 마커 표시
  - 축소 → **행정구역 단위 폴리곤 + 수목 개수 집계 표시**
- 📱 **모바일 웹 & 웹 대응 반응형 UI**
- 🔥 추후 기능 예정
  - 수목 상세정보 / DB 연동
  - 탄소저장량 계산 및 시각화
  - 대규모 필터링 / 검색 시스템
  - UI/UX 리파인 + 성능 최적화 고도화

---

## 🛠 Tech Stack

| Category | Tech |
|---|---|
| Framework | **React.js** |
| UI | **Tailwind CSS** |
| State Management | **Zustand** |
| Map Rendering | **MapBox**, **Leaflet** |
| Platform | Mobile Web + Web |

---

## 📁 프로젝트 구조 (프로토타입)

U-TreeMap
├─ src
│ ├─ assets/
│ ├─ components/
│ ├─ hooks/ # zustand store 등
│ ├─ pages/
│ ├─ features/map/ # 지도, 마커, 폴리곤 처리 로직
│ ├─ utils/
│ └─ styles/
├─ public/
└─ README.md


---

## 👥 Developers

| Name | Role | Github |
|---|---|---|
| **이하은** | Front-End Developer | (github link) |
| **김성원** | Front-End Developer | (github link) |

---

## 🚀 프로젝트 목적 / 포트폴리오 활용

본 프로젝트는 지도 기반 대규모 데이터를 효율적으로 시각화하고,  
모바일/웹 환경에서의 성능 최적화 및 UX 설계 경험을 쌓기 위한 목적을 갖고 개발되었습니다.  
실제 도시 규모 확장을 목표로, 추후 기능들이 지속 업데이트 될 예정입니다.

---

## ⭐ Contributions

버그 제보 및 개선 제안 환영합니다.  
프로토타입 단계이며 지속적으로 발전될 예정입니다.

---

## 📄 License
(추후 지정)
