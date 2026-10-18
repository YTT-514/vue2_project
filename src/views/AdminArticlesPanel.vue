<script setup>
import { reactive, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteLeave } from 'vue-router'
import FormField from '../components/FormField.vue'
import { useArticlesStore } from '../stores/articles.js'

const articlesStore = useArticlesStore()
const { articles } = storeToRefs(articlesStore)

// 草稿模式：新增/编辑/删除都在副本上操作，保存后统一写回
const clone = a => JSON.parse(JSON.stringify(a))
const drafts = reactive(articles.value.map(clone))
const saveMsg = ref('')
const errors = ref({})
const dirty = computed(() => JSON.stringify(drafts) !== JSON.stringify(articles.value))

// 新增
function addArticle() {
  drafts.push({
    id: '', title: '', date: new Date().toISOString().slice(0, 10),
    category: '', tags: [], summary: '', content: ''
  })
}

// 删除
function removeArticle(index) {
  if (confirm('确定删除该文章吗？点击「保存修改」后生效。')) drafts.splice(index, 1)
}

// 标签编辑
function onTagsInput(a, e) {
  a.tags = e.target.value.split(/[、,，]\s*/).map(s => s.trim()).filter(Boolean)
}

// 校验：标题必填、id 必填+格式+不重复
function validate() {
  const errs = {}
  const ids = drafts.map(d => d.id.trim())
  drafts.forEach((d, i) => {
    const item = {}
    if (!d.title.trim()) item.title = '标题不能为空'
    const id = d.id.trim()
    if (!id) item.id = '文章 id 不能为空'
    else if (!/^[a-zA-Z0-9-]+$/.test(id)) item.id = 'id 只能包含字母、数字、连字符'
    else if (ids.indexOf(id) !== ids.lastIndexOf(id)) item.id = 'id 重复'
    if (Object.keys(item).length) errs[i] = item
  })
  errors.value = errs
  return Object.keys(errs).length === 0
}

// 保存 / 取消
function saveAll() {
  if (!validate()) { saveMsg.value = ''; return }
  // 草稿归一化后通过 store action 写回，数据流：组件草稿 → action → state
  const normalized = drafts.map(d => ({ ...d, id: d.id.trim(), title: d.title.trim() }))
  articlesStore.saveArticles(normalized)
  saveMsg.value = `✅ 已保存 ${drafts.length} 篇文章`
  setTimeout(() => (saveMsg.value = ''), 2500)
}
function cancelEdit() {
  drafts.splice(0, drafts.length, ...articles.value.map(clone))
  errors.value = {}
  saveMsg.value = ''
}

// 组件内守卫
onBeforeRouteLeave(() => {
  if (dirty.value && !confirm('文章信息有未保存的修改，确定离开吗？')) return false
})
</script>

<template>
  <div class="actions-bar">
    <span class="hint">id 用作详情页动态路由参数（/articles/:id）；修改后点击「保存修改」生效</span>
    <button class="btn-primary" @click="addArticle">＋ 新增文章</button>
  </div>

  <div class="save-bar">
    <span v-if="dirty" class="dirty-hint">● 有未保存的修改</span>
    <span v-if="saveMsg" class="save-msg">{{ saveMsg }}</span>
  </div>

  <div v-for="(a, i) in drafts" :key="i" class="article-edit">
    <div class="edit-head">
      <label class="head-field">
        <input v-model="a.title" placeholder="文章标题" :class="{ invalid: errors[i]?.title }" />
        <span v-if="errors[i]?.title" class="field-error">{{ errors[i].title }}</span>
      </label>
      <label class="head-field">
        <input v-model="a.id" placeholder="文章id（用于URL）" :class="{ invalid: errors[i]?.id }" />
        <span v-if="errors[i]?.id" class="field-error">{{ errors[i].id }}</span>
        <code v-else class="pid">/articles/{{ a.id || '?' }}</code>
      </label>
      <button class="btn-danger" @click="removeArticle(i)">删除</button>
    </div>
    <div class="form-grid">
      <FormField label="发布日期" v-model="a.date" />
      <FormField label="分类" v-model="a.category" />
      <label class="tags-field">
        标签（顿号或逗号分隔）
        <input :value="a.tags.join('、')" @input="onTagsInput(a, $event)" />
      </label>
      <FormField label="摘要" v-model="a.summary" class="span-2" />
      <FormField label="正文" v-model="a.content" class="span-2">
        <template #default="{ value, update }">
          <textarea :value="value" @input="update($event.target.value)" rows="5" placeholder="## 换行分段，## 开头的行会渲染为小标题"></textarea>
        </template>
      </FormField>
    </div>
  </div>

  <div v-if="!drafts.length" class="empty-hint">暂无文章，点击右上角「＋ 新增文章」添加</div>

  <div class="form-actions">
    <button class="btn-secondary" @click="cancelEdit">取消修改</button>
    <button class="btn-primary" @click="saveAll">保存修改</button>
  </div>
</template>

<style scoped>
.actions-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.hint { font-size: 13px; color: var(--sub); }
.save-bar { min-height: 18px; display: flex; gap: 12px; align-items: center; margin-top: 8px; }
.dirty-hint { color: #f59e0b; font-size: 13px; }
.save-msg { color: var(--accent); font-size: 13px; }

.article-edit {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}
.edit-head { display: flex; align-items: flex-start; gap: 10px; }
.head-field { flex: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 13px; color: var(--sub); }
.head-field input {
  flex: 1; min-width: 120px; padding: 8px 10px;
  border: 1px solid var(--border); border-radius: 8px;
  background: var(--bg); color: var(--text); font-size: 14px; font-weight: 600;
}
.head-field input.invalid { border-color: #ef4444; }
.field-error { color: #ef4444; font-size: 12px; width: 100%; }
.pid { font-size: 12px; color: var(--sub); background: var(--chip); padding: 2px 8px; border-radius: 6px; }
.btn-danger {
  background: transparent; color: #ef4444; border: 1px solid #ef4444;
  padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; white-space: nowrap;
}
.btn-danger:hover { background: #ef4444; color: #fff; }

.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 16px; }
.span-2 { grid-column: span 2; }
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: span 1; }
}

.tags-field { display: grid; gap: 4px; font-size: 13px; color: var(--sub); }
.tags-field input {
  padding: 8px 10px; border: 1px solid var(--border); border-radius: 8px;
  background: var(--bg); color: var(--text); font-size: 14px; font-family: inherit;
}

.empty-hint { padding: 24px; text-align: center; color: var(--sub); font-size: 14px; }
.form-actions { margin-top: 16px; display: flex; justify-content: flex-end; gap: 12px; }
.btn-primary {
  background: var(--accent); color: #fff; border: none;
  padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px;
}
.btn-primary:hover { opacity: .9; }
.btn-secondary {
  background: transparent; color: var(--sub); border: 1px solid var(--border);
  padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px;
}
.btn-secondary:hover { color: var(--text); border-color: var(--sub); }
</style>
