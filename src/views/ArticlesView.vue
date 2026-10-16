<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseCard from '../components/BaseCard.vue'
import { useArticlesStore } from '../stores/articles.js'

const router = useRouter()
const articlesStore = useArticlesStore()
// storeToRefs 同时解构 state（articles）与 getters（categories、sortedByDateDesc、articleCount）
// 解构后仍保持响应式：state 变化时，getters 自动更新，模板也自动重渲染
const { articles, categories, sortedByDateDesc, articleCount } = storeToRefs(articlesStore)

// 分类筛选：在 store 的 categories getter 前面拼一个「全部」选项
const activeCategory = ref('全部')
const categoryOptions = computed(() => ['全部', ...categories.value])
const filteredArticles = computed(() => {
  if (activeCategory.value === '全部') return sortedByDateDesc.value
  return sortedByDateDesc.value.filter(a => a.category === activeCategory.value)
})

// 关键词搜索
const keyword = ref('')
const finalList = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return filteredArticles.value
  return filteredArticles.value.filter(a =>
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
  <BaseCard id="articles" :title="`文章列表（共 ${articleCount} 篇）`">
    <!-- 搜索框 -->
    <input
      class="search-box"
      v-model="keyword"
      type="text"
      placeholder="搜索文章标题、摘要或标签…"
    />

    <!-- 分类筛选（categoryOptions = ['全部', ...store 的 categories getter]） -->
    <div class="categories">
      <button
        v-for="cat in categoryOptions"
        :key="cat"
        :class="['cat-btn', { active: activeCategory === cat }]"
        @click="activeCategory = cat"
      >{{ cat }}</button>
    </div>

    <!-- 文章列表 -->
    <div class="article-list" v-if="finalList.length">
      <div
        v-for="a in finalList"
        :key="a.id"
        class="article-item"
        @click="goDetail(a.id)"
      >
        <div class="article-meta">
          <span class="category">{{ a.category }}</span>
          <span class="date">{{ a.date }}</span>
        </div>
        <h3 class="title">{{ a.title }}</h3>
        <p class="summary">{{ a.summary }}</p>
        <div class="tags">
          <span v-for="t in a.tags" :key="t" class="tag">{{ t }}</span>
        </div>
        <span class="read-more">阅读全文 →</span>
      </div>
    </div>
    <p v-else class="empty">没有匹配的文章。</p>
  </BaseCard>
</template>

<style scoped>
.search-box {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  margin-bottom: 14px;
}
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
.cat-btn {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--card);
  color: var(--sub);
  cursor: pointer;
  font-size: 13px;
  transition: all .2s;
}
.cat-btn:hover { color: var(--accent); border-color: var(--accent); }
.cat-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.article-item {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  transition: transform .15s, box-shadow .2s, border-color .2s;
}
.article-item:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  box-shadow: var(--shadow);
}
.article-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--sub);
  margin-bottom: 6px;
}
.article-meta .category {
  background: var(--chip);
  color: var(--chip-text);
  padding: 2px 10px;
  border-radius: 999px;
}
.title { margin: 0 0 6px; font-size: 16px; color: var(--text); }
.summary { margin: 0 0 10px; font-size: 14px; color: var(--sub); line-height: 1.6; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.tag {
  font-size: 12px;
  color: var(--accent);
  background: var(--bg);
  padding: 2px 8px;
  border-radius: 6px;
}
.read-more { font-size: 13px; color: var(--accent); }
.empty { color: var(--sub); text-align: center; padding: 24px; }
</style>
