<script setup>
import { ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseCard from '../components/BaseCard.vue'
import { useArticlesStore } from '../stores/articles.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const articlesStore = useArticlesStore()
const authStore = useAuthStore()

// storeToRefs 解构 state 和 getters
const { articles, categories, allTags, sortedByDateDesc, articleCount } = storeToRefs(articlesStore)
const canEdit = computed(() => authStore.isLoggedIn)

// 分类筛选
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

// 跳转详情
function goDetail(id) {
  router.push({ name: 'article-detail', params: { id } })
}

// ---------- 对话框表单 ----------
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: '', title: '', date: '', category: '',
  tags: [], summary: '', content: ''
})

function openAdd() {
  isEdit.value = false
  Object.assign(form, {
    id: '', title: '', date: new Date().toISOString().slice(0, 10),
    category: '', tags: [], summary: '', content: ''
  })
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  Object.assign(form, JSON.parse(JSON.stringify(row)))
  dialogVisible.value = true
}

function saveArticle() {
  if (!form.title.trim()) { ElMessage.warning('请输入标题'); return }
  if (!form.id.trim()) { ElMessage.warning('请输入文章 id'); return }
  if (!/^[a-zA-Z0-9-]+$/.test(form.id.trim())) {
    ElMessage.warning('id 只能包含字母、数字、连字符'); return
  }
  const dup = articles.value.find(a => a.id === form.id.trim() && (!isEdit.value || a.id !== form._originalId))
  if (dup) { ElMessage.warning('该 id 已存在'); return }

  const data = { ...form, id: form.id.trim(), title: form.title.trim() }

  if (isEdit.value) {
    articlesStore.updateArticle(form._originalId, data)
    ElMessage.success('文章已更新')
  } else {
    articlesStore.addArticle(data)
    ElMessage.success('文章已新增')
  }
  dialogVisible.value = false
}

async function removeArticle(row) {
  try {
    await ElMessageBox.confirm(`确定删除文章「${row.title}」吗？`, '提示', { type: 'warning' })
    articlesStore.removeArticle(row.id)
    ElMessage.success('已删除')
  } catch (e) { /* 取消 */ }
}
</script>

<template>
  <BaseCard id="articles" :title="`文章列表（共 ${articleCount} 篇）`">
    <!-- 搜索 + 分类筛选 -->
    <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
      <el-input
        v-model="keyword"
        placeholder="搜索标题、摘要或标签…"
        clearable
        style="width: 280px"
        :prefix-icon="'Search'"
      />
      <!-- el-radio-group：分类筛选 -->
      <el-radio-group v-model="activeCategory" size="default">
        <el-radio-button v-for="cat in categoryOptions" :key="cat" :label="cat">{{ cat }}</el-radio-button>
      </el-radio-group>
      <el-button v-if="canEdit" type="primary" :icon="'Plus'" @click="openAdd">新增文章</el-button>
    </div>

    <!-- el-table：文章列表 -->
    <el-table :data="finalList" border stripe style="width: 100%">
      <el-table-column prop="title" label="标题" min-width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="goDetail(row.id)" style="padding: 0">{{ row.title }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" width="100">
        <template #default="{ row }">
          <el-tag type="info" size="small">{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column label="标签" min-width="160">
        <template #default="{ row }">
          <el-tag v-for="t in row.tags" :key="t" size="small" style="margin-right: 4px">{{ t }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template #default="{ row }">
          <el-button v-if="canEdit" size="small" type="success" link @click="openEdit(row)">编辑</el-button>
          <el-button v-if="canEdit" size="small" type="danger" link @click="removeArticle(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空状态 -->
    <el-empty v-if="!finalList.length" description="没有匹配的文章" />

    <!-- el-dialog + el-form：新增/编辑文章 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑文章' : '新增文章'"
      width="640px"
      destroy-on-close
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章id" required>
          <el-input v-model="form.id" placeholder="用于URL，如 vue3-guide" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="选择或输入分类" filterable allow-create style="width: 100%">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或输入标签，回车添加"
            style="width: 100%"
          >
            <el-option v-for="t in allTags" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" placeholder="文章摘要" />
        </el-form-item>
        <el-form-item label="正文">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="文章正文（支持 ## 小标题）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveArticle">保存</el-button>
      </template>
    </el-dialog>
  </BaseCard>
</template>
