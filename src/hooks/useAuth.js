/**
 * useAuth.js - 인증 상태 접근 커스텀 훅
 * 
 * 이 파일은 AuthContext에 접근하기 위한 커스텀 훅을 제공합니다.
 * 
 * 사용 목적:
 * - AuthContext를 직접 사용하는 대신 이 훅을 사용하면 더 간편하고 안전합니다
 * - AuthProvider 밖에서 사용하면 에러를 발생시켜 실수를 방지합니다
 * 
 * 반환 값:
 * - user: 현재 로그인한 사용자 정보 { id, email, name } 또는 null
 * - login: 로그인 함수 (userInfo를 받아서 상태 업데이트)
 * - logout: 로그아웃 함수 (서버에 요청 후 상태 초기화)
 * - isLoading: 세션 확인 중인지 여부 (boolean)
 * 
 * 사용 예시:
 * ```jsx
 * function MyComponent() {
 *   const { user, logout, isLoading } = useAuth();
 *   
 *   if (isLoading) return <div>로딩 중...</div>;
 *   if (user) return <div>안녕하세요, {user.name}님!</div>;
 *   return <div>로그인이 필요합니다</div>;
 * }
 * ```
 */

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.js";

/**
 * useAuth 커스텀 훅
 * 
 * AuthContext에서 인증 상태와 함수들을 가져옵니다.
 * 
 * @returns {Object} 인증 상태와 함수들
 * @throws {Error} AuthProvider 밖에서 사용하면 에러 발생
 * 
 * 반환 객체 구조:
 * {
 *   user: Object | null,      // 사용자 정보 또는 null
 *   login: Function,           // 로그인 함수
 *   logout: Function,          // 로그아웃 함수
 *   isLoading: boolean         // 로딩 상태
 * }
 */
export function useAuth() {
  // useContext를 사용하여 AuthContext에서 값을 가져옵니다
  const context = useContext(AuthContext);
  
  // AuthProvider 밖에서 사용하면 context가 null이 됩니다
  // 이 경우 에러를 발생시켜 개발자가 실수를 인지할 수 있도록 합니다
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // context에는 { user, login, logout, isLoading }이 포함되어 있습니다
  return context;
}

