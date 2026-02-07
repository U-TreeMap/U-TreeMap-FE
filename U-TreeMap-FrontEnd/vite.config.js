import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),svgr()],
  server: {
    port: 5173,   // 원하는 포트 번호
    strictPort: true,   // 포트 막혀있으면 실행 x
  },
})
