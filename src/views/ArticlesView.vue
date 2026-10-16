<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useArticlesStore } from '../stores/articles.js'

const router = useRouter()
const articlesStore = useArticlesStore()
// storeToRefs 同时解构 state 与 getters（categories 分类、sortedByDateDesc 倒序、articleCount 计数）
// 解构后仍保持响应式：state 变化时 getters 自动更新，模板也自动重渲染
const { categories, sortedByDateDesc, articleCount } = storeToRefs(articlesStore)

// 分类筛选：在 store 的 categories getter 前面拼一个「全部」选项
const activeCategory = ref('全部')
const categoryOptions = computed(() => ['全部', ...categories.value])

// 关键词搜索
const keyword = ref('')
const finalList = computed(() => {
  const list = activeCategory.value === '全部'
    ? sortedByDateDesc.value
    : sortedByDateDesc.value.filter(a => a.category === activeCategory.value)
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return list
  return list.filter(a =>
    a.title.toLowerCase().includes(kw) ||
    a.summary.toLowerCase().includes(kw) ||
    a.tags.some(t => t.toLowerCase().includes(kw))
  )
})

// 编程式导航：跳转文章详情
function goDetail(id) {
  router.push({ name: 'article-detail', params: { id } })
}
</script>

<template>
  <el-card shadow="never" class="list-card">
    <template #header>
      <div class="card-head">
        <span class="title">文章列表（共 {{ articleCount }} 篇）</span>
        <!-- el-input：搜索框，clearable 一键清空，prefix-icon 放置放大镜图标 -->
        <el-input
          v-model="keyword"
          class="search"
          placeholder="搜索标题、摘要或标签…"
          clearable
          :prefix-icon="Search"
        />
      </div>
    </template>

    <!-- el-radio-group + el-radio-button：分类单选筛选 -->
    <el-radio-group v-model="activeCategory" class="cats">
      <el-radio-button v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</el-radio-button>
    </el-radio-group>

    <!-- 文章列表：卡片 + 标签 -->
    <div v-if="finalList.length" class="article-list">
      <el-card v-for="a in finalList" :key="a.id" shadow="hover" class="article-card" @click="goDetail(a.id)">
        <div class="article-meta">
          <el-tag size="small">{{ a.category }}</el-tag>
          <span class="date">{{ a.date }}</span>
        </div>
        <h3 class="article-title">{{ a.title }}</h3>
        <p class="article-summary">{{ a.summary }}</p>
        <div class="tags">
          <el-tag v-for="t in a.tags" :key="t" size="small" type="info" effect="plain">{{ t }}</el-tag>
        </div>
        <el-button type="primary" link class="read-more">阅读全文 →</el-button>
      </el-card>
    </div>

    <!-- el-empty：无匹配结果时的占位 -->
    <el-empty v-else description="没有匹配的文章" />
  </el-card>
</template>

<style scoped>
.list-card { border-radius: 16px; }
.card-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.card-head .title { font-size: 18px; font-weight: 600; white-space: nowrap; }
.search { max-width: 300px; }
.cats { margin-bottom: 20px; flex-wrap: wrap; }

.article-list { display: flex; flex-direction: column; gap: 16px; }
.article-card {
  border-radius: 12px;
  cursor: pointer;
  transition: transform .15s, box-shadow .2s;
}
.article-card:hover { transform: translateY(-2px); }
.article-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.article-meta .date { font-size: 12px; color: var(--sub); }
.article-title { margin: 0 0 6px; font-size: 16px; color: var(--text); }
.article-summary { margin: 0 0 10px; font-size: 14px; color: var(--sub); line-height: 1.6; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.read-more { padding: 0; }
</style>
