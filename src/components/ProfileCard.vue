<script setup>
import { ref } from 'vue'
import BaseCard from './BaseCard.vue'
import BaseButton from './BaseButton.vue'

// 父组件通过 props 传入个人信息（单向数据流）
// ageText / hasAvatar 为可选 props，由父组件从 store 的 getter 解构后传入
defineProps({
  profile: { type: Object, required: true },
  ageText: { type: String, default: '' },
  hasAvatar: { type: Boolean, default: true }
})

// 详情展开/收起状态由组件自己管理
const showDetails = ref(false)

function toggleDetails() {
  showDetails.value = !showDetails.value
}
</script>

<template>
  <BaseCard id="profile">
    <div class="profile">
      <img v-if="hasAvatar" class="avatar" :src="profile.avatar" :alt="profile.name" />
      <div class="info">
        <h1>{{ profile.name }}</h1>
        <p class="tagline">{{ profile.tagline }}</p>
        <!--
          作用域插槽 #meta：父组件可自定义元数据（年龄/地点/电话等）的展示方式。
          暴露 profile 给父组件。若不提供，则使用默认的 meta 布局。
        -->
        <div class="meta">
          <slot name="meta" :profile="profile">
            <span>🎂 {{ ageText || profile.age + ' 岁' }}</span>
            <span>📍 {{ profile.location }}</span>
            <span>📱 {{ profile.phone }}</span>
            <span>📧 <a :href="'mailto:' + profile.email" v-text="profile.email"></a></span>
            <span>🔗 <a :href="profile.website" target="_blank">个人网站</a></span>
          </slot>
        </div>
      </div>
    </div>

    <BaseButton class="details-btn" @click="toggleDetails">
      {{ showDetails ? '收起详情' : '展开详情' }}
    </BaseButton>
    <div class="details" v-show="showDetails">
      <p><strong>年龄：</strong>{{ ageText || profile.age + ' 岁' }}</p>
      <p><strong>专业：</strong>{{ profile.major }}</p>
      <p><strong>电话：</strong>{{ profile.phone }}</p>
      <p><strong>学校：</strong>{{ profile.school }}</p>
      <p><strong>简介：</strong>{{ profile.bio }}</p>
    </div>
  </BaseCard>
</template>

<style scoped>
.profile {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}
.avatar {
  width: 90px;
  height: 120px;
  border-radius: 10px;
  object-fit: contain;
  background: #fff;
  border: 2px solid var(--accent);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.info h1 { margin: 0 0 6px; font-size: 26px; }
.info .tagline { color: var(--sub); margin: 0 0 10px; font-size: 15px; }
.info .meta { display: flex; gap: 16px; flex-wrap: wrap; color: var(--sub); font-size: 14px; }
.info .meta a { color: var(--accent); text-decoration: none; }
.info .meta a:hover { text-decoration: underline; }
/* 展开详情按钮：与上方信息区拉开间距 */
.details-btn { margin-top: 20px; }
.details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
  line-height: 1.7;
  font-size: 14px;
  color: var(--text);
}
</style>
