import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', // 백엔드 서버 주소
        changeOrigin: true,              // origin 헤더 변경 허용
        secure: false,                   // HTTPS 인증 무시 (HTTP라면 필요 없음)
      },
    },
  },
})
