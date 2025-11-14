# 세션 기반 인증 React 애플리케이션

이 프로젝트는 React와 세션 기반 인증을 사용하는 프론트엔드 애플리케이션입니다. JSESSIONID 쿠키를 사용하여 사용자 인증 상태를 관리합니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [주요 기능](#주요-기능)
- [인증 흐름](#인증-흐름)
- [파일 구조 설명](#파일-구조-설명)
- [설치 및 실행](#설치-및-실행)
- [API 엔드포인트](#api-엔드포인트)

## 🎯 프로젝트 개요

이 프로젝트는 세션 기반 인증을 구현한 React SPA(Single Page Application)입니다. 사용자는 회원가입, 로그인, 로그아웃 기능을 사용할 수 있으며, 로그인 상태는 서버 세션과 JSESSIONID 쿠키를 통해 관리됩니다.

### 주요 특징

- **세션 기반 인증**: 서버 측 세션과 JSESSIONID 쿠키를 사용한 안전한 인증
- **자동 세션 확인**: 페이지 로드 시 자동으로 세션 상태 확인
- **전역 상태 관리**: React Context API를 사용한 인증 상태 관리
- **반응형 UI**: 로그인 상태에 따라 동적으로 변경되는 UI

## 🛠 기술 스택

- **React 19.1.1**: UI 라이브러리
- **React Router DOM 7.9.5**: 클라이언트 사이드 라우팅
- **Axios 1.13.2**: HTTP 클라이언트
- **Tailwind CSS 4.1.17**: 유틸리티 기반 CSS 프레임워크
- **Vite 7.1.7**: 빌드 도구 및 개발 서버

## 📁 프로젝트 구조

```
fe_with_session/
├── src/
│   ├── contexts/           # Context API 관련 파일
│   │   ├── AuthContext.js  # AuthContext 정의
│   │   └── AuthContext.jsx  # AuthProvider 컴포넌트
│   ├── hooks/              # 커스텀 훅
│   │   └── useAuth.js      # 인증 상태 접근 훅
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Login.jsx       # 로그인 페이지
│   │   └── Signup.jsx      # 회원가입 페이지
│   ├── App.jsx             # 메인 앱 컴포넌트
│   ├── main.jsx            # 애플리케이션 진입점
│   ├── index.css          # 전역 스타일
│   └── App.css            # 앱 스타일
├── vite.config.js          # Vite 설정
├── package.json           # 프로젝트 의존성
└── README.md              # 프로젝트 문서
```

## ✨ 주요 기능

### 1. 회원가입
- 이메일, 비밀번호, 이름을 입력하여 새 계정 생성
- 비밀번호 확인 기능
- 서버 응답에 따른 성공/실패 처리

### 2. 로그인
- 이메일과 비밀번호로 로그인
- 로그인 성공 시 JSESSIONID 쿠키 자동 저장
- 사용자 정보를 전역 상태에 저장
- 로그인 후 홈 페이지로 자동 이동

### 3. 세션 자동 확인
- 페이지 로드 시 자동으로 세션 상태 확인
- 세션이 유효하면 사용자 정보 자동 로드
- 새로고침해도 로그인 상태 유지

### 4. 로그아웃
- 서버에 로그아웃 요청 전송
- 세션 무효화 및 쿠키 삭제
- 로컬 상태 초기화

### 5. 조건부 UI 렌더링
- 로그인 상태에 따라 다른 UI 표시
- 로그인 전: 로그인/회원가입 버튼
- 로그인 후: 환영 메시지 및 로그아웃 버튼

## 🔄 인증 흐름

### 로그인 흐름

```
1. 사용자가 로그인 페이지에서 이메일/비밀번호 입력
   ↓
2. POST /api/users/login 요청 전송
   ↓
3. 서버가 세션 생성 및 JSESSIONID 쿠키 반환
   ↓
4. 응답에서 사용자 정보 추출 (response.data.content)
   ↓
5. login() 함수 호출하여 전역 상태 업데이트
   ↓
6. 홈 페이지로 리다이렉트
   ↓
7. 홈 페이지에서 로그인된 UI 표시
```

### 세션 확인 흐름

```
1. 앱이 시작되거나 페이지가 새로고침됨
   ↓
2. AuthProvider 컴포넌트가 마운트됨
   ↓
3. useEffect가 실행되어 checkSession() 호출
   ↓
4. GET /api/users/session 요청 전송 (JSESSIONID 쿠키 자동 포함)
   ↓
5. 서버가 세션 유효성 검사
   ↓
6-1. 세션이 유효한 경우:
     → 사용자 정보를 가져와서 user 상태에 저장
     → isLoading을 false로 설정
     → 로그인된 UI 표시

6-2. 세션이 없거나 만료된 경우:
     → user를 null로 설정
     → isLoading을 false로 설정
     → 비로그인 UI 표시
```

### 로그아웃 흐름

```
1. 사용자가 로그아웃 버튼 클릭
   ↓
2. logout() 함수 호출
   ↓
3. POST /api/users/logout 요청 전송
   ↓
4. 서버가 세션 무효화 및 쿠키 삭제
   ↓
5. user 상태를 null로 설정
   ↓
6. 비로그인 UI로 변경
```

## 📄 파일 구조 설명

### `src/App.jsx`
메인 애플리케이션 컴포넌트입니다.

**주요 역할:**
- React Router를 사용한 라우팅 설정
- AuthProvider로 전체 앱을 감싸서 인증 상태 제공
- Home 컴포넌트에서 로그인 상태에 따라 조건부 렌더링

**라우트:**
- `/`: 홈 페이지 (Home 컴포넌트)
- `/login`: 로그인 페이지
- `/signup`: 회원가입 페이지

### `src/contexts/AuthContext.jsx`
인증 상태를 관리하는 Context Provider입니다.

**주요 기능:**
- `user` 상태: 현재 로그인한 사용자 정보
- `isLoading` 상태: 세션 확인 중인지 여부
- `checkSession()`: 서버에 세션 확인 요청
- `login()`: 로그인 후 사용자 정보 저장
- `logout()`: 로그아웃 요청 및 상태 초기화

**생명주기:**
1. 컴포넌트 마운트 시 `checkSession()` 자동 실행
2. 세션 확인 완료 후 `isLoading`을 false로 설정
3. 하위 컴포넌트에 인증 상태와 함수들 제공

### `src/contexts/AuthContext.js`
React Context를 정의하는 파일입니다.

**역할:**
- `createContext(null)`로 Context 생성
- AuthProvider와 useAuth 훅에서 사용

### `src/hooks/useAuth.js`
인증 상태에 접근하기 위한 커스텀 훅입니다.

**사용법:**
```jsx
const { user, login, logout, isLoading } = useAuth();
```

**반환 값:**
- `user`: 사용자 정보 객체 또는 null
- `login`: 로그인 함수
- `logout`: 로그아웃 함수
- `isLoading`: 로딩 상태

**에러 처리:**
- AuthProvider 밖에서 사용하면 에러 발생

### `src/pages/Login.jsx`
로그인 페이지 컴포넌트입니다.

**주요 기능:**
- 이메일/비밀번호 입력 폼
- 로그인 요청 처리
- 에러 메시지 표시
- 로그인 성공 시 홈으로 이동

**API 호출:**
- `POST /api/users/login`
- 요청 본문: `{ email, password }`
- 응답: `{ status: "success", content: { id, email, name } }`

### `src/pages/Signup.jsx`
회원가입 페이지 컴포넌트입니다.

**주요 기능:**
- 이메일, 비밀번호, 비밀번호 확인, 이름 입력
- 비밀번호 일치 검증
- 회원가입 요청 처리

**API 호출:**
- `POST /api/users/signup`
- 요청 본문: `{ email, password, name }`

### `src/main.jsx`
애플리케이션의 진입점입니다.

**역할:**
- React 애플리케이션을 DOM에 마운트
- BrowserRouter로 라우팅 기능 제공
- StrictMode로 개발 모드 진단 활성화

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 개발 서버 시작 (기본 포트: 5173)
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build
```

### 프리뷰

```bash
# 빌드된 앱 미리보기
npm run preview
```

## 🔌 API 엔드포인트

프로젝트는 다음 API 엔드포인트를 사용합니다:

### 회원가입
- **URL**: `POST /api/users/signup`
- **요청 본문**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동"
  }
  ```
- **응답**: 
  ```json
  {
    "status": "success",
    "message": "회원가입 성공"
  }
  ```

### 로그인
- **URL**: `POST /api/users/login`
- **요청 본문**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답**: 
  ```json
  {
    "status": "success",
    "message": "로그인 성공",
    "content": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동"
    }
  }
  ```
- **쿠키**: JSESSIONID 자동 설정

### 세션 확인
- **URL**: `GET /api/users/session`
- **쿠키**: JSESSIONID 자동 포함
- **응답**: 
  ```json
  {
    "status": "success",
    "content": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동"
    }
  }
  ```

### 로그아웃
- **URL**: `POST /api/users/logout`
- **쿠키**: JSESSIONID 자동 포함
- **응답**: 
  ```json
  {
    "status": "success",
    "message": "Logged out successfully"
  }
  ```

## ⚙️ 설정

### Vite 프록시 설정

`vite.config.js`에서 백엔드 서버 프록시를 설정합니다:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

이 설정으로 `/api/*` 요청이 자동으로 백엔드 서버로 프록시됩니다.

## 🔒 보안 고려사항

1. **HttpOnly 쿠키**: JSESSIONID는 HttpOnly로 설정되어 있어 JavaScript로 접근할 수 없습니다.
2. **세션 만료**: 서버에서 세션 만료 시간을 적절히 설정해야 합니다.
3. **HTTPS**: 프로덕션 환경에서는 HTTPS를 사용해야 합니다.
4. **CSRF 보호**: 필요시 CSRF 토큰을 추가로 구현해야 합니다.

## 📝 주의사항

1. **쿠키 삭제**: HttpOnly 쿠키는 클라이언트에서 완전히 삭제할 수 없습니다. 서버가 응답 헤더에 `Set-Cookie`로 쿠키를 삭제해야 합니다.

2. **세션 확인**: 페이지가 로드될 때마다 세션 확인 요청이 발생합니다. 성능 최적화를 위해 캐싱을 고려할 수 있습니다.

3. **에러 처리**: 네트워크 에러나 서버 에러에 대한 적절한 사용자 피드백을 제공해야 합니다.

## 🤝 기여

이 프로젝트에 기여하고 싶으시다면:
1. Fork 하기
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**마지막 업데이트**: 2024년
