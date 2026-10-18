import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from './stores/index.js'   // Pinia 实例（已注册持久化插件）
import App from './App.vue'
import router from './router'
import './assets/common.css'

const app = createApp(App)

app.use(pinia)   // 注册 Pinia + localStorage 持久化插件
app.use(ElementPlus, { locale: zhCn })   // 注册 Element Plus + 中文语言包

// 全局注册所有 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.mount('#app')
