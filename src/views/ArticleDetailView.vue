<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '../components/BaseCard.vue'
import BaseButton from '../components/BaseButton.vue'
import { useArticlesStore } from '../stores/articles.js'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()

// 读取动态路由参数 :id，computed 响应组件复用时的参数变化
const article = computed(() => articlesStore.getArticleById(route.params.id))

// 上一篇 / 下一篇
const prevArticle = computed(() => {
  const list = articlesStore.articles
  const idx = list.findIndex(a => a.id === route.params.id)
  return idx > 0 ? list[idx - 1] : null
})
const nextArticle = computed(() => {
  const list = articlesStore.articles
  const idx = list.findIndex(a => a.id === route.params.id)
  return idx > -1 && idx < list.length - 1 ? list[idx + 1] : null
})

function goArticle(id) {
  router.push({ name: 'article-detail', params: { id } })
}
function goBack() {
  router.push({ name: 'articles' })
}
</script>

<template>
  <!-- 文章不存在 -->
  <BaseCard v-if="!article" title="文章详情">
    <p class="not-found">未找到文章「{{ route.params.id }}」，该 ID 不存在。</p>
    <BaseButton @click="goBack">← 返回文章列表</BaseButton>
  </BaseCard>

  <!-- 正常详情渲染 -->
  <BaseCard v-else :title="article.title">
    <template #header-extra>
      <BaseButton variant="sub" @click="goBack">← 返回列表</BaseButton>
    </template>

    <div class="article-meta">
      <span class="category">{{ article.category }}</span>
      <span class="date">🗓 {{ article.date }}</span>
    </div>

    <div class="tags">
      <span v-for="t in article.tags" :key="t" class="tag">{{ t }}</span>
    </div>

    <p class="summary">{{ article.summary }}</p>

    <!-- content 按换行分段，简单模拟 Markdown 渲染 -->
    <div class="content">
      <p
        v-for="(para, i) in article.content.split('\n')"
        :key="i"
        :class="para.startsWith('## ') ? 'heading' : 'paragraph'"
      >{{ para.replace(/^##\s*/, '') }}</p>
    </div>
  </BaseCard>

  <!-- 上一篇 / 下一篇 -->
  <div v-if="article" class="pager">
    <BaseButton v-if="prevArticle" variant="sub" @click="goArticle(prevArticle.id)">
      ← {{ prevArticle.title }}
    </BaseButton>
    <BaseButton v-if="nextArticle" variant="sub" @click="goArticle(nextArticle.id)">
      {{ nextArticle.title }} →
    </BaseButton>
  </div>
</template>

<style scoped>
.not-found { color: var(--sub); font-size: 15px; margin: 0 0 16px; }
.article-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}
.article-meta .category {
  background: var(--chip);
  color: var(--chip-text);
  padding: 2px 12px;
  border-radius: 999px;
  font-size: 13px;
}
.article-meta .date { font-size: 13px; color: var(--sub); }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.tag {
  font-size: 12px;
  color: var(--accent);
  background: var(--bg);
  padding: 2px 10px;
  border-radius: 6px;
}
.summary {
  font-size: 15px;
  color: var(--accent);
  line-height: 1.6;
  margin: 0 0 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.content { line-height: 1.9; font-size: 14px; color: var(--text); }
.content .heading {
  font-weight: 600;
  font-size: 15px;
  margin: 18px 0 6px;
  color: var(--text);
}
.content .paragraph { margin: 0 0 12px; }
.pager {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
</style>
