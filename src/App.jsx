// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Routes, Route, useNavigate } from 'react-router-dom'

import './index.css'
import './App.css'

import Signup from './pages/Signup'


function Home() {
  const navigate = useNavigate();
  // 상태값(state)으로 현재 텍스트를 관리
  // const [message, setMessage] = useState("Hello react");

  // 버튼 클릭시 메시지를 토글하는 함수
  // const handleClick = () => {
  //   setMessage((prev) => prev==='Hello react' ? "Hello vite" : "Hello react");
  // }

  return (
    <>
      <div class="flex flex-col gap-6 justify-center box-border size-96 border-2 rounded-md p-4 shadow-xl/20">
        {/* <button onClick={handleClick}>Hello react!</button>
        <p className='text-xl font-semibold'>{message}</p> */}
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>

        <div className="flex flex-col gap-4">
          <button
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
