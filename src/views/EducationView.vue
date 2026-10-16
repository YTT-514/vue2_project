<script setup>
import { storeToRefs } from 'pinia'
import BaseCard from '../components/BaseCard.vue'
import EducationCard from '../components/EducationCard.vue'
import { useEducationStore } from '../stores/education.js'

const educationStore = useEducationStore()
// 解构 state（education）与 getters（计数、按时间倒序列表），均保持响应式
const { education, educationCount, honorsCount, educationByDateDesc } = storeToRefs(educationStore)
</script>

<template>
  <!-- Element Plus 栅格布局：el-row + el-col
       小屏（xs）单列堆叠；中屏以上（md）左侧 16 栏主内容 + 右侧 8 栏概览 -->
  <el-row :gutter="20">
    <!-- 主栏：学习经历卡片（保留原 EducationCard 的编辑功能） -->
    <el-col :xs="24" :md="16">
      <BaseCard id="education" :title="`学习经历（共 ${educationCount} 段）`">
        <EducationCard v-model:education="education" />
      </BaseCard>
    </el-col>

    <!-- 侧栏：在读信息 + 统计 -->
    <el-col :xs="24" :md="8">
      <el-card shadow="never" class="side-card">
        <template #header><span class="side-title">在读信息</span></template>
        <el-descriptions v-if="educationByDateDesc.length" :column="1" border>
          <el-descriptions-item label="学校">{{ educationByDateDesc[0].school }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ educationByDateDesc[0].major }}</el-descriptions-item>
          <el-descriptions-item label="学历">{{ educationByDateDesc[0].degree }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ educationByDateDesc[0].period }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card shadow="never" class="side-card">
        <template #header><span class="side-title">概览统计</span></template>
        <div class="stat-row">
          <el-statistic title="学习经历" :value="educationCount">
            <template #suffix>段</template>
          </el-statistic>
          <el-statistic title="荣誉成就" :value="honorsCount">
            <template #suffix>项</template>
          </el-statistic>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.side-card {
  border-radius: 16px;
  margin-bottom: 20px;
}
.side-title { font-size: 16px; font-weight: 600; }
.stat-row { display: flex; gap: 32px; }
/* 小屏时侧栏卡片与主栏拉开间距 */
@media (max-width: 991px) {
  .side-card { margin-top: 20px; }
}
</style>
