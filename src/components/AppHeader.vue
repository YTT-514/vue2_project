<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

// 主题双向绑定
const theme = defineModel('theme')

const authStore = useAuthStore()

// 当前激活的导航项（父组件传入，用于高亮）
const props = defineProps({
  activeTab: { type: String, default: 'home' }
})

// 导航项配置：id 对应路由 name
// 末项按登录状态区分：访客只见「登录」，管理员登录后才出现「后台管理」修改入口
const navItems = computed(() => {
  const items = [
    { id: 'home', label: '个人信息' },
    { id: 'skills', label: '技能' },
    { id: 'interests', label: '兴趣' },
    { id: 'education', label: '学习经历' },
    { id: 'honors', label: '荣誉成就' },
    { id: 'projects', label: '项目展示' },
    { id: 'articles', label: '文章' }
  ]
  items.push(authStore.isLoggedIn ? { id: 'admin', label: '后台管理' } : { id: 'login', label: '登录' })
  return items
})
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <!-- 顶部导航栏：点击切换左侧板块 + 主题切换 -->
  <nav class="navbar">
    <div class="brand">个人<span>主页</span></div>
    <div class="nav-links">
      <!-- RouterLink 声明式导航：用命名路由生成链接，渲染成 <a>，无需手动拦截点击 -->
      <RouterLink
        v-for="item in navItems"
        :key="item.id"
        :to="{ name: item.id }"
        :class="{ active: props.activeTab === item.id }"
      >{{ item.label }}</RouterLink>
    </div>
    <button @click="toggleTheme">{{ theme === 'light' ? '🌙 暗色' : '☀️ 亮色' }}</button>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: var(--bar-bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 16px;
}
.navbar .brand { font-weight: 700; font-size: 18px; white-space: nowrap; }
.navbar .brand span { color: var(--accent); }

.nav-links {
  display: flex;
  gap: 18px;
  flex: 1;
  justify-content: center;
}
.nav-links a {
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 4px;
  border-bottom: 2px solid transparent;
  transition: color .2s, border-color .2s;
  white-space: nowrap;
}
.nav-links a:hover,
.nav-links a.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.navbar button {
  background: var(--chip);
  color: var(--chip-text);
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}
.navbar button:hover { opacity: .85; }

@media (max-width: 560px) {
  .nav-links { display: none; }
}
</style>
