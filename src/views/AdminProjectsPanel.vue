<script setup>
import { reactive, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteLeave } from 'vue-router'
import FormField from '../components/FormField.vue'
import { useProjectsStore } from '../stores/projects.js'

const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)

// 嵌套路由子页面：/admin/projects
// 草稿模式：新增/编辑/删除都在副本上操作，「保存」统一写回 store，「取消」放弃全部修改。
// 相比实时生效，草稿模式可以放心修改、随时反悔，出错也不会污染前台数据。

// 深拷贝一份作为草稿（切断与 store 的引用，避免误改直接生效）
const clone = p => JSON.parse(JSON.stringify(p))
const drafts = reactive(projects.value.map(clone))
const saveMsg = ref('')

// 校验错误：{ [草稿下标]: { name: '...', id: '...' } }
const errors = ref({})
// 是否有未保存的修改（用于离开提醒）
const dirty = computed(() => JSON.stringify(drafts) !== JSON.stringify(projects.value))

// ---------- 新增 / 删除（草稿层面） ----------
function addProject() {
  drafts.push({
    id: '', icon: '📦', name: '', period: '', role: '',
    stack: [], summary: '', desc: '', highlights: []
  })
}

function removeProject(index) {
  if (confirm('确定删除该项目吗？点击「保存修改」后生效。')) {
    drafts.splice(index, 1)
  }
}

// 技术栈用单个文本框编辑：顿号/逗号分隔 → 字符串数组
function onStackInput(p, e) {
  p.stack = e.target.value.split(/[、,，]\s*/).map(s => s.trim()).filter(Boolean)
}

// ---------- 表单校验 ----------
// 名称必填；id 必填、格式合法且不重复——id 用作动态路由参数 /projects/:id，错了详情页就 404
function validate() {
  const errs = {}
  const ids = drafts.map(d => d.id.trim())
  drafts.forEach((d, i) => {
    const item = {}
    if (!d.name.trim()) item.name = '项目名称不能为空'
    const id = d.id.trim()
    if (!id) item.id = '项目 id 不能为空'
    else if (!/^[a-zA-Z0-9-]+$/.test(id)) item.id = 'id 只能包含字母、数字、连字符'
    else if (ids.indexOf(id) !== ids.lastIndexOf(id)) item.id = 'id 重复，详情页路由会冲突'
    if (Object.keys(item).length) errs[i] = item
  })
  errors.value = errs
  return Object.keys(errs).length === 0
}

// ---------- 保存 / 取消 ----------
function saveAll() {
  if (!validate()) {
    saveMsg.value = ''
    return
  }
  // 草稿归一化后通过 store action 写回，前台列表页/详情页立即同步
  // saveProjects 在 store 内统一负责批量替换，数据流：组件草稿 → action → state
  const normalized = drafts.map(d => ({ ...d, id: d.id.trim(), name: d.name.trim() }))
  projectsStore.saveProjects(normalized)
  saveMsg.value = `✅ 已保存 ${drafts.length} 个项目`
  setTimeout(() => (saveMsg.value = ''), 2500)
}

// 取消修改：草稿恢复为 store 当前数据
function cancelEdit() {
  drafts.splice(0, drafts.length, ...projects.value.map(clone))
  errors.value = {}
  saveMsg.value = ''
}

// 组件内守卫：有未保存修改时离开（切页签/去别的页面）需确认
onBeforeRouteLeave(() => {
  if (dirty.value && !confirm('项目信息有未保存的修改，确定离开吗？')) return false
})
</script>

<template>
  <div class="projects-actions">
    <span class="hint">修改不会立即生效，点击「保存修改」后前台列表与详情页才同步；id 用作详情页动态路由参数（/projects/:id）</span>
    <button class="btn-primary" @click="addProject">＋ 新增项目</button>
  </div>

  <div class="save-bar">
    <span v-if="dirty" class="dirty-hint">● 有未保存的修改</span>
    <span v-if="saveMsg" class="save-msg">{{ saveMsg }}</span>
  </div>

  <div v-for="(p, i) in drafts" :key="i" class="project-edit">
    <div class="project-edit-head">
      <input v-model="p.icon" class="icon-input" maxlength="4" title="项目图标" />
      <label class="head-field">
        <input v-model="p.name" placeholder="项目名称" :class="{ invalid: errors[i]?.name }" />
        <span v-if="errors[i]?.name" class="field-error">{{ errors[i].name }}</span>
      </label>
      <label class="head-field">
        <input v-model="p.id" placeholder="项目id（用于URL）" :class="{ invalid: errors[i]?.id }" />
        <span v-if="errors[i]?.id" class="field-error">{{ errors[i].id }}</span>
        <code v-else class="pid">/projects/{{ p.id || '?' }}</code>
      </label>
      <button class="btn-danger" @click="removeProject(i)">删除</button>
    </div>
    <div class="form-grid">
      <FormField label="时间" v-model="p.period" />
      <FormField label="担任角色" v-model="p.role" />
      <label class="stack-field">
        技术栈（顿号或逗号分隔）
        <input :value="p.stack.join('、')" @input="onStackInput(p, $event)" />
      </label>
      <FormField label="一句话简介" v-model="p.summary" class="span-2" />
      <FormField label="项目介绍" v-model="p.desc" class="span-2">
        <template #default="{ value, update }">
          <textarea :value="value" @input="update($event.target.value)" rows="3"></textarea>
        </template>
      </FormField>
    </div>
  </div>

  <div v-if="!drafts.length" class="empty-hint">暂无项目，点击右上角「＋ 新增项目」添加</div>

  <div class="form-actions">
    <button class="btn-secondary" @click="cancelEdit">取消修改</button>
    <button class="btn-primary" @click="saveAll">保存修改</button>
  </div>
</template>

<style scoped>
.projects-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.hint { font-size: 13px; color: var(--sub); }
.save-bar { min-height: 18px; display: flex; gap: 12px; align-items: center; margin-top: 8px; }
.dirty-hint { color: #f59e0b; font-size: 13px; }
.save-msg { color: var(--accent); font-size: 13px; }

.btn-primary {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.btn-primary:hover { opacity: .9; }

.project-edit {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.project-edit + .project-edit { margin-top: 12px; }
.project-edit-head { display: flex; align-items: flex-start; gap: 10px; }
.icon-input {
  width: 48px;
  text-align: center;
  padding: 8px 6px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 16px;
}
.head-field {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sub);
}
.head-field input {
  flex: 1;
  min-width: 120px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
}
.head-field input.invalid { border-color: #ef4444; }
.field-error { color: #ef4444; font-size: 12px; width: 100%; }
.pid {
  font-size: 12px;
  color: var(--sub);
  background: var(--chip);
  padding: 2px 8px;
  border-radius: 6px;
}
.btn-danger {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}
.btn-danger:hover { background: #ef4444; color: #fff; }

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 16px;
}
.span-2 { grid-column: span 2; }
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: span 1; }
}

.stack-field { display: grid; gap: 4px; font-size: 13px; color: var(--sub); }
.stack-field input {
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
}

.empty-hint { padding: 24px; text-align: center; color: var(--sub); font-size: 14px; }

.form-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-secondary {
  background: transparent;
  color: var(--sub);
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.btn-secondary:hover { color: var(--text); border-color: var(--sub); }
</style>
