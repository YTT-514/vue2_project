<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import ProfileCard from '../components/ProfileCard.vue'
import EditCard from '../components/EditCard.vue'
import { useProfileStore } from '../stores/profile.js'
import { useAuthStore } from '../stores/auth.js'
import { useProjectsStore } from '../stores/projects.js'
import { useArticlesStore } from '../stores/articles.js'
import { useSkillsStore } from '../stores/skills.js'
import { useEducationStore } from '../stores/education.js'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const articlesStore = useArticlesStore()
const skillsStore = useSkillsStore()
const educationStore = useEducationStore()

const { profile, ageText, hasAvatar } = storeToRefs(profileStore)
const { projectCount } = storeToRefs(projectsStore)
const { articleCount } = storeToRefs(articlesStore)
const { skillCount } = storeToRefs(skillsStore)
const { honorsCount } = storeToRefs(educationStore)
const canEdit = computed(() => authStore.isLoggedIn)

function saveProfile(newProfile) {
  profileStore.updateProfile(newProfile)
}

// 个人经历时间线数据
const timeline = ref([
  {
    timestamp: '2024-09',
    title: '进入重庆工程学院',
    content: '主修计算机科学与技术，开始系统学习前端开发。',
    type: 'primary',
    icon: 'School'
  },
  {
    timestamp: '2025-03',
    title: '校园二手交易平台',
    content: '担任前端负责人，使用 Vue 3 + Element Plus + Pinia 完成核心模块。',
    type: 'success',
    icon: 'Briefcase'
  },
  {
    timestamp: '2025-06',
    title: '获得校级一等奖学金',
    content: '学业成绩优异，获得校级一等奖学金。',
    type: 'warning',
    icon: 'Trophy'
  },
  {
    timestamp: '2026-09',
    title: '个人主页网站上线',
    content: '基于 Vue 3 + Vite 构建的个人站点部署到 GitHub Pages。',
    type: 'danger',
    icon: 'Star'
  }
])
</script>

<template>
  <div class="home-page">
    <!-- Element Plus 布局组件：el-row + el-col 栅格 -->
    <el-row :gutter="20">
      <!-- 左侧：个人信息卡片（占 2/3） -->
      <el-col :xs="24" :md="16">
        <el-card shadow="hover" class="profile-section">
          <template #header>
            <span>👤 个人信息</span>
          </template>
          <ProfileCard :profile="profile" :age-text="ageText" :has-avatar="hasAvatar" />
        </el-card>
      </el-col>

      <!-- 右侧：数据概览（占 1/3） -->
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="stats-section">
          <template #header>
            <span>📊 数据概览</span>
          </template>
          <el-row :gutter="12">
            <el-col :span="12" style="margin-bottom: 20px">
              <el-statistic title="技能数" :value="skillCount" />
            </el-col>
            <el-col :span="12" style="margin-bottom: 20px">
              <el-statistic title="项目数" :value="projectCount" />
            </el-col>
            <el-col :span="12">
              <el-statistic title="文章数" :value="articleCount" />
            </el-col>
            <el-col :span="12">
              <el-statistic title="荣誉数" :value="honorsCount" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑卡片：仅管理员可见 -->
    <EditCard v-if="canEdit" :profile="profile" @save="saveProfile" />

    <!-- 时间线：个人经历 -->
    <el-card shadow="hover" class="timeline-section">
      <template #header>
        <span>📅 个人经历</span>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in timeline"
          :key="index"
          :timestamp="item.timestamp"
          :type="item.type"
          :icon="item.icon"
          placement="top"
        >
          <h4 class="timeline-title">{{ item.title }}</h4>
          <p class="timeline-content">{{ item.content }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.timeline-title {
  margin: 0 0 6px;
  font-size: 15px;
  color: var(--text);
}
.timeline-content {
  margin: 0;
  font-size: 13px;
  color: var(--sub);
  line-height: 1.6;
}
</style>
