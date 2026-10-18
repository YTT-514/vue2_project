<script setup>
// 通用按钮：variant 控制主次样式
// 事件通过 attribute 透传：父组件 @click 直接绑定到原生 button 上
defineProps({
  variant: { type: String, default: 'primary' } // primary 主按钮 | sub 次按钮
})
</script>

<template>
  <button class="base-btn" :class="variant" type="button">
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.15s, background 0.2s;
}
.base-btn:hover { opacity: 0.88; }

.primary { background: var(--accent); color: #fff; }
.sub {
  background: var(--chip);
  color: var(--chip-text);
  border: 1px solid var(--border);
}
</style>
