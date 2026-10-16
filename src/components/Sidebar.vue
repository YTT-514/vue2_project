<script setup>
// 左侧导航栏：RouterLink 声明式导航，点击通过命名路由跳转对应页面
// props: activeTab 当前激活项（用于高亮）
defineProps({
  activeTab: { type: String, default: 'home' }
})
const tabs = [
  { id: 'home', label: '个人信息', icon: '🏠' },
  { id: 'skills', label: '技能', icon: '💻' },
  { id: 'interests', label: '兴趣', icon: '🎨' },
  { id: 'education', label: '学习经历', icon: '📚' },
  { id: 'honors', label: '荣誉成就', icon: '🏆' },
  { id: 'projects', label: '项目展示', icon: '🛠' },
  { id: 'articles', label: '文章', icon: '📝' }
]
</script>

<template>
  <aside class="sidebar">
    <!-- RouterLink 渲染为 <a>，:to 传命名路由对象，点击即路由跳转 -->
    <RouterLink
      v-for="tab in tabs"
      :key="tab.id"
      :to="{ name: tab.id }"
      :class="['side-item', { active: activeTab === tab.id }]"
    >
      <span class="icon">{{ tab.icon }}</span>
      <span class="label">{{ tab.label }}</span>
    </RouterLink>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  padding: 16px 12px;
  background: var(--card);
  border-right: 1px solid var(--border);
  /* 去掉圆角和阴影，让侧栏与内容区紧挨、高度撑满 */
  border-radius: 0;
  box-shadow: none;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.side-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  color: var(--text);
  text-decoration: none; /* RouterLink 渲染为 <a>，去掉默认下划线 */
  transition: background .2s, color .2s;
}
.side-item:hover {
  background: var(--chip);
  color: var(--chip-text);
}
.side-item.active {
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}
.side-item .icon { font-size: 18px; }
</style>
