<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth.js'

// 主题双向绑定
const theme = defineModel('theme')

const router = useRouter()
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

// el-menu 未开启 router 模式：@select 拿到 index（即导航 id），用命名路由跳转
function onSelect(index) {
  router.push({ name: index })
}
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <nav class="navbar">
    <div class="brand">个人<span>主页</span></div>

    <!-- el-menu（horizontal 模式）：顶部导航菜单；:ellipsis="false" 禁止折叠成「更多」 -->
    <el-menu
      class="nav-menu"
      mode="horizontal"
      :default-active="props.activeTab"
      :ellipsis="false"
      @select="onSelect"
    >
      <el-menu-item v-for="item in navItems" :key="item.id" :index="item.id">{{ item.label }}</el-menu-item>
    </el-menu>

    <!-- el-button：主题切换按钮，:icon 绑定 Element Plus 图标组件 -->
    <el-button round :icon="theme === 'light' ? Moon : Sunny" @click="toggleTheme">
      {{ theme === 'light' ? '暗色' : '亮色' }}
    </el-button>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;
  background: var(--bar-bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 16px;
}
.navbar .brand { font-weight: 700; font-size: 18px; white-space: nowrap; }
.navbar .brand span { color: var(--accent); }

.nav-menu {
  flex: 1;
  border-bottom: none;
  background: transparent;
  justify-content: center;
  --el-menu-horizontal-height: 46px;
  --el-menu-text-color: var(--text);
  --el-menu-active-color: var(--accent);
  --el-menu-hover-text-color: var(--accent);
  --el-menu-hover-bg-color: transparent;
}
.nav-menu :deep(.el-menu-item) {
  font-size: 14px;
  border-bottom: 2px solid transparent;
}
.nav-menu :deep(.el-menu-item.is-active) {
  border-bottom-color: var(--accent);
}

@media (max-width: 560px) {
  .nav-menu { display: none; }
}
</style>
