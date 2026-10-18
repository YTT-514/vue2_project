import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  base: '/vue2_project/',
  plugins: [
    vue(),
    VueDevTools()   // 浏览器内置版 Vue DevTools：无需安装浏览器扩展
  ]
})