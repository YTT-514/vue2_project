<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/AppLayout.vue'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()

// 当前激活板块由路由决定（route.name 与导航 id 一一对应）
// 详情页和后台子页面（嵌套路由）没有同名导航项，映射回所属的导航 id 保持高亮
const activeTab = computed(() => {
  const name = String(route.name || '')
  if (name === 'project-detail') return 'projects' // /projects/:id → 项目展示
  if (name === 'article-detail') return 'articles' // /articles/:id → 文章
  if (name.startsWith('admin')) return 'admin'     // /admin/profile 等 → 后台管理
  return name || 'home'
})

// 布局模式：登录页 meta.layout = 'blank'，使用空白布局（无顶栏/侧栏）；其余页面用主布局
const layoutMode = computed(() => route.meta.layout || 'main')

// 主题（父组件持有，通过 v-model:theme 传给 AppLayout → AppHeader）
const theme = ref('light')
watch(theme, (val) => {
  document.documentElement.setAttribute('data-theme', val)
}, { immediate: true })

onMounted(() => {
  console.log('[mounted] 个人主页已加载完成，欢迎你！✅')
})
</script>

<template>
  <!-- 空白布局：登录页（meta.layout = 'blank'）不渲染顶栏/侧栏/底栏 -->
  <router-view v-if="layoutMode === 'blank'" />

  <!-- 主布局：顶部导航 + 左侧导航 + 内容区（导航跳转由 RouterLink 声明式完成） -->
  <AppLayout v-else v-model:theme="theme" :active-tab="activeTab">
    <div class="main-layout">
      <!-- 左侧导航列表 -->
      <Sidebar :active-tab="activeTab" />

      <!-- 右侧内容区：路由视图渲染对应页面 -->
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </AppLayout>
</template>

<style>
:root {
  --bg: #eff6ff;
  --page-bg: radial-gradient(circle at center, #ffffff 0%, #ffffff 50%, #dbeafe 100%);
  --bar-bg: #dbeafe;
  --card: #ffffff;
  --text: #1f2937;
  --sub: #6b7280;
  --border: #dbeafe;
  --accent: #3b82f6;
  --chip: #e0e7ff;
  --chip-text: #3730a3;
  --shadow: 0 10px 25px rgba(59, 130, 246, 0.12);
}
[data-theme="dark"] {
  --bg: #0f1e3d;
  --page-bg: linear-gradient(160deg, #0f1e3d 0%, #1e3a8a 100%);
  --bar-bg: #1e3a8a;
  --card: #1a2a4a;
  --text: #e0e7ff;
  --sub: #94a3b8;
  --border: #2a3f6a;
  --accent: #60a5fa;
  --chip: #1e3a8a;
  --chip-text: #dbeafe;
  --shadow: 0 10px 25px rgba(0,0,0,0.4);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: var(--page-bg);
  color: var(--text);
  min-height: 100vh;
  font-size: 15px;
  transition: background .3s, color .3s;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
/* 左右布局：左侧导航贴最左 + 右侧内容平铺占满，两个模块紧挨 */
.main-layout {
  margin: 0;
  display: flex;
  gap: 0;
  width: 100%;
  flex: 1;
  min-height: 0;
}
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  padding: 24px 32px;
}

/* 窄屏时侧栏折叠到顶部 */
@media (max-width: 720px) {
  .main-layout {
    flex-direction: column;
  }
  .content-area {
    padding: 16px;
  }
}
</style>
