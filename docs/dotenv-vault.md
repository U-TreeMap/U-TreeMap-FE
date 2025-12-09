## 🧑‍💻 팀원이 처음 프로젝트 받을 때 진행 절차

<시작 조건>
프로젝트 Git clone 완료
.env는 없음 (.gitignore 되어 있어야 함)
.env.vault는 repo에 포함되어 있음 (push해둔 상태)

! 해당 작업은 U-TREEMAP-FE 레포지토리 안에 있는 U-TreeMap-FrontEnd 디렉토리에서 실행해주세요.
~~~bash
cd U-TreeMap-FrontEnd
~~~

---

## 1️⃣ dotenv-vault 설치

팀원 로컬에서:

~~~bash
yarn global add dotenv-vault
~~~

---

## 2️⃣ dotenv-vault 로그인 (권한이 있어야 vault를 복호화 가능)
~~~bash
dotenv-vault login
~~~

📌 로그인해야 .env.me 인증파일이 생성됨
(이 파일은 "이 사용자는 vault 접근 권한이 있다" 라는 인증 토큰)

---

## 3️⃣ 팀원을 Vault 프로젝트에 초대 (리더가 실행)

~~~bash
dotenv-vault team:add email@example.com
~~~

또는 웹/CLI 상 동일 기능 있음
| 초대되면 팀원이 dotenv-vault login시 자동 프로젝트 접근 가능

---

## 4️⃣ 팀원은 프로젝트 연결 상태 확인
dotenv-vault status


정상 연결이라면:
Project: your-project-id
User: teammate-email
Environment: development / production ...


이렇게 보임

.env.me 파일도 프로젝트 루트에 자동 생성됨

---

5️⃣ 팀원은 .env 생성하기 (처음 한 번만)
~~~bash
dotenv-vault pull
~~~

💡 결과 : .env 파일 생성됨.

---

## 설정이 완료되었다면
| 리더(변경한 사람)          | 팀원                                        |
| ------------------- | ----------------------------------------- |
| `.env` 수정           | 아무것도 하지 않음                                |
| `dotenv-vault push` | → 필요할 때 `dotenv-vault pull`만 하면 최신.env 생성 |

---

전체 흐름 도식

리더: dotenv-vault new → push → commit .env.vault
팀원: git clone
팀원: npm i -g dotenv-vault
리더: team:add (초대)
팀원: dotenv-vault login → .env.me 생성
팀원: dotenv-vault pull → .env 생성

---
