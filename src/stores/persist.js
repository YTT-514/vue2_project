// Pinia 持久化插件：把每个 store 的 state 自动同步到 localStorage
// 作用：跨组件共享（Pinia 单例）+ 跨刷新保留（localStorage 快照）
const STORAGE_PREFIX = 'pinia:'
// 黑名单：这些 store 不走 localStorage
// auth 用 sessionStorage 维持「关闭浏览器即登出」的会话级语义
const SKIP_STORES = ['auth']

/**
 * @param {{ store: import('pinia').Store } } context
 * Pinia 插件在每个 store 首次创建时执行一次，此时 state 已初始化
 */
export function persistPlugin({ store }) {
  const key = STORAGE_PREFIX + store.$id
  if (SKIP_STORES.includes(store.$id)) return

  // 1. 初始化恢复：用 localStorage 中的快照覆盖当前 state
  //    store.$patch 会递归合并，对 ref 设置 .value，对 reactive 合并字段
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      store.$patch(JSON.parse(saved))
    } catch (e) {
      console.warn(`[persist] 恢复 ${store.$id} 失败:`, e)
      localStorage.removeItem(key) // 快照损坏则丢弃，避免反复报错
    }
  }

  // 2. 订阅变化：state 一旦改变就写回 localStorage
  //    $subscribe 在任意 mutation 后触发；加 300ms 防抖避免高频写入
  let timer = null
  store.$subscribe((_mutation, state) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state))
      } catch (e) {
        console.warn(`[persist] 保存 ${store.$id} 失败:`, e)
      }
    }, 300)
  })
}
