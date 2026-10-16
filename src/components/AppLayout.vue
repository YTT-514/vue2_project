<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

// 主题双向绑定（透传给 AppHeader）
const theme = defineModel('theme')

// 当前激活的导航项（透传给 AppHeader 做高亮）
defineProps({
  activeTab: { type: String, default: 'home' }
})
</script>

<template>
  <!-- 导航跳转由 AppHeader 内的 RouterLink 直接完成，无需再向上冒泡事件 -->
  <AppHeader v-model:theme="theme" :active-tab="activeTab" />
  <slot />
  <AppFooter />
</template>
