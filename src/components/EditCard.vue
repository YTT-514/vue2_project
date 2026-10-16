<script setup>
import { ref } from 'vue'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'
import FormField from './FormField.vue'

// 父组件通过 props 传入当前个人信息（只读，编辑结果通过 emit 交还父组件）
const props = defineProps({
  profile: { type: Object, required: true }
})
// 保存时把新数据抛给父组件，由父组件决定如何更新 profile
const emit = defineEmits(['save'])

// 编辑状态与草稿由组件自己管理
const editing = ref(false)
const draft = ref({})

function toggleEdit() {
  if (editing.value) {
    editing.value = false
  } else {
    // 复制一份当前 profile 作为草稿
    draft.value = { ...props.profile }
    editing.value = true
  }
}

function saveProfile() {
  emit('save', { ...draft.value })
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<template>
  <BaseCard id="edit" title="编辑个人信息">
    <template #header-extra>
      <BaseButton @click="toggleEdit">{{ editing ? '取消' : '编辑' }}</BaseButton>
    </template>

    <div v-if="editing" class="edit-form">
      <FormField label="姓名" v-model="draft.name" type="text" />
      <FormField label="年龄" v-model="draft.age" type="number" />
      <FormField label="标语" v-model="draft.tagline" type="text" />
      <FormField label="电话" v-model="draft.phone" type="tel" />
      <FormField label="邮箱" v-model="draft.email" type="email" />
      <FormField label="网站" v-model="draft.website" type="text" />
      <!-- 使用 FormField 的作用域插槽，自定义为 textarea 多行输入 -->
      <FormField label="简介" v-model="draft.bio">
        <template #default="{ value, update }">
          <textarea
            :value="value"
            @input="update($event.target.value)"
            rows="3"
          />
        </template>
      </FormField>
    </div>
    <p v-else class="hint">点击「编辑」修改个人信息，体验 v-model 双向绑定。</p>

    <!-- BaseCard 的 footer 具名插槽：底部操作按钮区 -->
    <template #footer v-if="editing">
      <BaseButton @click="saveProfile">保存</BaseButton>
      <BaseButton variant="sub" @click="cancelEdit">取消</BaseButton>
    </template>
  </BaseCard>
</template>

<style scoped>
.edit-form { display: grid; gap: 12px; margin-top: 16px; }
</style>
