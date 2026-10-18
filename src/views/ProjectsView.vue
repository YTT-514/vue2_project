<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseCard from '../components/BaseCard.vue'
import { useProjectsStore } from '../stores/projects.js'
const router = useRouter()
const projectsStore = useProjectsStore()
// 解构 state（projects）与 getter（projectCount），均保持响应式
const { projects, projectCount } = storeToRefs(projectsStore)
// 编程式导航：携带动态路由参数 id 跳转到详情页
function goDetail(id) {
  router.push({ name: 'project-detail', params: { id } })
}
</script>

<template>
  <BaseCard id="projects" :title="`项目作品（共 ${projectCount} 个）`">
    <div class="project-grid">
      <div
        v-for="p in projects"
        :key="p.id"
        class="project-item"
        @click="goDetail(p.id)"
      >
        <div class="project-head">
          <span class="icon">{{ p.icon }}</span>
          <div class="title-wrap">
            <h3 class="name">{{ p.name }}</h3>
            <span class="period">{{ p.period }}</span>
          </div>
        </div>
        <p class="summary">{{ p.summary }}</p>
        <div class="stack">
          <span v-for="s in p.stack" :key="s" class="stack-tag">{{ s }}</span>
        </div>
        <span class="detail-link">查看详情 →</span>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.project-item {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: transform .15s, box-shadow .2s, border-color .2s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.project-item:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: var(--shadow);
}
.project-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.project-head .icon { font-size: 26px; }
.title-wrap { flex: 1; }
.project-item .name {
  margin: 0;
  font-size: 16px;
  color: var(--text);
}
.project-item .period {
  font-size: 12px;
  color: var(--sub);
}
.project-item .summary {
  margin: 0;
  font-size: 13px;
  color: var(--sub);
  line-height: 1.6;
  flex: 1;
}
.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.stack-tag {
  font-size: 12px;
  background: var(--chip);
  color: var(--chip-text);
  padding: 2px 10px;
  border-radius: 999px;
}
.detail-link {
  font-size: 13px;
  color: var(--accent);
  align-self: flex-end;
}
</style>
