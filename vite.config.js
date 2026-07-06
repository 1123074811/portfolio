import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 默认使用相对资源路径，让同一份 dist 同时适配：
// - GitHub Pages 项目页：https://username.github.io/portfolio/
// - 国内 OSS/COS + CDN 根路径或子路径
// 如确实需要绝对路径，可通过环境变量 VITE_BASE 覆盖。
export default defineConfig({
  base: process.env.VITE_BASE || './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
