import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Newrrow-Soft/',   // 레포명이 루트 경로가 됨
  build: { outDir: 'docs' } // 빌드 산출물을 /docs에 출력
})