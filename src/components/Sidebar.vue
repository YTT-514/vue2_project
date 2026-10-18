<script setup>
// 左侧导航栏：使用 Element Plus 的 el-menu 组件实现导航
// el-menu 设置 :router="true" 后，点击 el-menu-item 会自动以 index 作为路由路径跳转
defineProps({
  activeTab: { type: String, default: 'home' }
})

// 菜单项：index 对应路由 name，icon 使用 Element Plus 图标组件名
const tabs = [
  { index: 'home', label: '个人信息', icon: 'HomeFilled' },
  { index: 'skills', label: '技能', icon: 'Cpu' },
  { index: 'interests', label: '兴趣', icon: 'BrushFilled' },
  { index: 'education', label: '学习经历', icon: 'Reading' },
  { index: 'honors', label: '荣誉成就', icon: 'Trophy' },
  { index: 'projects', label: '项目展示', icon: 'Files' },
  { index: 'articles', label: '文章', icon: 'Document' }
]
</script>

<template>
  <aside class="sidebar">
    <!-- el-menu：导航菜单组件
         :router="true" → 点击菜单项自动以 index 作路径跳转
         :default-active → 当前激活的菜单项 index
         active-text-color → 激活项文字颜色 -->
    <el-menu
      :default-active="activeTab"
      :router="true"
      background-color="transparent"
      text-color="var(--text)"
      active-text-color="var(--accent)"
    >
      <el-menu-item
        v-for="tab in tabs"
        :key="tab.index"
        :index="tab.index"
      >
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
  padding: 16px 12px;
  background: var(--card);
  border-right: 1px solid var(--border);
  border-radius: 0;
  box-shadow: none;
  align-self: stretch;
}
/* 覆盖 el-menu 默认样式，适配项目主题 */
.sidebar :deep(.el-menu) {
  border-right: none;
  background: transparent;
}
.sidebar :deep(.el-menu-item) {
  border-radius: 10px;
  margin-bottom: 4px;
  height: 44px;
  line-height: 44px;
}
.sidebar :deep(.el-menu-item.is-active) {
  background: var(--accent);
  color: #fff !important;
  font-weight: 600;
}
</style>
