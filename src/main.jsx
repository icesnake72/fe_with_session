import { StrictMode } from 'react'  // 여러개 중 한개의 컴포넌트(StrictMode)를 가져옴
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // 주석?
  <StrictMode>  {/* 개발 전용 react 진단용 컴포넌트 */}
    <BrowserRouter>
      <App />     {/* App.jsx에서 export하는 컴포넌트를 렌더링 */}
    </BrowserRouter>    
  </StrictMode>,
)
