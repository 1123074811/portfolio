import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages 子路径部署：项目页需设 base 为 '/<仓库名>/'，
// 用户主页(username.github.io)则用 '/'。通过环境变量 VITE_BASE 注入，默认 '/'。
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
