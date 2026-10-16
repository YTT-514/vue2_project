<script setup>
import { reactive, ref, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteLeave } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useArticlesStore } from '../stores/articles.js'

const articlesStore = useArticlesStore()
// 解构 state（articles）与 getters（categories 分类、allTags 标签），保持响应式
const { articles, categories, allTags } = storeToRefs(articlesStore)

// 草稿模式：新增/编辑/删除都在副本上操作，保存后统一写回
const clone = a => JSON.parse(JSON.stringify(a))
const drafts = reactive(articles.value.map(clone))
const dirty = computed(() => JSON.stringify(drafts) !== JSON.stringify(articles.value))

// ---------- el-dialog 表单状态 ----------
const dialogVisible = ref(false)
const editingIndex = ref(-1)
const formRef = ref()

function emptyForm() {
  return {
    id: '', title: '', date: new Date().toISOString().slice(0, 10),
    category: '', tags: [], summary: '', content: ''
  }
}
const form = reactive(emptyForm())

// el-form 校验：标题必填；id 必填、格式合法且不重复
const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  id: [
    { required: true, message: '文章 id 不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9-]+$/, message: 'id 只能包含字母、数字、连字符', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        const id = (value || '').trim()
        const dup = drafts.some((d, i) => d.id.trim() === id && i !== editingIndex.value)
        dup ? callback(new Error('id 重复，详情页路由会冲突')) : callback()
      },
      trigger: 'blur'
    }
  ]
}

function openAdd() {
  editingIndex.value = -1
  Object.assign(form, emptyForm())
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}
function openEdit(row, index) {
  editingIndex.value = index
  Object.assign(form, { ...row, tags: [...row.tags] })
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 确定：写入草稿（不直接动 store）
function confirmDialog() {
  formRef.value.validate(valid => {
    if (!valid) return
    const payload = {
      id: form.id.trim(),
      title: form.title.trim(),
      date: form.date,
      category: form.category,
      tags: [...form.tags],
      summary: form.summary,
      content: form.content
    }
    if (editingIndex.value === -1) drafts.push(payload)
    else Object.assign(drafts[editingIndex.value], payload)
    dialogVisible.value = false
    ElMessage.success(editingIndex.value === -1 ? '已新增，点击「保存修改」后生效' : '已修改，点击「保存修改」后生效')
  })
}

function removeRow(index) {
  drafts.splice(index, 1)
  ElMessage.success('已删除，点击「保存修改」后生效')
}

// ---------- 批量保存 / 取消 ----------
function saveAll() {
  // 草稿归一化后通过 store action 写回，数据流：组件草稿 → action → state
  articlesStore.saveArticles(drafts.map(d => ({ ...d })))
  ElMessage.success(`已保存 ${drafts.length} 篇文章`)
}
function cancelEdit() {
  drafts.splice(0, drafts.length, ...articles.value.map(clone))
  ElMessage.info('已放弃全部修改')
}

// 组件内守卫
onBeforeRouteLeave(async () => {
  if (!dirty.value) return true
  try {
    await ElMessageBox.confirm('文章信息有未保存的修改，确定离开吗？', '提示', {
      type: 'warning', confirmButtonText: '离开', cancelButtonText: '留下'
    })
    return true
  } catch {
    return false
  }
})
</script>

<template>
  <el-alert
    class="tip"
    type="info"
    show-icon
    :closable="false"
    title="id 用作详情页动态路由参数（/articles/:id）；修改后点击「保存修改」生效"
  />

  <div class="toolbar">
    <el-tag v-if="dirty" type="warning" effect="light">● 有未保存的修改</el-tag>
    <span v-else class="no-change">暂无未保存修改</span>
    <el-button type="primary" :icon="Plus" @click="openAdd">新增文章</el-button>
  </div>

  <!-- el-table：文章草稿列表 -->
  <el-table :data="drafts" border class="table" empty-text="暂无文章，点击「新增文章」添加">
    <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
    <el-table-column label="URL 路径" min-width="170">
      <template #default="{ row }"><code class="pid">/articles/{{ row.id || '?' }}</code></template>
    </el-table-column>
    <el-table-column prop="date" label="发布日期" width="120" />
    <el-table-column label="分类" width="120">
      <template #default="{ row }">
        <el-tag v-if="row.category" size="small">{{ row.category }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="标签" min-width="180">
      <template #default="{ row }">
        <el-tag v-for="t in row.tags" :key="t" size="small" type="info" effect="plain" class="stack-tag">{{ t }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="160" align="center" fixed="right">
      <template #default="{ row, $index }">
        <el-button type="primary" link :icon="Edit" @click="openEdit(row, $index)">编辑</el-button>
        <el-popconfirm title="确定删除该文章吗？（保存后生效）" @confirm="removeRow($index)">
          <template #reference>
            <el-button type="danger" link :icon="Delete">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <div class="form-actions">
    <el-button @click="cancelEdit">取消修改</el-button>
    <el-button type="primary" @click="saveAll">保存修改</el-button>
  </div>

  <!-- el-dialog + el-form：新增/编辑文章 -->
  <el-dialog v-model="dialogVisible" :title="editingIndex === -1 ? '新增文章' : '编辑文章'" width="660px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="92px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="如：Vue 3 组合式 API 入门指南" />
      </el-form-item>
      <el-form-item label="文章 id" prop="id">
        <el-input v-model="form.id" placeholder="英文/数字/连字符，用于 URL" />
      </el-form-item>
      <el-form-item label="发布日期">
        <!-- el-date-picker：日期选择器 -->
        <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="分类">
        <!-- el-select + el-option：下拉选择，allow-create 支持直接输入新分类 -->
        <el-select v-model="form.category" filterable allow-create default-first-option placeholder="选择或输入分类">
          <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <!-- el-select 多选模式：可多选、可输入新标签 -->
        <el-select v-model="form.tags" multiple filterable allow-create default-first-option placeholder="选择或输入标签">
          <el-option v-for="t in allTags" :key="t" :label="t" :value="t" />
        </el-select>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.summary" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="正文">
        <el-input v-model="form.content" type="textarea" :rows="6" placeholder="换行分段，## 开头的行会渲染为小标题" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmDialog">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.tip { margin-bottom: 12px; border-radius: 10px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.no-change { font-size: 13px; color: var(--sub); }
.table { border-radius: 10px; }
.stack-tag { margin: 2px 4px 2px 0; }
.pid {
  font-size: 12px;
  color: var(--sub);
  background: var(--chip);
  padding: 2px 8px;
  border-radius: 6px;
}
.form-actions { margin-top: 16px; display: flex; justify-content: flex-end; gap: 12px; }
</style>
