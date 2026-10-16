import { createApp } from 'vue'
import pinia from './stores/index.js'   // Pinia 实例（已注册持久化插件）
import App from './App.vue'
import router from './router'
// Element Plus：完整引入 + 中文语言包 + 全量图标
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './assets/common.css'

const app = createApp(App)
app.use(pinia)   // 注册 Pinia + localStorage 持久化插件
app.use(router)
app.use(ElementPlus, { locale: zhCn })   // 全局注册所有 el-* 组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)   // 图标全局可用：<el-icon><Plus /></el-icon>
}
app.mount('#app')
