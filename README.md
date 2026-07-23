# 🛒 Tiny Second-hand Shopping Platform

NestJS와 React를 기반으로 개발한 중고거래 플랫폼입니다.

JWT 기반 사용자 인증, 상품 등록 및 관리, 실시간 채팅(Socket.IO), 관리자 기능 등을 구현하였으며, 보안을 고려한 서버 구조로 개발하였습니다.

---

# 📌 프로젝트 소개

Tiny Second-hand Shopping Platform은 사용자 간 중고 물품을 안전하게 거래할 수 있도록 제작한 웹 서비스입니다.

사용자는 회원가입 및 로그인 후 상품을 등록하고, 다른 사용자와 실시간 채팅을 통해 거래를 진행할 수 있습니다.

관리자는 회원 및 상품을 관리하고 신고 내역을 확인할 수 있습니다.

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Axios
- Socket.IO Client

## Backend

- NestJS
- Prisma ORM
- MySQL
- JWT Authentication
- bcrypt
- Socket.IO
- Multer

---

# ✨ 주요 기능

## 👤 사용자

- 회원가입
- 로그인 (JWT)
- 프로필 조회
- 프로필 수정
- 비밀번호 변경

---

## 📦 상품

- 상품 등록
- 상품 수정
- 상품 삭제
- 상품 조회
- 상품 검색
- 이미지 업로드

---

## 💬 채팅

- 실시간 채팅(Socket.IO)
- 채팅방 생성
- 채팅 목록 조회
- 채팅 메시지 저장 및 조회

---

## 🤝 거래

- 거래 이력 생성
- 거래 내역 조회
- 거래 완료 시 상품 상태 변경

---

## 🚨 신고

- 상품 신고
- 사용자 신고
- 신고 내역 관리

---

## 👨‍💼 관리자

- 회원 관리
- 상품 관리
- 신고 관리

---

# 🔒 보안

프로젝트 개발 과정에서 다음과 같은 보안 요소를 적용하였습니다.

- JWT 기반 인증
- 비밀번호 bcrypt 암호화
- DTO Validation(class-validator)
- JwtAuthGuard 인증 처리
- 관리자(Role) 권한 분리
- Prisma ORM 사용(SQL Injection 방지)
- 본인 상품 거래 방지
- 중복 거래 방지
- 존재하지 않는 데이터 예외 처리
- 파일 업로드 검증

---

# 📂 프로젝트 구조

```
Frontend
├── pages
├── api
├── styles
└── App.tsx

Backend
├── auth
├── user
├── product
├── chatroom
├── chat
├── transaction
├── report
├── admin
├── prisma
└── main.ts
```

---

# 🗄 Database

주요 테이블

- User
- Product
- ProductImage
- ChatRoom
- ChatMessage
- Transaction
- Report

ORM

- Prisma ORM

Database

- MySQL


## ERD 


---

# 🚀 실행 방법

### 1. 프로젝트 클론

```bash
git clone https://github.com/yncayn/second-hand-platform.git
cd backend
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사한 후 환경에 맞게 수정합니다.

```env
DATABASE_URL="mysql://root:root@localhost:3306/second_hand"

JWT_SECRET=your_jwt_secret_key

JWT_EXPIRES_IN=1d
```

### 4. 데이터베이스 마이그레이션

```bash
npx prisma migrate dev
```

### 5. 더미 데이터(Seed) 생성

```bash
npx prisma db seed
```


### 테스트 계정

프로젝트 실행 후 아래 계정으로 로그인하여 기능을 테스트할 수 있습니다.

| 이름 | 권한 | 이메일 | 비밀번호 |
|------|------|---------|----------|
| 관리자 | ADMIN | admin@test.com | 1234 |
| 혜인 | USER | user1@test.com | 1234 |
| 철수 | USER | user2@test.com | 1234 |
| 영희 | USER | user3@test.com | 1234 |

> 위 계정은 `npx prisma db seed` 실행 시 자동으로 생성됩니다.

### 6. 서버 실행

```bash
npm run start:dev
```

# 📖 API 문서

Swagger

```
http://localhost:3000/api
```

---

# 🧪 테스트

주요 테스트 항목

- 회원가입
- 로그인
- JWT 인증
- 상품 CRUD
- 이미지 업로드
- 채팅방 생성
- 실시간 채팅
- 거래 생성
- 신고 기능
- 관리자 기능


---
