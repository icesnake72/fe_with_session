# React 훅(Hook)과 Context 완전 정복 가이드

## 📚 목차
1. [React 기본 개념](#react-기본-개념)
2. [상태(State)란 무엇인가?](#상태state란-무엇인가)
3. [훅(Hook)이란 무엇인가?](#훅hook이란-무엇인가)
4. [Context란 무엇인가?](#context란-무엇인가)
5. [실제 프로젝트 예시 분석](#실제-프로젝트-예시-분석)
6. [자주 묻는 질문](#자주-묻는-질문)

---

## React 기본 개념

### React는 무엇인가?

React는 사용자 인터페이스(UI)를 만들기 위한 JavaScript 라이브러리입니다.

**비유: 레고 블록 조립**
- React 컴포넌트 = 레고 블록
- 여러 블록을 조립해서 집(웹페이지)을 만듭니다
- 블록 하나를 바꾸면 그 부분만 다시 조립됩니다

### 컴포넌트란?

컴포넌트는 재사용 가능한 UI 조각입니다.

```jsx
// 간단한 컴포넌트 예시
function Button() {
  return <button>클릭하세요</button>;
}
```

**비유: 컴포넌트 = 부품**
- 자동차의 바퀴, 엔진, 문처럼 각각 독립적인 부품
- 부품을 조립해서 완성품을 만듭니다
- 같은 부품을 여러 곳에서 재사용할 수 있습니다

---

## 상태(State)란 무엇인가?

### 상태의 정의

**상태(State)**는 컴포넌트가 기억하고 있는 데이터입니다. 이 데이터가 변경되면 화면이 자동으로 업데이트됩니다.

### 왜 상태가 필요한가?

일반 변수는 변경되어도 화면이 업데이트되지 않습니다.

```jsx
// ❌ 잘못된 방법 - 화면이 업데이트되지 않음
function Counter() {
  let count = 0;  // 일반 변수
  
  const handleClick = () => {
    count = count + 1;  // 값은 변경되지만 화면은 안 바뀜
  };
  
  return <button onClick={handleClick}>클릭: {count}</button>;
}
```

상태를 사용하면 값이 변경될 때 화면이 자동으로 업데이트됩니다.

```jsx
// ✅ 올바른 방법 - 화면이 자동으로 업데이트됨
function Counter() {
  const [count, setCount] = useState(0);  // 상태 사용
  
  const handleClick = () => {
    setCount(count + 1);  // 상태 변경 → 화면 자동 업데이트
  };
  
  return <button onClick={handleClick}>클릭: {count}</button>;
}
```

### 상태의 비유

**상태 = 메모지**
- 메모지에 적힌 내용(상태 값)이 바뀌면
- 그 메모지를 보고 있는 사람들(컴포넌트)이 자동으로 새로운 내용을 확인합니다
- 메모지를 바꾸는 사람(setState 함수)이 있으면
- 모든 사람이 동시에 새로운 내용을 봅니다

### 상태의 특징

1. **변경 가능**: `setState()` 함수로 값을 변경할 수 있습니다
2. **자동 업데이트**: 상태가 변경되면 컴포넌트가 자동으로 다시 렌더링됩니다
3. **컴포넌트별 독립**: 각 컴포넌트는 자신만의 상태를 가집니다

---

## 훅(Hook)이란 무엇인가?

### 훅의 정의

**훅(Hook)**은 React의 특별한 기능을 사용할 수 있게 해주는 함수입니다. 함수 이름이 `use`로 시작합니다.

### 왜 훅이 필요한가?

React는 함수형 컴포넌트를 사용합니다. 하지만 함수형 컴포넌트는 원래 상태를 가질 수 없었습니다. 훅이 등장하면서 함수형 컴포넌트에서도 상태를 사용할 수 있게 되었습니다.

### 훅의 비유

**훅 = 도구상자**
- 각 훅은 특정 기능을 수행하는 도구입니다
- `useState` = 상태를 관리하는 도구
- `useEffect` = 부수 효과를 처리하는 도구
- `useContext` = Context에서 값을 가져오는 도구

### 주요 훅들

#### 1. useState - 상태 관리 훅

가장 기본적인 훅입니다. 컴포넌트에 상태를 추가합니다.

```jsx
function Counter() {
  // useState 훅 사용
  // [현재값, 값을변경하는함수] = useState(초기값)
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
      <button onClick={() => setCount(count - 1)}>감소</button>
    </div>
  );
}
```

**비유: useState = 메모지와 펜**
- `useState(0)`: 빈 메모지에 0을 적어둡니다
- `count`: 메모지에 적힌 현재 값을 읽습니다
- `setCount(5)`: 메모지에 5를 적습니다 (값이 바뀌면 화면도 자동 업데이트)

#### 2. useEffect - 부수 효과 훅

컴포넌트가 렌더링된 후에 실행되는 코드를 작성할 수 있습니다.

```jsx
function MyComponent() {
  const [count, setCount] = useState(0);
  
  // useEffect 훅 사용
  // 컴포넌트가 렌더링될 때마다 실행됨
  useEffect(() => {
    console.log('카운트가 변경되었습니다:', count);
  });
  
  return <button onClick={() => setCount(count + 1)}>클릭: {count}</button>;
}
```

**비유: useEffect = 알람시계**
- 특정 조건(의존성 배열)이 만족되면 알람이 울립니다
- 컴포넌트가 마운트되거나, 특정 값이 변경될 때 실행됩니다

#### 3. useContext - Context 접근 훅

Context에서 값을 가져옵니다. (Context는 아래에서 자세히 설명합니다)

```jsx
function MyComponent() {
  // Context에서 값을 가져옴
  const value = useContext(MyContext);
  
  return <div>{value}</div>;
}
```

**비유: useContext = 공용 사물함 열쇠**
- 공용 사물함(Context)에 접근하는 열쇠입니다
- 사물함에 뭐가 있는지 확인할 수 있습니다

### 훅 사용 규칙

1. **컴포넌트 최상위에서만 호출**: 조건문이나 반복문 안에서 호출하면 안 됩니다
2. **함수형 컴포넌트에서만 사용**: 일반 JavaScript 함수에서는 사용할 수 없습니다

```jsx
// ✅ 올바른 사용
function MyComponent() {
  const [count, setCount] = useState(0);  // 최상위에서 호출
  return <div>{count}</div>;
}

// ❌ 잘못된 사용
function MyComponent() {
  if (true) {
    const [count, setCount] = useState(0);  // 조건문 안에서 호출하면 안 됨
  }
  return <div>{count}</div>;
}
```

---

## Context란 무엇인가?

### Context의 정의

**Context**는 컴포넌트 트리 전체에서 데이터를 공유할 수 있게 해주는 React의 기능입니다.

### 왜 Context가 필요한가?

#### 문제 상황: Props Drilling

일반적으로 데이터는 부모에서 자식으로 props를 통해 전달됩니다.

```jsx
// 할아버지 컴포넌트
function Grandfather() {
  const user = { name: "홍길동" };
  return <Father user={user} />;  // 아버지에게 전달
}

// 아버지 컴포넌트
function Father({ user }) {
  return <Son user={user} />;  // 아버지는 사용 안 하지만 자식에게 전달
}

// 아들 컴포넌트
function Son({ user }) {
  return <div>안녕하세요, {user.name}님!</div>;  // 실제로 사용
}
```

**문제점:**
- 아버지는 `user`를 사용하지 않지만 자식에게 전달하기 위해 props를 받아야 합니다
- 중간 컴포넌트들이 불필요하게 props를 전달해야 합니다
- 컴포넌트가 많아질수록 복잡해집니다

**비유: Props Drilling = 편지 전달**
- 할아버지가 손자에게 편지를 보내려면
- 아버지를 거쳐야 합니다
- 아버지는 편지를 읽지도 않지만 전달만 해야 합니다

#### 해결책: Context

Context를 사용하면 중간 컴포넌트를 거치지 않고 직접 데이터를 전달할 수 있습니다.

```jsx
// Context 생성
const UserContext = createContext(null);

// 할아버지 컴포넌트 (Provider)
function Grandfather() {
  const user = { name: "홍길동" };
  return (
    <UserContext.Provider value={user}>
      <Father />  {/* user를 전달하지 않음 */}
    </UserContext.Provider>
  );
}

// 아버지 컴포넌트
function Father() {
  return <Son />;  {/* user를 전달하지 않음 */}
}

// 아들 컴포넌트
function Son() {
  const user = useContext(UserContext);  // 직접 가져옴
  return <div>안녕하세요, {user.name}님!</div>;
}
```

**비유: Context = 공용 사물함**
- 할아버지가 공용 사물함에 편지를 넣습니다
- 손자는 사물함 열쇠(useContext)로 직접 편지를 가져옵니다
- 아버지는 편지 전달에 관여하지 않습니다

### Context의 구조

Context는 3가지 요소로 구성됩니다:

1. **Context 생성**: `createContext()`
2. **Provider**: 데이터를 제공하는 컴포넌트
3. **Consumer**: 데이터를 사용하는 컴포넌트 (또는 `useContext` 훅)

```jsx
// 1. Context 생성
const MyContext = createContext(null);

// 2. Provider로 감싸기
function App() {
  const value = "안녕하세요";
  return (
    <MyContext.Provider value={value}>
      <Child />
    </MyContext.Provider>
  );
}

// 3. useContext로 값 가져오기
function Child() {
  const value = useContext(MyContext);
  return <div>{value}</div>;
}
```

### Context의 비유 (상세)

**Context = 회사 공용 사물함 시스템**

1. **createContext()**: 사물함을 만듭니다
   ```jsx
   const AuthContext = createContext(null);
   // → 회사에 "인증 정보 사물함"을 설치합니다
   ```

2. **Provider**: 사물함에 물건을 넣습니다
   ```jsx
   <AuthContext.Provider value={{ user: "홍길동" }}>
     <App />
   </AuthContext.Provider>
   // → 사물함에 "홍길동"이라는 정보를 넣습니다
   ```

3. **useContext**: 사물함에서 물건을 꺼냅니다
   ```jsx
   const { user } = useContext(AuthContext);
   // → 사물함 열쇠로 "홍길동" 정보를 꺼냅니다
   ```

**장점:**
- 어느 부서(컴포넌트)에서든 사물함에 접근 가능
- 중간 부서를 거치지 않아도 됨
- 한 곳에서 관리하므로 일관성 유지

---

## 실제 프로젝트 예시 분석

이제 우리 프로젝트의 코드를 단계별로 분석해보겠습니다.

### 1단계: Context 생성

```jsx
// src/contexts/AuthContext.js
import { createContext } from "react";

export const AuthContext = createContext(null);
```

**설명:**
- `createContext(null)`: 인증 정보를 담을 사물함을 만듭니다
- 초기값은 `null`입니다 (아직 아무것도 없음)
- 이 사물함은 전역에서 사용할 수 있도록 export합니다

**비유:** 회사에 "인증 정보 사물함"을 설치합니다. 아직 비어있습니다.

### 2단계: Provider 생성

```jsx
// src/contexts/AuthContext.jsx
export function AuthProvider({ children }) {
  // 상태 생성
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 세션 확인 함수
  const checkSession = async () => {
    // 서버에 세션 확인 요청
    const response = await axios.get("/api/users/session");
    if (response.data.status === "success") {
      setUser(response.data.content);
    }
  };
  
  // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    checkSession();
  }, []);
  
  // 로그인 함수
  const login = (userInfo) => {
    setUser(userInfo);
  };
  
  // 로그아웃 함수
  const logout = async () => {
    await axios.post("/api/users/logout");
    setUser(null);
  };
  
  // Provider로 감싸기
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**설명:**
1. **상태 생성**: `user`와 `isLoading` 상태를 만듭니다
2. **함수들**: `checkSession`, `login`, `logout` 함수를 정의합니다
3. **Provider**: 사물함에 `{ user, login, logout, isLoading }`을 넣습니다
4. **자동 실행**: 컴포넌트가 마운트되면 자동으로 세션을 확인합니다

**비유:**
- 사물함 관리자가 사물함에 사용자 정보를 넣고 관리합니다
- 사물함에는 사용자 정보, 로그인/로그아웃 기능이 들어있습니다
- 관리자는 앱이 시작되면 자동으로 사용자 정보를 확인합니다

### 3단계: 커스텀 훅 생성

```jsx
// src/hooks/useAuth.js
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
```

**설명:**
- `useContext(AuthContext)`: 사물함에서 값을 가져옵니다
- 에러 체크: Provider 밖에서 사용하면 에러를 발생시킵니다
- 편의성: 매번 `useContext`를 직접 쓰지 않고 이 훅을 사용합니다

**비유:**
- 사물함 열쇠를 만듭니다
- 사물함이 없으면(Provider 밖) 에러를 발생시킵니다
- 열쇠를 사용하면 사물함 내용을 쉽게 가져올 수 있습니다

### 4단계: App에서 Provider 사용

```jsx
// src/App.jsx
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}
```

**설명:**
- `AuthProvider`로 전체 앱을 감쌉니다
- 이제 모든 하위 컴포넌트에서 `useAuth`를 사용할 수 있습니다

**비유:**
- 회사 전체를 사물함 시스템으로 감쌉니다
- 모든 부서(컴포넌트)에서 사물함에 접근할 수 있습니다

### 5단계: 컴포넌트에서 사용

```jsx
// src/App.jsx의 Home 컴포넌트
function Home() {
  const { user, logout, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  
  if (user) {
    return (
      <div>
        <p>{user.name}님, 반갑습니다!</p>
        <button onClick={logout}>로그아웃</button>
      </div>
    );
  }
  
  return (
    <div>
      <button>로그인</button>
    </div>
  );
}
```

**설명:**
1. `useAuth()` 호출: 사물함에서 값을 가져옵니다
2. 조건부 렌더링: `user` 상태에 따라 다른 UI를 보여줍니다
3. 함수 사용: `logout` 함수를 버튼에 연결합니다

**비유:**
- 부서(컴포넌트)에서 사물함 열쇠로 정보를 가져옵니다
- 정보에 따라 다른 작업을 수행합니다
- 로그아웃 버튼을 누르면 사물함 관리자에게 로그아웃 요청을 합니다

---

## 전체 흐름 정리

### 데이터 흐름

```
1. AuthProvider 생성
   ↓
2. 상태 관리 (user, isLoading)
   ↓
3. Context에 값 제공 ({ user, login, logout, isLoading })
   ↓
4. 하위 컴포넌트에서 useAuth()로 값 가져오기
   ↓
5. 값 변경 시 자동으로 리렌더링
```

### 실제 동작 예시

**시나리오: 사용자가 로그인하는 과정**

```
1. 사용자가 Login 페이지에서 이메일/비밀번호 입력
   ↓
2. 로그인 버튼 클릭
   ↓
3. 서버에 POST /api/users/login 요청
   ↓
4. 서버가 응답: { status: "success", content: { id: 1, name: "홍길동" } }
   ↓
5. Login 컴포넌트에서 login(userInfo) 호출
   ↓
6. AuthProvider의 login 함수 실행 → setUser(userInfo)
   ↓
7. user 상태가 변경됨
   ↓
8. Context의 value가 변경됨
   ↓
9. useAuth를 사용하는 모든 컴포넌트가 자동으로 리렌더링
   ↓
10. Home 컴포넌트가 새로운 user 값을 받아서 "홍길동님, 반갑습니다!" 표시
```

---

## 자주 묻는 질문

### Q1: useState와 Context의 차이는?

**useState:**
- 컴포넌트 내부에서만 사용 가능
- 해당 컴포넌트와 자식 컴포넌트에만 전달 가능 (props로)

**Context:**
- 전역에서 사용 가능
- 중간 컴포넌트를 거치지 않고 직접 접근 가능

**비유:**
- useState = 개인 메모지 (나와 내 자식만 봄)
- Context = 공용 사물함 (누구나 접근 가능)

### Q2: 언제 Context를 사용해야 하나?

**Context를 사용해야 할 때:**
- 여러 컴포넌트에서 같은 데이터가 필요할 때
- Props drilling이 너무 깊어질 때
- 전역 상태가 필요할 때 (예: 사용자 인증 정보, 테마 설정)

**Context를 사용하지 말아야 할 때:**
- 단순히 부모-자식 간 데이터 전달 (props 사용)
- 자주 변경되는 데이터 (성능 이슈 가능)

### Q3: 훅은 언제 실행되나?

**컴포넌트가 렌더링될 때마다 실행됩니다.**

```jsx
function MyComponent() {
  console.log('1. 컴포넌트 함수 실행');
  
  const [count, setCount] = useState(0);  // 2. useState 실행
  const value = useContext(MyContext);  // 3. useContext 실행
  
  useEffect(() => {
    console.log('4. useEffect 실행 (렌더링 후)');
  });
  
  return <div>{count}</div>;  // 5. JSX 반환
}
```

**실행 순서:**
1. 컴포넌트 함수 실행
2. 훅들 실행 (useState, useContext 등)
3. JSX 반환
4. 화면에 렌더링
5. useEffect 실행 (렌더링 후)

### Q4: 상태가 변경되면 어떻게 되나?

**자동 리렌더링:**
1. `setState()` 호출
2. React가 상태 변경 감지
3. 해당 컴포넌트와 하위 컴포넌트 재렌더링
4. 화면 업데이트

**비유:**
- 메모지에 새로운 내용을 적으면
- 그 메모지를 보고 있는 모든 사람이 자동으로 새로운 내용을 확인합니다

### Q5: Context와 전역 변수의 차이는?

**전역 변수:**
- 변경되어도 화면이 업데이트되지 않음
- React의 리렌더링 시스템과 연결되지 않음

**Context:**
- 변경되면 자동으로 리렌더링됨
- React의 상태 관리 시스템과 통합됨

**비유:**
- 전역 변수 = 벽에 적힌 글씨 (바뀌어도 아무도 안 봄)
- Context = 전자 게시판 (바뀌면 자동으로 모든 화면 업데이트)

---

## 마무리

### 핵심 정리

1. **상태(State)**: 컴포넌트가 기억하는 데이터, 변경 시 자동 업데이트
2. **훅(Hook)**: React 기능을 사용하는 함수, `use`로 시작
3. **Context**: 전역 데이터 공유 시스템, Props drilling 해결

### 학습 순서 추천

1. ✅ `useState` 이해하기
2. ✅ `useEffect` 이해하기
3. ✅ Context 기본 개념 이해하기
4. ✅ 실제 프로젝트 코드 분석하기
5. ✅ 직접 간단한 Context 만들어보기

### 다음 단계

- React Router 이해하기
- 커스텀 훅 만들기
- 성능 최적화 (useMemo, useCallback)

---

**이 문서는 초급자를 위해 작성되었습니다. 더 궁금한 점이 있으면 언제든 질문해주세요!** 🚀

