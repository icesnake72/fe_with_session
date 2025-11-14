/**
 * App.jsx - 메인 애플리케이션 컴포넌트
 * 
 * 이 파일은 React 애플리케이션의 진입점으로, 라우팅과 인증 상태 관리를 담당합니다.
 * 
 * 주요 기능:
 * 1. React Router를 사용한 페이지 라우팅 설정
 * 2. AuthProvider로 전체 앱을 감싸서 인증 상태를 전역적으로 관리
 * 3. 로그인 상태에 따라 홈 페이지 UI를 조건부로 렌더링
 */

import { Routes, Route, useNavigate } from 'react-router-dom'

import './index.css'
import './App.css'

// 페이지 컴포넌트들
import Signup from './pages/Signup'
import Login from './pages/Login'

// 인증 관련 컴포넌트 및 훅
// AuthProvider: 인증 상태를 전역적으로 관리하는 Context Provider
// useAuth: 인증 상태와 함수들(user, login, logout, isLoading)에 접근하는 커스텀 훅
import { AuthProvider } from './contexts/AuthContext.jsx'
import { useAuth } from './hooks/useAuth'


/**
 * Home 컴포넌트
 * 
 * 애플리케이션의 메인 홈 페이지입니다.
 * 
 * 동작 방식:
 * 1. useAuth 훅을 통해 현재 인증 상태를 가져옵니다
 *    - user: 현재 로그인한 사용자 정보 (null이면 비로그인 상태)
 *    - logout: 로그아웃 함수
 *    - isLoading: 세션 확인 중인지 여부
 * 
 * 2. 로딩 중일 때: "로딩 중..." 메시지 표시
 *    - 페이지가 처음 로드될 때 AuthProvider가 세션을 확인하는 동안 표시됩니다
 * 
 * 3. 로그인된 상태일 때:
 *    - 사용자 이름과 환영 메시지 표시
 *    - 로그아웃 버튼 표시
 * 
 * 4. 비로그인 상태일 때:
 *    - 로그인 버튼 (클릭 시 /login 페이지로 이동)
 *    - 회원가입 버튼 (클릭 시 /signup 페이지로 이동)
 */
function Home() {
  // React Router의 useNavigate 훅: 프로그래밍 방식으로 페이지 이동
  const navigate = useNavigate();
  
  // useAuth 훅을 통해 인증 상태와 함수들에 접근
  // 이 훅은 AuthContext에서 제공하는 값을 반환합니다:
  // - user: { id, email, name } 형태의 사용자 객체 또는 null
  // - logout: 로그아웃 함수 (서버에 로그아웃 요청 후 상태 초기화)
  // - isLoading: boolean - 세션 확인 중인지 여부
  const { user, logout, isLoading } = useAuth();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 justify-center box-border size-96 border-2 rounded-md p-4 shadow-xl/20">
        <p className="text-center">로딩 중...</p>
      </div>
    );
  }

  // 로그인된 상태
  if (user) {
    return (
      <div className="flex flex-col gap-6 justify-center box-border size-96 border-2 rounded-md p-4 shadow-xl/20">
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        <div className="flex flex-col gap-4">
          <p className="text-lg text-center">
            <strong>{user.name || user.email}</strong>님, 반갑습니다.
          </p>
          <button
            onClick={logout}
            className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 상태
  return (
    <>
      <div className="flex flex-col gap-6 justify-center box-border size-96 border-2 rounded-md p-4 shadow-xl/20">
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            로그인
          </button>

          <button
            onClick={()=>navigate('/signup')}
            className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            회원가입
          </button>
        </div>
      </div>
    </>
  )
}

/**
 * App 컴포넌트
 * 
 * 애플리케이션의 최상위 컴포넌트입니다.
 * 
 * 구조:
 * 1. AuthProvider로 전체 앱을 감쌉니다
 *    - 이렇게 하면 모든 하위 컴포넌트에서 useAuth 훅을 사용할 수 있습니다
 *    - AuthProvider는 마운트될 때 자동으로 세션을 확인합니다 (/api/users/session)
 * 
 * 2. Routes 컴포넌트로 라우팅을 설정합니다
 *    - "/": 홈 페이지 (Home 컴포넌트)
 *    - "/signup": 회원가입 페이지 (Signup 컴포넌트)
 *    - "/login": 로그인 페이지 (Login 컴포넌트)
 * 
 * 인증 흐름:
 * 1. 앱이 시작되면 AuthProvider가 자동으로 세션을 확인합니다
 * 2. 세션이 유효하면 사용자 정보를 가져와서 user 상태에 저장합니다
 * 3. 세션이 없거나 만료되었으면 user는 null이 됩니다
 * 4. 로그인 성공 시 Login 컴포넌트에서 login() 함수를 호출하여 user 상태를 업데이트합니다
 * 5. 로그아웃 시 logout() 함수가 서버에 요청을 보내고 user 상태를 null로 설정합니다
 */
function App() {
  return (
    // AuthProvider로 전체 앱을 감싸서 인증 상태를 전역적으로 관리
    // 이 Provider 내부의 모든 컴포넌트는 useAuth 훅을 통해 인증 상태에 접근할 수 있습니다
    <AuthProvider>
      {/* React Router의 Routes 컴포넌트: URL 경로에 따라 다른 컴포넌트를 렌더링 */}
      <Routes>
        {/* 홈 페이지: 로그인 상태에 따라 다른 UI를 보여줍니다 */}
        <Route path="/" element={<Home />} />
        
        {/* 회원가입 페이지: 새 사용자를 등록합니다 */}
        <Route path="/signup" element={<Signup />} />
        
        {/* 로그인 페이지: 기존 사용자의 인증을 처리합니다 */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
