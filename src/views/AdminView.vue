<script setup>
import { useRouter } from 'vue-router'
import { useProjectsStore } from '../stores/projects.js'
import { useArticlesStore } from '../stores/articles.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const projectsStore = useProjectsStore()
const articlesStore = useArticlesStore()
const authStore = useAuthStore()

// ---------- 退出登录 ----------
function handleLogout() {
  authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-head">
      <div>
        <h2 class="admin-title">⚙️ 后台管理</h2>
        <p class="admin-sub">当前登录：admin · 保存后前台页面实时同步</p>
      </div>
      <button class="btn-logout" @click="handleLogout">退出登录</button>
    </div>

    <!-- 页签导航：RouterLink 跳转嵌套子路由，active-class 命中当前子页面时高亮 -->
    <div class="admin-tabs">
      <RouterLink :to="{ name: 'admin-profile' }" class="admin-tab" active-class="active">
        个人简介
      </RouterLink>
      <RouterLink :to="{ name: 'admin-projects' }" class="admin-tab" active-class="active">
        项目信息（{{ projectsStore.projects.length }}）
      </RouterLink>
      <RouterLink :to="{ name: 'admin-articles' }" class="admin-tab" active-class="active">
        文章管理（{{ articlesStore.articles.length }}）
      </RouterLink>
    </div>

    <!-- 嵌套路由出口：/admin/profile 或 /admin/projects 匹配到的子组件渲染在这里 -->
    <div class="panel">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.admin-page { display: flex; flex-direction: column; gap: 16px; }
.admin-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.admin-title { margin: 0; font-size: 22px; }
.admin-sub { margin: 4px 0 0; font-size: 13px; color: var(--sub); }
.btn-logout {
  background: var(--chip);
  color: var(--chip-text);
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}
.btn-logout:hover { opacity: .85; }

.admin-tabs { display: flex; gap: 8px; }
.admin-tab {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
}
.admin-tab.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 20px;
}
</style>
