/**
 * AuthContext.jsx - 인증 상태 관리 Context Provider
 * 
 * 이 파일은 React Context API를 사용하여 애플리케이션 전역에서 인증 상태를 관리합니다.
 * 
 * 주요 역할:
 * 1. 사용자 로그인 상태 관리 (user 상태)
 * 2. 세션 자동 확인 (페이지 로드 시)
 * 3. 로그인/로그아웃 함수 제공
 * 4. 로딩 상태 관리
 * 
 * 동작 방식:
 * - 컴포넌트가 마운트되면 자동으로 서버에 세션 확인 요청을 보냅니다
 * - 세션이 유효하면 사용자 정보를 가져와서 상태에 저장합니다
 * - 로그인/로그아웃 시 상태를 업데이트합니다
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

/**
 * AuthProvider 컴포넌트
 * 
 * 인증 상태를 관리하는 Context Provider입니다.
 * 
 * @param {React.ReactNode} children - 이 Provider로 감싸진 하위 컴포넌트들
 * 
 * 제공하는 값 (Context Value):
 * - user: 현재 로그인한 사용자 정보 객체 { id, email, name } 또는 null
 * - login: 로그인 함수 (userInfo를 받아서 상태를 업데이트)
 * - logout: 로그아웃 함수 (서버에 로그아웃 요청 후 상태 초기화)
 * - isLoading: 세션 확인 중인지 여부 (boolean)
 * 
 * 상태 관리:
 * - user: 사용자 정보를 저장하는 상태
 *   - null: 비로그인 상태
 *   - 객체: 로그인 상태 (id, email, name 포함)
 * - isLoading: 세션 확인이 진행 중인지 여부
 *   - true: 세션 확인 중 (로딩 화면 표시)
 *   - false: 세션 확인 완료
 */
export function AuthProvider({ children }) {
  // 사용자 정보 상태: 로그인된 사용자 정보 또는 null
  // 초기값은 null (비로그인 상태)
  const [user, setUser] = useState(null);
  
  // 로딩 상태: 세션 확인이 진행 중인지 여부
  // 초기값은 true (컴포넌트 마운트 시 세션 확인을 시작하므로)
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 컴포넌트 마운트 시 세션 확인
   * 
   * useEffect 훅을 사용하여 컴포넌트가 마운트될 때 한 번만 실행됩니다.
   * 의존성 배열이 비어있으므로 컴포넌트가 처음 렌더링될 때만 실행됩니다.
   * 
   * 동작:
   * 1. 페이지가 로드되거나 새로고침될 때 자동으로 실행됩니다
   * 2. 서버에 세션 확인 요청을 보냅니다 (/api/users/session)
   * 3. 세션이 유효하면 사용자 정보를 가져와서 user 상태를 업데이트합니다
   * 4. 세션이 없거나 만료되었으면 user를 null로 설정합니다
   */
  useEffect(() => {
    checkSession();
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  /**
   * 세션 확인 함수
   * 
   * 서버에 현재 세션이 유효한지 확인하고, 유효하면 사용자 정보를 가져옵니다.
   * 
   * 동작 과정:
   * 1. GET /api/users/session 요청을 보냅니다
   *    - withCredentials: true로 설정하여 JSESSIONID 쿠키를 자동으로 포함합니다
   * 
   * 2. 성공 응답 처리:
   *    - response.data.status === "success"인 경우
   *    - response.data.content에서 사용자 정보를 가져옵니다
   *    - 사용자 정보를 user 상태에 저장합니다
   * 
   * 3. 실패 처리:
   *    - 네트워크 에러 또는 세션이 없는 경우
   *    - user를 null로 설정하여 비로그인 상태로 만듭니다
   * 
   * 4. finally 블록:
   *    - 성공/실패 여부와 관계없이 isLoading을 false로 설정합니다
   *    - 이렇게 하면 로딩 화면이 사라지고 실제 콘텐츠가 표시됩니다
   */
  const checkSession = async () => {
    try {
      const response = await axios.get("/api/users/session", {
        withCredentials: true,
      });
      
      console.log("세션 확인 응답:", response.data);
      
      if (response.data.status === "success") {
        // content 필드 우선 확인
        if (response.data.content) {
          console.log("사용자 정보 설정:", response.data.content);
          setUser(response.data.content);
        } else if (response.data.user) {
          // 호환성을 위해 user 필드도 확인
          console.log("사용자 정보 설정 (user 필드):", response.data.user);
          setUser(response.data.user);
        } else {
          console.warn("세션 확인 응답에 사용자 정보가 없습니다:", response.data);
        }
      } else {
        console.warn("세션 확인 실패 - status가 success가 아님:", response.data);
        setUser(null);
      }
    } catch (error) {
      console.error("세션 확인 실패:", error);
      if (error.response) {
        console.error("응답 상태:", error.response.status);
        console.error("응답 데이터:", error.response.data);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그인 함수
   * 
   * 로그인 성공 후 사용자 정보를 상태에 저장합니다.
   * 이 함수는 Login 컴포넌트에서 호출됩니다.
   * 
   * @param {Object} userInfo - 사용자 정보 객체 { id, email, name }
   * 
   * 사용 예시:
   * const { login } = useAuth();
   * login({ id: 1, email: "user@example.com", name: "홍길동" });
   */
  const login = (userInfo) => {
    setUser(userInfo);
  };

  /**
   * 로그아웃 함수
   * 
   * 서버에 로그아웃 요청을 보내고, 로컬 상태를 초기화합니다.
   * 
   * 동작 과정:
   * 1. POST /api/users/logout 요청을 보냅니다
   *    - withCredentials: true로 설정하여 JSESSIONID 쿠키를 포함합니다
   * 
   * 2. 성공 응답 처리:
   *    - response.data.status === "success" 또는 status === 200인 경우
   *    - user 상태를 null로 설정합니다
   *    - 클라이언트 측에서도 쿠키 삭제를 시도합니다 (HttpOnly 쿠키는 삭제되지 않을 수 있음)
   * 
   * 3. 에러 처리:
   *    - 네트워크 에러가 발생해도 로컬 상태는 초기화합니다
   *    - 서버 세션은 서버에서 처리되므로, 클라이언트 상태만 초기화해도 됩니다
   * 
   * 주의사항:
   * - JSESSIONID 쿠키는 HttpOnly로 설정되어 있을 수 있어서
   *   클라이언트에서 완전히 삭제되지 않을 수 있습니다.
   * - 서버가 응답 헤더에 Set-Cookie로 쿠키를 삭제해야 합니다.
   */
  const logout = async () => {
    try {
      const response = await axios.post(
        "/api/users/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      console.log("로그아웃 응답:", response.data);
      
      // 성공 시에만 로그아웃 처리
      if (response.data.status === "success" || response.status === 200) {
        setUser(null);
        
        // 쿠키 삭제 시도 (HttpOnly 쿠키는 서버에서만 삭제 가능하지만, 일반 쿠키는 클라이언트에서도 삭제 가능)
        // JSESSIONID는 보통 HttpOnly이므로 클라이언트에서 삭제되지 않을 수 있음
        // 서버가 Set-Cookie 헤더로 쿠키를 삭제해야 함
        document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
        
        console.log("로그아웃 성공");
      } else {
        console.warn("로그아웃 실패 - status가 success가 아님:", response.data);
      }
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
      if (error.response) {
        console.error("응답 상태:", error.response.status);
        console.error("응답 데이터:", error.response.data);
      }
      // 에러가 발생해도 로컬 상태는 초기화
      setUser(null);
      
      // 쿠키 삭제 시도
      document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
    }
  };

  /**
   * Context Provider 렌더링
   * 
   * AuthContext.Provider를 사용하여 인증 상태와 함수들을 하위 컴포넌트에 제공합니다.
   * 
   * 제공하는 값:
   * - user: 현재 사용자 정보 또는 null
   * - login: 로그인 함수
   * - logout: 로그아웃 함수
   * - isLoading: 로딩 상태
   * 
   * 하위 컴포넌트에서는 useAuth 훅을 사용하여 이 값들에 접근할 수 있습니다.
   */
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

