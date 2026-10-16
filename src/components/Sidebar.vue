<script setup>
// 左侧导航：Element Plus el-menu 垂直菜单
// 未开启 router 模式，改用 @select 回调做「命名路由」跳转，保留原有 activeTab 高亮逻辑
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  activeTab: { type: String, default: 'home' }
})

// icon 用 Element Plus 图标组件名（已在 main.js 全局注册，<component :is="名称"> 可直接渲染）
const tabs = [
  { id: 'home', label: '个人信息', icon: 'HomeFilled' },
  { id: 'skills', label: '技能', icon: 'Monitor' },
  { id: 'interests', label: '兴趣', icon: 'Picture' },
  { id: 'education', label: '学习经历', icon: 'Reading' },
  { id: 'honors', label: '荣誉成就', icon: 'Trophy' },
  { id: 'projects', label: '项目展示', icon: 'Suitcase' },
  { id: 'articles', label: '文章', icon: 'Document' }
]

function onSelect(index) {
  router.push({ name: index })
}
</script>

<template>
  <aside class="sidebar">
    <!-- el-menu：菜单组件；default-active 与当前路由联动实现高亮 -->
    <el-menu class="side-menu" :default-active="activeTab" @select="onSelect">
      <el-menu-item v-for="tab in tabs" :key="tab.id" :index="tab.id">
        <el-icon><component :is="tab.icon" /></el-icon>
        <span>{{ tab.label }}</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: 16px 8px;
  background: var(--card);
  border-right: 1px solid var(--border);
  align-self: stretch;
}
.side-menu {
  border-right: none;
  background: transparent;
  /* Element Plus 菜单的 CSS 变量：让菜单跟随项目主题配色 */
  --el-menu-text-color: var(--text);
  --el-menu-hover-bg-color: var(--chip);
  --el-menu-active-color: #fff;
  --el-menu-item-height: 48px;
}
.side-menu :deep(.el-menu-item) {
  border-radius: 10px;
  margin-bottom: 6px;
}
.side-menu :deep(.el-menu-item.is-active) {
  background: var(--accent);
  font-weight: 600;
}
</style>
