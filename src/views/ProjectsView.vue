<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import BaseCard from '../components/BaseCard.vue'
import { useProjectsStore } from '../stores/projects.js'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const projectsStore = useProjectsStore()
const authStore = useAuthStore()

const { projects, projectCount, allStacks } = storeToRefs(projectsStore)
const canEdit = computed(() => authStore.isLoggedIn)

// 跳转详情页
function goDetail(id) {
  router.push({ name: 'project-detail', params: { id } })
}

// ---------- 对话框表单（新增/编辑）----------
const dialogVisible = ref(false)
const isEdit = ref(false)
// 表单数据：reactive 让 el-form 的 v-model 双向绑定
const form = reactive({
  id: '', icon: '📦', name: '', period: '', role: '',
  stack: [], summary: '', desc: '', highlights: []
})

// 打开新增对话框
function openAdd() {
  isEdit.value = false
  Object.assign(form, {
    id: '', icon: '📦', name: '', period: '', role: '',
    stack: [], summary: '', desc: '', highlights: []
  })
  dialogVisible.value = true
}

// 打开编辑对话框
function openEdit(row) {
  isEdit.value = true
  Object.assign(form, JSON.parse(JSON.stringify(row)))
  dialogVisible.value = true
}

// 保存（新增或更新）
function saveProject() {
  // 校验
  if (!form.name.trim()) { ElMessage.warning('请输入项目名称'); return }
  if (!form.id.trim()) { ElMessage.warning('请输入项目 id'); return }
  if (!/^[a-zA-Z0-9-]+$/.test(form.id.trim())) {
    ElMessage.warning('id 只能包含字母、数字、连字符'); return
  }
  // id 唯一性校验（编辑时排除自身）
  const dup = projects.value.find(p => p.id === form.id.trim() && (!isEdit.value || p.id !== form._originalId))
  if (dup) { ElMessage.warning('该 id 已存在，详情页路由会冲突'); return }

  const data = {
    ...form,
    id: form.id.trim(),
    name: form.name.trim(),
    highlights: form.highlights.filter(Boolean)
  }

  if (isEdit.value) {
    projectsStore.updateProject(form._originalId, data)
    ElMessage.success('项目已更新')
  } else {
    projectsStore.addProject(data)
    ElMessage.success('项目已新增')
  }
  dialogVisible.value = false
}

// 删除
async function removeProject(row) {
  try {
    await ElMessageBox.confirm(`确定删除项目「${row.name}」吗？`, '提示', { type: 'warning' })
    projectsStore.removeProject(row.id)
    ElMessage.success('已删除')
  } catch (e) { /* 取消 */ }
}

// 技术栈输入：用 el-select multiple，手动输入后回车添加
function stackInputChange(val) {
  // val 是 el-select 的值数组，不需要额外处理
}
</script>

<template>
  <BaseCard id="projects" :title="`项目作品（共 ${projectCount} 个）`">
    <!-- 新增按钮：仅管理员可见 -->
    <div style="margin-bottom: 16px; display: flex; justify-content: flex-end">
      <el-button v-if="canEdit" type="primary" :icon="'Plus'" @click="openAdd">新增项目</el-button>
    </div>

    <!-- el-table：列表组件展示项目 -->
    <el-table :data="projects" border stripe style="width: 100%">
      <el-table-column label="图标" width="70" align="center">
        <template #default="{ row }">
          <span style="font-size: 24px">{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项目名称" min-width="140" />
      <el-table-column prop="period" label="时间" width="140" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column label="技术栈" min-width="180">
        <template #default="{ row }">
          <el-tag v-for="s in row.stack" :key="s" size="small" style="margin-right: 4px">{{ s }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="goDetail(row.id)">详情</el-button>
          <el-button v-if="canEdit" size="small" type="success" link @click="openEdit(row)">编辑</el-button>
          <el-button v-if="canEdit" size="small" type="danger" link @click="removeProject(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 空状态 -->
    <el-empty v-if="!projects.length" description="暂无项目" />

    <!-- el-dialog + el-form：新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑项目' : '新增项目'"
      width="600px"
      destroy-on-close
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="图标">
          <el-input v-model="form.icon" maxlength="4" style="width: 80px" />
        </el-form-item>
        <el-form-item label="项目名称" required>
          <el-input v-model="form.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目id" required>
          <el-input v-model="form.id" placeholder="用于URL，如 portfolio" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="form.period" placeholder="如 2026.09 - 至今" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.role" placeholder="如 独立开发" />
        </el-form-item>
        <el-form-item label="技术栈">
          <!-- el-select multiple：多选下拉，allow-create 允许创建新标签 -->
          <el-select
            v-model="form.stack"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或输入技术栈，回车添加"
            style="width: 100%"
          >
            <el-option v-for="s in allStacks" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.summary" placeholder="一句话简介" />
        </el-form-item>
        <el-form-item label="详细介绍">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="项目详细介绍" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProject">保存</el-button>
      </template>
    </el-dialog>
  </BaseCard>
</template>
