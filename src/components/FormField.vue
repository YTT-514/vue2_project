<script setup>
// 通用表单字段：label + 输入控件 + 错误提示
// 默认渲染 input（type 可配置），支持 v-model 双向绑定
// 通过作用域插槽 { value, update } 可自定义输入控件（如 textarea）
defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' }
})
const model = defineModel()

// 供作用域插槽调用的更新函数
function update(val) {
  model.value = val
}
</script>

<template>
  <label class="form-field">
    <span class="field-label">{{ label }}</span>
    <slot :value="model" :update="update">
      <input v-model="model" :type="type" :class="{ invalid: error }" />
    </slot>
    <span v-if="error" class="field-error">{{ error }}</span>
  </label>
</template>

<style scoped>
.form-field { display: flex; flex-direction: column; gap: 4px; }
.field-label { font-size: 13px; color: var(--sub); }
.form-field input,
.form-field textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}
.form-field textarea { resize: vertical; line-height: 1.6; }
.invalid { border-color: #ef4444 !important; }
.field-error { font-size: 12px; color: #ef4444; }
</style>
