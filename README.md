# 나의 치유 이야기 (Your Healing Story)

> 우울감을 겪고 있는 사람들을 위한 자기 격려 일기서비스이다.
> 일기를 작성하면 링키라는 AI가 일기 작성후 격려 메시지를 보내주고 
자신의 일기와 링키의 메세지를 합쳐서 포토북을 만들 수 있다.

## 주요 기능

- **이메일 로그인** — 이메일 입력만으로 회원가입/로그인 (JWT 인증)
- **일기 작성** — 날짜, 기분(무드), 텍스트, 사진 첨부 가능
- **일기 목록 조회** — 월별 일기 목록 확인
- **링키 AI 코멘트** — 일기 작성 후 AI(Claude)가 한 줄 요약 + 응원 메시지 생성
- **주간/월간 리뷰** — 링키가 일주일/한 달 일기를 분석해 리뷰 제공
- **포토북 생성** — 기간 내 일기와 사진을 모아 포토북 자동 제작
- **포토북 주문** — 완성된 포토북을 실물 인쇄 주문 (배송지 입력)
- **주문 상태 조회** — 인쇄 주문 진행 상태 확인 (미완성)

---

## 실행 방법

### 사전 준비

- Python
- Node.js

### 백엔드

```bash
# 1. 백엔드 디렉토리로 이동
cd backend

# 2. 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  

# 3. 의존성 설치
pip install -r requirments.txt
pip install -e ./sweet

# 4. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 아래 항목을 입력하세요:
# DATABASE_URL, CLAUDE_API_KEY, SWEETBOOK_API_KEY 등

# 5. 서버 실행
uvicorn main:app --reload
```

백엔드 서버: http://localhost:8000

### 프론트엔드

```bash
# 1. 프론트엔드 디렉토리로 이동
cd frontend

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

프론트엔드: http://localhost:5173

### 환경변수 목록 (`.env`)

| 변수명 | 설명 |
|---|---|
| `DATABASE_URL` | SQLite 경로 (예: `sqlite:///./healing_story.db`) |
| `CLAUDE_API_KEY` | Anthropic Claude API 키 |
| `SWEETBOOK_API_KEY` | 스위트북 Book Print API 키 |
| `SWEETBOOK_BASE_URL` | 스위트북 API 베이스 URL |
| `SWEETBOOK_BOOK_SPEC_UID` | 사용할 책 스펙 UID |
| `SWEETBOOK_CONTENT_TEMPLATE_UID` | 내지 템플릿 UID |
| `SWEETBOOK_COVER_TEMPLATE_UID` | 표지 템플릿 UID |
| `SWEETBOOK_ENV` | `sandbox` 또는 `production` |
| `JWT_SECRET_KEY` | JWT 서명 키 |
| `MOCK_MODE` | `true`: 링키 AI 응답을 더미 데이터로 반환 / `false`: 실제 Claude API 호출 |

> **빠른 실행 팁:** 로그인 시 `yun68000@naver.com` 이메일을 입력하면 기존에 작성된 일기 데이터를 바로 확인할 수 있습니다.

---

## 사용한 API 목록

### Book Print API (스위트북)

| API | 엔드포인트 | 용도 |
|---|---|---|
| 책 생성 | `POST /books` | 새 포토북 생성 |
| 책 확정 | `POST /books/{bookUid}/finalize` | 포토북 내용 확정 |
| 사진 업로드 | `POST /photos` | 포토북에 사진 업로드 |
| 표지 생성 | `POST /covers` | 표지 템플릿으로 표지 생성 |
| 내지 삽입 | `POST /contents` | 일기 내용으로 내지 페이지 생성 |
| 주문 견적 | `POST /orders/estimate` | 인쇄 주문 전 가격 견적 조회 |
| 주문 생성 | `POST /orders` | 포토북 인쇄 주문 |
| 주문 조회 | `GET /orders/{orderUid}` | 주문 상태 조회 |

### Claude API (Anthropic)

| 기능 | 용도 |
|---|---|
| 링키 한 줄 요약 | 일기 내용을 한 줄로 요약 |
| 링키 응원 메시지 | 일기 내용에 맞는 응원 메시지 생성 |

---

## AI 도구 사용 내역

| AI 도구 | 활용 내용 |
|---|---|
| Claude Code | 코드 구현, 설계 지원 (백엔드 API 라우팅 구조 설계 등) |
---

## 설계 의도

### 왜 이 서비스를 선택했는지
> 해당 서비스를 선택한 의도는 최근들어 발전한 AI를 활용하여 실제 고객들의 멘탈케어에 도움이 되는
서비스를 만들어 보고 싶었기 때문입니다. 단순히 일기를 작성하는 경험을 넘어서서 그것이 AI의 피드백을
통해 컨텐츠가 되고 실제로 포토북으로 주문을 받을 수 있다면 자신의 변화과정을 좀 더 의미있게
고객이 인식 할 수 있을것이라고 생각했습니다.

### 이 서비스의 비즈니스 가능성을 어떻게 보는지
> 해당 서비스는 아직 초기구조라 조금 더 확장이 필요하지만 현재 AI에게서 정서적 공감과 위로를
받고 있는 사람들이 늘어나는 추세이며, 단순한 대화가 아니라 그것을 컨텐츠의 형태로
남길 수 있다는 점에서 여러 기능이 확장된다면 충분히 가능성이 있다고 생각합니다.

### 더 시간이 있었다면 추가했을 기능
> 일기를 추가해 나가는 과정에서 심리분석 기능을 추가해, 고객이 스스로의 상태를 객관적으로 인식할 수 있게하는 기능과
일기를 작성해나가면서 레벨업, 배지등을 얻는 게이미피케이션 기능으로 일기 기록에 동기부여 기능,
서로의 기록을 커뮤니티에서 공유 할 수 있는 기록을 추가하였을 것 같습니다.

