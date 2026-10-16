<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '../stores/projects.js'

const router = useRouter()
const projectsStore = useProjectsStore()
// 解构 state（projects）与 getters（projectCount 计数、allStacks 技术栈汇总），均保持响应式
const { projects, projectCount, allStacks } = storeToRefs(projectsStore)

// 编程式导航：携带动态路由参数 id 跳转到详情页
function goDetail(id) {
  router.push({ name: 'project-detail', params: { id } })
}
</script>

<template>
  <!-- el-card：卡片容器，header 插槽放标题与技术栈汇总 -->
  <el-card shadow="never" class="list-card">
    <template #header>
      <div class="card-head">
        <span class="title">项目作品（共 {{ projectCount }} 个）</span>
        <span class="stack-summary">
          <el-tag v-for="s in allStacks" :key="s" size="small" effect="plain">{{ s }}</el-tag>
        </span>
      </div>
    </template>

    <!-- el-row / el-col：栅格布局，小屏 1 列、平板 2 列、桌面 3 列 -->
    <el-row v-if="projects.length" :gutter="16">
      <el-col v-for="p in projects" :key="p.id" :xs="24" :sm="12" :md="8" class="col">
        <el-card shadow="hover" class="project-card" @click="goDetail(p.id)">
          <div class="project-head">
            <span class="icon">{{ p.icon }}</span>
            <div class="title-wrap">
              <h3 class="name">{{ p.name }}</h3>
              <span class="period">{{ p.period }}</span>
            </div>
          </div>
          <p class="summary">{{ p.summary }}</p>
          <div class="stack">
            <el-tag v-for="s in p.stack" :key="s" size="small">{{ s }}</el-tag>
          </div>
          <el-button type="primary" link class="detail-btn">
            查看详情
            <el-icon class="arrow"><ArrowRight /></el-icon>
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- el-empty：列表为空时的占位提示 -->
    <el-empty v-else description="暂无项目" />
  </el-card>
</template>

<style scoped>
.list-card { border-radius: 16px; }
.card-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.card-head .title { font-size: 18px; font-weight: 600; }
.stack-summary { display: flex; flex-wrap: wrap; gap: 6px; }
.col { margin-bottom: 16px; }
.project-card {
  border-radius: 12px;
  cursor: pointer;
  height: 100%;
}
.project-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}
.project-head { display: flex; align-items: center; gap: 10px; }
.project-head .icon { font-size: 26px; }
.title-wrap { flex: 1; }
.name { margin: 0; font-size: 16px; color: var(--text); }
.period { font-size: 12px; color: var(--sub); }
.summary { margin: 0; font-size: 13px; color: var(--sub); line-height: 1.6; flex: 1; }
.stack { display: flex; flex-wrap: wrap; gap: 6px; }
.detail-btn { align-self: flex-end; }
.arrow { margin-left: 2px; }
</style>
