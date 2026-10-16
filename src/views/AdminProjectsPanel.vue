<script setup>
import { reactive, ref, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { onBeforeRouteLeave } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useProjectsStore } from '../stores/projects.js'

const projectsStore = useProjectsStore()
const { projects } = storeToRefs(projectsStore)

// 嵌套路由子页面：/admin/projects
// 草稿模式：新增/编辑/删除都在副本上操作，「保存」统一写回 store，「取消」放弃全部修改。
// 相比实时生效，草稿模式可以放心修改、随时反悔，出错也不会污染前台数据。
const clone = p => JSON.parse(JSON.stringify(p))
const drafts = reactive(projects.value.map(clone))
// 是否有未保存的修改（用于离开提醒）
const dirty = computed(() => JSON.stringify(drafts) !== JSON.stringify(projects.value))

// ---------- el-dialog 表单状态 ----------
const dialogVisible = ref(false)
const editingIndex = ref(-1) // -1 表示新增
const formRef = ref()

const splitList = s => (s || '').split(/[、,，]\s*/).map(x => x.trim()).filter(Boolean)

function emptyForm() {
  return {
    id: '', icon: '📦', name: '', period: '', role: '',
    stackText: '', summary: '', desc: '', highlightsText: ''
  }
}
const form = reactive(emptyForm())

// el-form 校验规则：名称必填；id 必填、格式合法且不重复
// id 用作动态路由参数 /projects/:id，错了详情页就 404，所以校验要严
const rules = {
  name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
  id: [
    { required: true, message: '项目 id 不能为空', trigger: 'blur' },
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

// ---------- 打开对话框（新增 / 编辑） ----------
function openAdd() {
  editingIndex.value = -1
  Object.assign(form, emptyForm())
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}
function openEdit(row, index) {
  editingIndex.value = index
  Object.assign(form, {
    ...row,
    stackText: row.stack.join('、'),
    highlightsText: row.highlights.join('、')
  })
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 确定：校验通过后写入草稿（不直接动 store），点「保存修改」才真正生效
function confirmDialog() {
  formRef.value.validate(valid => {
    if (!valid) return
    const payload = {
      id: form.id.trim(),
      icon: form.icon || '📦',
      name: form.name.trim(),
      period: form.period,
      role: form.role,
      stack: splitList(form.stackText),
      summary: form.summary,
      desc: form.desc,
      highlights: splitList(form.highlightsText)
    }
    if (editingIndex.value === -1) drafts.push(payload)
    else Object.assign(drafts[editingIndex.value], payload)
    dialogVisible.value = false
    ElMessage.success(editingIndex.value === -1 ? '已新增，点击「保存修改」后生效' : '已修改，点击「保存修改」后生效')
  })
}

// ---------- 删除（草稿层面，el-popconfirm 已二次确认） ----------
function removeRow(index) {
  drafts.splice(index, 1)
  ElMessage.success('已删除，点击「保存修改」后生效')
}

// ---------- 批量保存 / 取消 ----------
function saveAll() {
  // 草稿归一化后通过 store action 写回，前台列表页/详情页立即同步
  // 数据流：组件草稿 → action → state
  projectsStore.saveProjects(drafts.map(d => ({ ...d })))
  ElMessage.success(`已保存 ${drafts.length} 个项目`)
}
function cancelEdit() {
  drafts.splice(0, drafts.length, ...projects.value.map(clone))
  ElMessage.info('已放弃全部修改')
}

// 组件内守卫：有未保存修改时离开（切页签/去别的页面）需确认
onBeforeRouteLeave(async () => {
  if (!dirty.value) return true
  try {
    await ElMessageBox.confirm('项目信息有未保存的修改，确定离开吗？', '提示', {
      type: 'warning', confirmButtonText: '离开', cancelButtonText: '留下'
    })
    return true
  } catch {
    return false
  }
})
</script>

<template>
  <!-- el-alert：提示说明条 -->
  <el-alert
    class="tip"
    type="info"
    show-icon
    :closable="false"
    title="修改不会立即生效，点击「保存修改」后前台列表与详情页才同步；id 用作详情页动态路由参数（/projects/:id）"
  />

  <div class="toolbar">
    <el-tag v-if="dirty" type="warning" effect="light">● 有未保存的修改</el-tag>
    <span v-else class="no-change">暂无未保存修改</span>
    <el-button type="primary" :icon="Plus" @click="openAdd">新增项目</el-button>
  </div>

  <!-- el-table：以表格形式展示草稿列表 -->
  <el-table :data="drafts" border class="table" empty-text="暂无项目，点击「新增项目」添加">
    <el-table-column label="图标" width="70" align="center">
      <template #default="{ row }"><span class="icon-cell">{{ row.icon }}</span></template>
    </el-table-column>
    <el-table-column prop="name" label="项目名称" min-width="140" show-overflow-tooltip />
    <el-table-column label="URL 路径" min-width="180">
      <template #default="{ row }"><code class="pid">/projects/{{ row.id || '?' }}</code></template>
    </el-table-column>
    <el-table-column prop="period" label="时间" min-width="140" />
    <el-table-column label="技术栈" min-width="220">
      <template #default="{ row }">
        <el-tag v-for="s in row.stack" :key="s" size="small" effect="plain" class="stack-tag">{{ s }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="160" align="center" fixed="right">
      <template #default="{ row, $index }">
        <el-button type="primary" link :icon="Edit" @click="openEdit(row, $index)">编辑</el-button>
        <!-- el-popconfirm：删除二次确认气泡，替代原生 confirm() -->
        <el-popconfirm title="确定删除该项目吗？（保存后生效）" @confirm="removeRow($index)">
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

  <!-- el-dialog：新增/编辑弹窗，内嵌 el-form -->
  <el-dialog v-model="dialogVisible" :title="editingIndex === -1 ? '新增项目' : '编辑项目'" width="640px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="92px">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name" placeholder="如：个人主页网站" />
      </el-form-item>
      <el-form-item label="项目 id" prop="id">
        <el-input v-model="form.id" placeholder="英文/数字/连字符，用于 URL" />
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="form.icon" maxlength="4" style="width: 100px" />
      </el-form-item>
      <el-form-item label="时间">
        <el-input v-model="form.period" placeholder="如：2026.09 - 至今" />
      </el-form-item>
      <el-form-item label="担任角色">
        <el-input v-model="form.role" placeholder="如：独立开发" />
      </el-form-item>
      <el-form-item label="技术栈">
        <el-input v-model="form.stackText" placeholder="顿号或逗号分隔，如：Vue 3、Vite、Pinia" />
      </el-form-item>
      <el-form-item label="一句话简介">
        <el-input v-model="form.summary" type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="项目介绍">
        <el-input v-model="form.desc" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="项目亮点">
        <el-input v-model="form.highlightsText" type="textarea" :rows="3" placeholder="顿号或逗号分隔" />
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
.icon-cell { font-size: 20px; }
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
