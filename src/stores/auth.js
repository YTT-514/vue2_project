import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 身份认证 store（纯前端演示：账号写死，实际项目应交给后端接口校验）
export const useAuthStore = defineStore('auth', () => {
  const AUTH_KEY = 'vue_profile_admin'

  // 登录用户：初始化自 sessionStorage，刷新后仍保持登录
  const authUser = ref(sessionStorage.getItem(AUTH_KEY) || '')

  // 是否已登录（路由守卫与界面显隐共用）
  const isLoggedIn = computed(() => !!authUser.value)

  // 校验用户名密码，成功则写入 sessionStorage 保持会话
  function login(username, password) {
    if (username === 'admin' && password === '123456') {
      authUser.value = username
      sessionStorage.setItem(AUTH_KEY, username)
      return true
    }
    return false
  }

  // 退出登录
  function logout() {
    authUser.value = ''
    sessionStorage.removeItem(AUTH_KEY)
  }

  return { authUser, isLoggedIn, login, logout }
})
