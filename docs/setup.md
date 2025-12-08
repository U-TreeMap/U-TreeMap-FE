# 🛠 U-TreeMap Front-End Setup Guide

본 문서는 U-TreeMap 프론트엔드 환경 설정 및 실행 방법을 안내합니다.  
해당 프로젝트는 **Vite + React + TailwindCSS v4** 기반으로 개발되었습니다.

---

## 1. 프로젝트 구조

U-TreeMap-FrontEnd
├── src
│ ├── components/
│ ├── hooks/
│ ├── stores/
│ ├── utils/
│ ├── index.css
│ ├── main.jsx
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json

---

## 2. 설치 및 실행

~~~bash
cd U-TreeMap-FrontEnd
yarn install      # 최초 1회
yarn dev          # 개발 서버 실행
~~~

실행 후 접속주소 : http://localhost:5173 

---

## 3. TailwindCSS v4 적용 안내

본 프로젝트는 TailwindCSS v4를 기반으로 합니다.
v3 대비 설정 방식에 차이가 있으니 아래 내용을 참고하세요.

| 항목             | v3 방식                                    | v4 방식                     |
| -------------- | ---------------------------------------- | ------------------------- |
| CSS 적용 방식      | `@tailwind base; components; utilities;` | `@import "tailwindcss";`  |
| PostCSS Plugin | `tailwindcss`                            | `@tailwindcss/postcss` 사용 |
| init 명령        | `npx tailwindcss init -p`                | ❗ v4에서는 init 없음 (수동 작성)   |

### 핵심 파일 설정 
📌 src/index.css
~~~css
@import "tailwindcss";
~~~

📌 postcss.config.js
~~~js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
~~~

📌 tailwind.config.js
~~~js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
};
~~~

## 4. Dev Server Port 고정
~~~js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // 기본 포트
    strictPort: true,  // 사용 중일 경우 실행 중단(안내)
  },
});
~~~

포트 5173을 사용하는 이유:
    지도 API 허용 Domain 문제 방지
    개발 환경 통일

📌 포트충돌 시 해결
- 터미널 종료 후 dev 재실행
- 또는 포트 점유 프로세스 종료

---

## 5.문제해결
| 문제               | 해결 방법                                        |
| ---------------- | -------------------------------------------- |
| Tailwind 스타일 미적용 | PostCSS 설정 확인 → `@tailwindcss/postcss` 포함 여부 |
| 포트 충돌 발생         | 기존 터미널 종료 or 포트 사용 프로세스 kill                 |
| dev 실행 안됨        | `yarn install` 누락 여부, node 버전 체크             |

