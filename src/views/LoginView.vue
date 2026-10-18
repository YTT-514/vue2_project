<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

function submit() {
  if (!username.value.trim() || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }
  if (authStore.login(username.value.trim(), password.value)) {
    // 登录成功：回跳到守卫重定向前想访问的页面（?redirect=/admin），默认进后台
    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
        ? route.query.redirect
        : '/admin'
    router.push(redirect)
  } else {
    error.value = '用户名或密码错误'
  }
}
</script>

<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="submit">
      <h2 class="login-title">🔐 后台登录</h2>
      <p class="login-sub">登录后可管理个人简介与项目信息</p>

      <label class="field">
        <span>用户名</span>
        <input v-model="username" type="text" placeholder="admin" autocomplete="username" />
      </label>
      <label class="field">
        <span>密码</span>
        <input v-model="password" type="password" placeholder="123456" autocomplete="current-password" />
      </label>

      <p v-if="error" class="login-error">{{ error }}</p>

      <button type="submit" class="login-btn">登 录</button>

      <p class="login-hint">演示账号：admin　密码：123456</p>
      <router-link class="back-link" to="/">← 返回个人主页</router-link>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.login-card {
  width: 100%;
  max-width: 360px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 28px;
  display: grid;
  gap: 14px;
}
.login-title { margin: 0; text-align: center; }
.login-sub {
  margin: -6px 0 6px;
  text-align: center;
  font-size: 13px;
  color: var(--sub);
}
.field { display: grid; gap: 6px; font-size: 13px; color: var(--sub); }
.field input {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
}
.login-error {
  margin: 0;
  font-size: 13px;
  color: #ef4444;
  text-align: center;
}
.login-btn {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}
.login-btn:hover { opacity: .9; }
.login-hint {
  margin: 0;
  text-align: center;
  font-size: 12px;
  color: var(--sub);
}
.back-link {
  text-align: center;
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;
}
.back-link:hover { text-decoration: underline; }
</style>
