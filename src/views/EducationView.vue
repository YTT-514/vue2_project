<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useEducationStore } from '../stores/education.js'

const educationStore = useEducationStore()
// storeToRefs 解构 state 和 getters，保持响应式
const { education, honors, educationCount, honorsCount, educationByDateDesc } = storeToRefs(educationStore)

// 最高学历：取最新一段的 degree
const highestDegree = computed(() =>
  educationByDateDesc.value[0]?.degree || '-'
)
</script>

<template>
  <div class="education-page">
    <!-- Element Plus 布局组件：el-row + el-col 栅格 -->
    <el-row :gutter="20">
      <!-- 左侧：学习经历（占 2/3） -->
      <el-col :xs="24" :md="16">
        <el-card shadow="hover">
          <template #header>
            <span>🎓 学习经历（共 {{ educationCount }} 段）</span>
          </template>

          <!-- el-timeline 展示学习经历时间线 -->
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in educationByDateDesc"
              :key="index"
              :timestamp="item.period"
              type="primary"
              placement="top"
            >
              <!-- el-descriptions 展示每段经历的键值对详情 -->
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="学校">
                  <strong>{{ item.school || '-' }}</strong>
                </el-descriptions-item>
                <el-descriptions-item label="学历">{{ item.degree || '-' }}</el-descriptions-item>
                <el-descriptions-item label="专业">{{ item.major || '-' }}</el-descriptions-item>
                <el-descriptions-item label="时间">{{ item.period || '-' }}</el-descriptions-item>
                <el-descriptions-item label="描述" :span="2" v-if="item.detail">
                  {{ item.detail }}
                </el-descriptions-item>
              </el-descriptions>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 右侧：数据概览（占 1/3） -->
      <el-col :xs="24" :md="8">
        <el-card shadow="hover" class="stats-card">
          <template #header>
            <span>📊 数据概览</span>
          </template>
          <!-- el-statistic 统计数字 -->
          <el-row :gutter="12">
            <el-col :span="12" style="margin-bottom: 20px">
              <el-statistic title="学习经历" :value="educationCount" />
            </el-col>
            <el-col :span="12" style="margin-bottom: 20px">
              <el-statistic title="荣誉成就" :value="honorsCount" />
            </el-col>
            <el-col :span="24">
              <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="最高学历">
                  <el-tag type="success" effect="dark">{{ highestDegree }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="在读学校">
                  {{ educationByDateDesc[0]?.school || '-' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 荣誉成就 -->
    <el-card shadow="hover" style="margin-top: 20px">
      <template #header>
        <span>🏆 荣誉成就（共 {{ honorsCount }} 项）</span>
      </template>
      <el-row :gutter="16">
        <el-col
          v-for="(honor, i) in honors"
          :key="i"
          :xs="24" :sm="12" :md="8"
          style="margin-bottom: 16px"
        >
          <el-card shadow="never" class="honor-card">
            <div class="honor-head">
              <span class="honor-icon">{{ honor.icon }}</span>
              <div>
                <strong>{{ honor.title }}</strong>
                <div class="honor-sub">{{ honor.organization }} · {{ honor.date }}</div>
              </div>
            </div>
            <p v-if="honor.desc" class="honor-desc">{{ honor.desc }}</p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.education-page { display: flex; flex-direction: column; }
.stats-card { height: 100%; }
.honor-card { height: 100%; }
.honor-head { display: flex; align-items: center; gap: 12px; }
.honor-icon { font-size: 32px; }
.honor-sub { font-size: 12px; color: #909399; margin-top: 2px; }
.honor-desc { margin: 12px 0 0; font-size: 13px; color: #606266; line-height: 1.6; }
</style>
