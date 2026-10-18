<script setup>
import { computed } from 'vue'

// 图集预览弹窗：展示某个兴趣的全部图片
// skill：兴趣对象（含 name、images 数组）
// v-model:current-index：当前图片索引，与父组件双向同步
const props = defineProps({
  skill: { type: Object, required: true }
})
const currentIndex = defineModel('currentIndex', { type: Number, default: 0 })
const emit = defineEmits(['close'])

const images = computed(() => props.skill.images || [])
const current = computed(() => images.value[currentIndex.value] || '')

function prev() {
  const len = images.value.length
  if (!len) return
  currentIndex.value = (currentIndex.value - 1 + len) % len
}
function next() {
  const len = images.value.length
  if (!len) return
  currentIndex.value = (currentIndex.value + 1) % len
}
function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}
</script>

<template>
  <!-- 点击遮罩空白处关闭弹窗 -->
  <div class="modal-overlay" @click.self="emit('close')" tabindex="0" @keydown="onKeydown">
    <div class="modal-content">
      <div class="modal-head">
        <span class="modal-title">{{ skill.name }} · {{ currentIndex + 1 }} / {{ images.length }}</span>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>
      <div class="modal-body">
        <button class="nav-btn" @click="prev" v-if="images.length > 1">‹</button>
        <img :src="current" :alt="skill.name" class="preview-img" />
        <button class="nav-btn" @click="next" v-if="images.length > 1">›</button>
      </div>
      <!-- 缩略图导航 -->
      <div class="thumbs" v-if="images.length > 1">
        <img
          v-for="(img, i) in images"
          :key="i"
          :src="img"
          :class="['thumb', { active: i === currentIndex }]"
          @click="currentIndex = i"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  outline: none;
}
.modal-content {
  background: var(--card);
  border-radius: 16px;
  padding: 16px;
  max-width: min(860px, 92vw);
  max-height: 90vh;
  overflow: auto;
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.modal-title { font-size: 15px; font-weight: 600; color: var(--text); }
.close-btn {
  background: transparent;
  border: none;
  font-size: 22px;
  color: var(--sub);
  cursor: pointer;
  line-height: 1;
}
.modal-body {
  display: flex;
  align-items: center;
  gap: 10px;
}
.preview-img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 10px;
  object-fit: contain;
  flex: 1;
  min-width: 0;
}
.nav-btn {
  background: var(--chip);
  color: var(--chip-text);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
}
.thumbs {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.thumb {
  width: 64px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.55;
  border: 2px solid transparent;
}
.thumb.active { opacity: 1; border-color: var(--accent); }
</style>
