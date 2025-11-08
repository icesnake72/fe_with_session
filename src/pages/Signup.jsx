import { Link } from "react-router-dom";
import { useState, useEffect } from "react"
import axios from "axios";

function Signup() {
  // 상태 정의
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ 비밀번호 확인용
  const [name, setName] = useState("");
  const [result, setResult] = useState(null); // 서버 응답 저장용
  const [errorMsg, setErrorMsg] = useState(""); // 비밀번호 불일치 시 표시
  const [isSuccess, setIsSuccess] = useState(false); // ✅ 성공 여부
  // const [userInfo, setUserInfo] = useState(null);    // ✅ 성공 시 유저 정보 저장

    // ✅ 비밀번호 입력 감지 시 자동 검증
  useEffect(() => {
    if (!confirmPassword) {
      setErrorMsg(""); // 비밀번호 확인 입력이 비어있으면 메시지 제거
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorMsg(""); // 일치하면 메시지 제거
    }
  }, [password, confirmPassword]); // 둘 중 하나라도 바뀌면 검사 실행

  // 회원가입 요청 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 비밀번호 확인 검사
    if (password !== confirmPassword) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    const data = { email, password, name };

    try {
      // ✅ axios를 사용한 POST 요청
      const response = await axios.post(
        "/api/users/signup",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000, // (선택) 요청 제한 시간 5초
        }
      );

      // 응답 처리 (axios는 자동으로 JSON 파싱)
      setResult(response.data);
      console.log("서버 응답:", response.data);

      // ✅ status 값이 success일 경우
      if (response.data.status === "success") {
        setIsSuccess(true);        
      } else {
        setErrorMsg("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("요청 실패:", error);

      // 서버 응답이 있는 에러인지 확인
      if (error.response) {
        setResult({
          status: "error",
          message: error.response.data?.message || "서버 오류 발생",
          code: error.response.status,
        });
      } else if (error.request) {
        setResult({
          status: "error",
          message: "서버 응답이 없습니다 (네트워크 문제)",
        });
      } else {
        setResult({
          status: "error",
          message: error.message,
        });
      }
    }
  };

  // ✅ 회원가입 성공 화면
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-96 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">회원가입 성공 🎉</h2>
          {/* <p className="mb-2">환영합니다, <strong>{userInfo.name}</strong>님!</p>
          <p className="text-sm text-gray-500 mb-6">{userInfo.email}</p> */}

          <Link
            to="/"
            className="inline-block px-4 py-2 rounded hover:bg-orange-300 transition"
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-96 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

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
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`border p-2 rounded ${
              confirmPassword && password !== confirmPassword
                ? "border-red-500"
                : ""
            }`}            
          />
          {/* 비밀번호 불일치 시 메시지 표시 */}
          {errorMsg && (
            <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>
          )}
          <input
            type="text"
            placeholder="닉네임"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />

          {/* 서버 응답 표시 */}
          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded text-sm text-left whitespace-pre-wrap">
              <strong>서버 응답:</strong>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          <button
            type="submit"
            className="mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            회원가입 완료
          </button>
        </form>
      
        {/* ✅ 홈으로 돌아가기 링크 */}
        <div className="mt-6 text-center">
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

export default Signup;