import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/Newrrow-Soft/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ 여기서 @ -> src 로 매핑
    },
  },
})