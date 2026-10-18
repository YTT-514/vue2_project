import { createPinia } from 'pinia'
import { persistPlugin } from './persist.js'

// 创建 Pinia 实例并注册持久化插件
// - 所有组件通过 useXxxStore() 拿到的是同一个 store 实例 → 跨组件共享
// - 插件把 state 同步到 localStorage → 跨刷新保留
const pinia = createPinia()
pinia.use(persistPlugin)

export default pinia
