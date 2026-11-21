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
    // 监听所有网卡，手机和同一 Wi-Fi 下的队友可以用 Network 地址访问
    host: true,
    watch: {
      // 忽略 .tmp，避免临时文件写入触发整页热更新
      ignored: ['**/.tmp/**'],
    },
  },
  build: {
    // 输出较保守的语法，避免 @media 被压成 width<=767px 这类新语法，
    // 保证在旧版浏览器（如 Chrome 90 左右）里响应式断点依然生效
    target: 'es2018',
    cssTarget: 'chrome87',
  },
})
