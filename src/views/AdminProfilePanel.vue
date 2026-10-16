<script setup>
import { reactive, ref, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import FormField from '../components/FormField.vue'
import { useProfileStore } from '../stores/profile.js'

const profileStore = useProfileStore()
const { profile } = profileStore

// 嵌套路由子页面：/admin/profile
// 草稿模式：编辑副本，「保存」才写回 store，「取消」放弃修改；store 是响应式单例，写回后前台页面立即同步
const profileDraft = reactive({ ...profile })
const profileMsg = ref('')
const errors = reactive({ name: '', email: '' })

// 是否有未保存的修改：草稿与 store 数据逐字比较（保存/取消后两者一致 → false）
const dirty = computed(() => JSON.stringify(profileDraft) !== JSON.stringify(profile))

// ---------- 表单校验：姓名必填、邮箱格式 ----------
function validate() {
  errors.name = profileDraft.name.trim() ? '' : '姓名不能为空'
  const email = profileDraft.email.trim()
  errors.email = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : '邮箱格式不正确'
  return !errors.name && !errors.email
}

// ---------- 保存 / 取消 ----------
function saveProfile() {
  if (!validate()) {
    profileMsg.value = ''
    return
  }
  Object.assign(profile, profileDraft)
  profileMsg.value = '✅ 已保存，前台页面已同步更新'
  setTimeout(() => (profileMsg.value = ''), 2000)
}

// 取消修改：草稿恢复为 store 当前数据
function cancelEdit() {
  Object.assign(profileDraft, profile)
  errors.name = ''
  errors.email = ''
  profileMsg.value = ''
}

// 组件内守卫：有未保存修改时离开（切页签/去别的页面）需确认
onBeforeRouteLeave(() => {
  if (dirty.value && !confirm('个人简介有未保存的修改，确定离开吗？')) return false
})
</script>

<template>
  <div class="save-bar">
    <span v-if="dirty" class="dirty-hint">● 有未保存的修改</span>
    <span v-if="profileMsg" class="save-msg">{{ profileMsg }}</span>
  </div>
  <div class="form-grid">
    <FormField label="姓名" v-model="profileDraft.name" :error="errors.name" />
    <FormField label="一句话签名" v-model="profileDraft.tagline" />
    <FormField label="年龄" v-model="profileDraft.age" type="number" />
    <FormField label="所在地" v-model="profileDraft.location" />
    <FormField label="手机" v-model="profileDraft.phone" />
    <FormField label="邮箱" v-model="profileDraft.email" :error="errors.email" />
    <FormField label="个人网站" v-model="profileDraft.website" />
    <FormField label="学校" v-model="profileDraft.school" />
    <FormField label="专业" v-model="profileDraft.major" />
    <FormField label="个人简介" v-model="profileDraft.bio" class="span-2">
      <template #default="{ value, update }">
        <textarea :value="value" @input="update($event.target.value)" rows="3"></textarea>
      </template>
    </FormField>
  </div>
  <div class="form-actions">
    <button class="btn-secondary" @click="cancelEdit">取消修改</button>
    <button class="btn-primary" @click="saveProfile">保存修改</button>
  </div>
</template>

<style scoped>
.save-bar { min-height: 18px; display: flex; gap: 12px; align-items: center; }
.dirty-hint { color: #f59e0b; font-size: 13px; }
.save-msg { color: var(--accent); font-size: 13px; }

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
.form-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}
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
