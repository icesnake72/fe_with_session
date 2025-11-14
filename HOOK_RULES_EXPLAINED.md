# React 훅 사용 규칙 상세 설명

## "일반 JavaScript 함수에서는 사용할 수 없다"는 의미

### 핵심 개념

**훅은 React 컴포넌트 함수 안에서만 사용할 수 있습니다.**

일반 JavaScript 함수(컴포넌트가 아닌 함수)에서는 훅을 사용할 수 없습니다.

---

## 1. React 컴포넌트 함수 vs 일반 JavaScript 함수

### ✅ React 컴포넌트 함수 (훅 사용 가능)

```jsx
// 이것은 React 컴포넌트 함수입니다
function Login() {
  // ✅ 훅 사용 가능!
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  
  return <div>로그인</div>;
}
```

**특징:**
- JSX를 반환합니다 (`return <div>...</div>`)
- React가 이 함수를 컴포넌트로 인식합니다
- 훅을 사용할 수 있습니다

### ❌ 일반 JavaScript 함수 (훅 사용 불가)

```jsx
// 이것은 일반 JavaScript 함수입니다 (컴포넌트가 아님)
function calculateSum(a, b) {
  // ❌ 훅 사용 불가!
  // const [count, setCount] = useState(0);  // 에러 발생!
  
  return a + b;  // 일반 값을 반환
}

// 이것도 일반 JavaScript 함수입니다
function formatDate(date) {
  // ❌ 훅 사용 불가!
  // const [formatted, setFormatted] = useState("");  // 에러 발생!
  
  return date.toLocaleDateString();
}
```

**특징:**
- JSX를 반환하지 않습니다
- 일반 값을 반환합니다 (숫자, 문자열, 객체 등)
- React가 컴포넌트로 인식하지 않습니다
- 훅을 사용할 수 없습니다

---

## 2. 실제 코드 예시

### ✅ 올바른 사용 (컴포넌트 함수 안)

```jsx
// src/pages/Login.jsx
function Login() {  // ← 이것은 React 컴포넌트 함수
  // ✅ 컴포넌트 함수 안이므로 훅 사용 가능
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  
  return (
    <form>
      <input value={email} />
    </form>
  );
}
```

### ❌ 잘못된 사용 (일반 함수 안)

```jsx
// 일반 유틸리티 함수
function validateEmail(email) {  // ← 이것은 일반 JavaScript 함수
  // ❌ 에러 발생! 일반 함수에서는 훅 사용 불가
  const [isValid, setIsValid] = useState(false);
  
  return email.includes("@");
}

// API 호출 함수
async function fetchUserData(userId) {  // ← 이것도 일반 JavaScript 함수
  // ❌ 에러 발생! 일반 함수에서는 훅 사용 불가
  const [user, setUser] = useState(null);
  
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

---

## 3. 왜 일반 함수에서는 사용할 수 없을까?

### React의 내부 동작 방식

React는 컴포넌트를 렌더링할 때 훅의 호출 순서를 추적합니다.

```jsx
function MyComponent() {
  const [count, setCount] = useState(0);      // 훅 1
  const [name, setName] = useState("");       // 훅 2
  const value = useContext(MyContext);        // 훅 3
  
  // React는 이 순서를 기억합니다:
  // 렌더링 1: useState(0) → useState("") → useContext(...)
  // 렌더링 2: useState(0) → useState("") → useContext(...)
  // 항상 같은 순서로 호출되어야 합니다!
}
```

**문제 상황:**

```jsx
function MyComponent() {
  if (someCondition) {
    const [count, setCount] = useState(0);  // ❌ 조건부 호출
  }
  const [name, setName] = useState("");       // 훅 2
  
  // 렌더링 1: 조건이 true → useState(0), useState("")
  // 렌더링 2: 조건이 false → useState("")만 호출
  // 순서가 달라져서 에러 발생!
}
```

### 일반 함수에서는 React의 렌더링 사이클과 연결되지 않음

```jsx
// 일반 함수는 React의 렌더링 사이클과 무관합니다
function calculateTotal(items) {
  // 이 함수는 언제 호출될지 모릅니다
  // React가 관리하지 않습니다
  // 따라서 훅을 사용할 수 없습니다
  
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

---

## 4. 비유로 이해하기

### React 컴포넌트 = React가 관리하는 공간

**비유: React 컴포넌트 = 회사 사무실**

```jsx
function Login() {  // ← 회사 사무실
  // ✅ 사무실 안에서는 회사 도구(훅)를 사용할 수 있음
  const [email, setEmail] = useState("");
}
```

**비유: 일반 함수 = 회사 밖 공간**

```jsx
function calculateSum(a, b) {  // ← 회사 밖 (카페, 집 등)
  // ❌ 회사 밖에서는 회사 도구(훅)를 사용할 수 없음
  // const [count, setCount] = useState(0);  // 에러!
  
  return a + b;  // 일반 계산만 가능
}
```

---

## 5. 실제 프로젝트에서의 예시

### ✅ 올바른 패턴

```jsx
// src/pages/Login.jsx
function Login() {  // React 컴포넌트
  // ✅ 컴포넌트 안에서 훅 사용
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // ✅ 컴포넌트 안에서 일반 함수 정의 가능
  const handleSubmit = (e) => {
    e.preventDefault();
    // 이 함수는 컴포넌트 안에 있지만, 일반 함수입니다
    // 하지만 컴포넌트 안에서 정의되었으므로 훅에 접근 가능
    console.log(email, password);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### ❌ 잘못된 패턴

```jsx
// src/utils/helpers.js (일반 유틸리티 파일)
// ❌ 일반 JavaScript 파일에서는 훅 사용 불가

export function validateEmail(email) {
  // ❌ 에러! 일반 함수에서는 훅 사용 불가
  const [isValid, setIsValid] = useState(false);
  
  return email.includes("@");
}

export function formatCurrency(amount) {
  // ❌ 에러! 일반 함수에서는 훅 사용 불가
  const [formatted, setFormatted] = useState("");
  
  return new Intl.NumberFormat('ko-KR').format(amount);
}
```

### ✅ 올바른 해결 방법

일반 함수에서 상태가 필요하면, 컴포넌트에서 상태를 관리하고 함수에 전달합니다:

```jsx
// src/utils/helpers.js
// ✅ 일반 함수는 순수 함수로 작성 (상태 없이)
export function validateEmail(email) {
  return email.includes("@");
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('ko-KR').format(amount);
}

// src/pages/Login.jsx
function Login() {
  // ✅ 컴포넌트에서 상태 관리
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  
  // ✅ 일반 함수를 호출하여 사용
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValid(validateEmail(newEmail));  // 일반 함수 호출
  };
  
  return <input value={email} onChange={handleEmailChange} />;
}
```

---

## 6. 예외: 커스텀 훅

커스텀 훅은 일반 함수처럼 보이지만, 실제로는 훅을 사용하는 특별한 함수입니다.

### 커스텀 훅의 특징

```jsx
// src/hooks/useAuth.js
// 이것은 "커스텀 훅"입니다
// 이름이 "use"로 시작하고, 내부에서 다른 훅을 사용합니다
export function useAuth() {  // ← "use"로 시작 = 커스텀 훅
  // ✅ 커스텀 훅 안에서는 다른 훅 사용 가능
  const context = useContext(AuthContext);
  
  return context;
}

// 사용법: 컴포넌트에서 호출
function Login() {
  // ✅ 컴포넌트에서 커스텀 훅 사용
  const { user, login } = useAuth();
}
```

**커스텀 훅의 규칙:**
- 이름이 `use`로 시작해야 합니다
- 컴포넌트 함수 안에서만 호출할 수 있습니다
- 내부에서 다른 훅을 사용할 수 있습니다

---

## 7. 요약

### "일반 JavaScript 함수에서는 사용할 수 없다"의 의미

1. **React 컴포넌트 함수**: JSX를 반환하는 함수
   - ✅ 훅 사용 가능
   - 예: `function Login() { return <div>...</div>; }`

2. **일반 JavaScript 함수**: 일반 값을 반환하는 함수
   - ❌ 훅 사용 불가
   - 예: `function calculateSum(a, b) { return a + b; }`

3. **커스텀 훅**: `use`로 시작하는 특별한 함수
   - ✅ 내부에서 훅 사용 가능
   - ❌ 컴포넌트에서만 호출 가능

### 구분하는 방법

```jsx
// ✅ 컴포넌트 함수 (훅 사용 가능)
function MyComponent() {
  return <div>...</div>;  // JSX 반환
}

// ❌ 일반 함수 (훅 사용 불가)
function myFunction() {
  return "hello";  // 일반 값 반환
}

// ✅ 커스텀 훅 (내부에서 훅 사용 가능, 컴포넌트에서만 호출)
function useMyHook() {
  const [value, setValue] = useState("");
  return value;
}
```

---

## 8. 자주 하는 실수

### 실수 1: 유틸리티 함수에서 훅 사용

```jsx
// ❌ 잘못된 예
// src/utils/api.js
export async function fetchUser() {
  const [user, setUser] = useState(null);  // 에러!
  // ...
}

// ✅ 올바른 예
// src/utils/api.js
export async function fetchUser() {
  const response = await fetch('/api/user');
  return response.json();  // 일반 함수는 데이터만 반환
}

// 컴포넌트에서 사용
function UserProfile() {
  const [user, setUser] = useState(null);  // 컴포넌트에서 상태 관리
  
  useEffect(() => {
    fetchUser().then(setUser);  // 일반 함수 호출
  }, []);
}
```

### 실수 2: 이벤트 핸들러에서 직접 훅 사용

```jsx
// ❌ 잘못된 예
function Login() {
  return (
    <button onClick={() => {
      const [count, setCount] = useState(0);  // 에러! 이벤트 핸들러 안에서 훅 사용 불가
    }}>
      클릭
    </button>
  );
}

// ✅ 올바른 예
function Login() {
  const [count, setCount] = useState(0);  // 컴포넌트 최상위에서 훅 사용
  
  return (
    <button onClick={() => setCount(count + 1)}>
      클릭: {count}
    </button>
  );
}
```

---

## 마무리

**핵심 정리:**
- 훅은 React 컴포넌트 함수 안에서만 사용 가능
- 일반 JavaScript 함수에서는 사용 불가
- 컴포넌트 = JSX를 반환하는 함수
- 일반 함수 = 일반 값을 반환하는 함수

**기억할 점:**
- 컴포넌트 최상위에서만 호출
- 조건문/반복문 안에서 호출 금지
- 컴포넌트 함수에서만 사용 가능

더 궁금한 점이 있으면 언제든 질문해주세요! 🚀

