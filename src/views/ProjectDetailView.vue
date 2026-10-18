<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'
import { useProjectsStore } from '../stores/projects.js'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)

// 读取动态路由参数 :id，用 computed 包裹——
// 在不同项目详情间跳转时组件会被复用，computed 能响应参数变化自动更新
const project = computed(() => projectsStore.getProjectById(route.params.id))

// 上一个 / 下一个项目（在详情页之间直接切换，体验动态路由复用组件的效果）
const prevProject = computed(() => {
  const idx = projects.value.findIndex(p => p.id === route.params.id)
  return idx > -1 ? projects.value[(idx - 1 + projects.value.length) % projects.value.length] : null
})
const nextProject = computed(() => {
  const idx = projects.value.findIndex(p => p.id === route.params.id)
  return idx > -1 ? projects.value[(idx + 1) % projects.value.length] : null
})

function goProject(id) {
  router.push({ name: 'project-detail', params: { id } })
}

function goBack() {
  router.push({ name: 'projects' })
}
</script>

<template>
  <!-- 项目不存在（URL 手输错误 id）：显示 404 提示 -->
  <BaseCard v-if="!project" title="项目详情">
    <p class="not-found">未找到项目「{{ route.params.id }}」，该 ID 不存在。</p>
    <BaseButton @click="goBack">← 返回项目列表</BaseButton>
  </BaseCard>

  <!-- 正常详情渲染 -->
  <BaseCard v-else :title="project.name">
    <template #header-extra>
      <BaseButton variant="sub" @click="goBack">← 返回列表</BaseButton>
    </template>

    <div class="detail-head">
      <span class="icon">{{ project.icon }}</span>
      <div class="meta">
        <span>🗓 {{ project.period }}</span>
        <span>👤 {{ project.role }}</span>
      </div>
    </div>

    <p class="summary">{{ project.summary }}</p>

    <h4 class="sub-title">技术栈</h4>
    <div class="stack">
      <span v-for="s in project.stack" :key="s" class="stack-tag">{{ s }}</span>
    </div>

    <h4 class="sub-title">项目介绍</h4>
    <p class="desc">{{ project.desc }}</p>

    <h4 class="sub-title">亮点</h4>
    <ul class="highlights">
      <li v-for="h in project.highlights" :key="h">{{ h }}</li>
    </ul>
  </BaseCard>

  <!-- 上一个 / 下一个：详情页之间直接跳转（路由参数变化，组件复用） -->
  <div v-if="project" class="pager">
    <BaseButton v-if="prevProject" variant="sub" @click="goProject(prevProject.id)">
      ← {{ prevProject.name }}
    </BaseButton>
    <BaseButton v-if="nextProject" variant="sub" @click="goProject(nextProject.id)">
      {{ nextProject.name }} →
    </BaseButton>
  </div>
</template>

<style scoped>
.not-found {
  color: var(--sub);
  font-size: 15px;
  margin: 0 0 16px;
}
.detail-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}
.detail-head .icon { font-size: 40px; }
.detail-head .meta {
  display: flex;
  gap: 16px;
  color: var(--sub);
  font-size: 14px;
}
.summary {
  color: var(--accent);
  font-size: 15px;
  margin: 0 0 4px;
}
.sub-title {
  margin: 18px 0 8px;
  font-size: 15px;
  color: var(--text);
}
.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.stack-tag {
  font-size: 13px;
  background: var(--chip);
  color: var(--chip-text);
  padding: 4px 14px;
  border-radius: 999px;
}
.desc {
  line-height: 1.8;
  font-size: 14px;
  color: var(--text);
  margin: 0;
}
.highlights {
  margin: 0;
  padding-left: 20px;
  line-height: 2;
  font-size: 14px;
  color: var(--text);
}
.pager {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
</style>
