import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const data = { email, password };

    try {
      const response = await axios.post(
        "/api/users/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 세션 쿠키를 포함하기 위해 필요
          timeout: 5000,
        }
      );

      console.log("서버 응답:", response.data);

      // 로그인 성공 시
      if (response.data.status === "success") {
        // 사용자 정보 저장 (content 필드에서 가져옴)
        const userInfo = response.data.content;
        if (userInfo) {
          login(userInfo);
          // 홈으로 이동
          navigate("/");
        } else {
          setErrorMsg("사용자 정보를 가져올 수 없습니다.");
        }
      } else {
        setErrorMsg(response.data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);

      if (error.response) {
        setErrorMsg(
          error.response.data?.message || "로그인에 실패했습니다. 다시 시도해주세요."
        );
      } else if (error.request) {
        setErrorMsg("서버 응답이 없습니다 (네트워크 문제)");
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-96 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />

          {errorMsg && (
            <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/signup"
            className="text-blue-500 hover:underline hover:text-blue-700 transition"
          >
            회원가입
          </Link>
          <span className="mx-2">|</span>
          <Link
            to="/"
            className="text-blue-500 hover:underline hover:text-blue-700 transition"
          >
            ← 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

