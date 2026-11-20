import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    // 输出较保守的语法，避免 @media 被压成 width<=767px 这类新语法，
    // 保证在旧版浏览器（如 Chrome 90 左右）里响应式断点依然生效
    target: 'es2018',
    cssTarget: 'chrome87',
  },
})
