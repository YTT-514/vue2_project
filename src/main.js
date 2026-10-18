import { createApp } from 'vue'
import pinia from './stores/index.js'   // Pinia 实例（已注册持久化插件）
import App from './App.vue'
import router from './router'
import './assets/common.css'

const app = createApp(App)
app.use(pinia)   // 注册 Pinia + localStorage 持久化插件
app.use(router)
app.mount('#app')
