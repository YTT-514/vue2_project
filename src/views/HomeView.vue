<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import ProfileCard from '../components/ProfileCard.vue'
import EditCard from '../components/EditCard.vue'
import { useProfileStore } from '../stores/profile.js'
import { useAuthStore } from '../stores/auth.js'

const profileStore = useProfileStore()
const authStore = useAuthStore()

// profile 是 reactive 对象：用 storeToRefs 解构后仍保持响应式
// 同时解构 getters（ageText、hasAvatar）用于展示
const { profile, ageText, hasAvatar } = storeToRefs(profileStore)

// 编辑个人信息卡片仅登录（管理员）后显示，访客视角主页为纯展示
const canEdit = computed(() => authStore.isLoggedIn)

// 保存编辑后的个人信息：调用 store 的 updateProfile action，避免组件直接改 state
function saveProfile(newProfile) {
  profileStore.updateProfile(newProfile)
}
</script>

<template>
  <ProfileCard :profile="profile" :age-text="ageText" :has-avatar="hasAvatar" />
  <EditCard v-if="canEdit" :profile="profile" @save="saveProfile" />
</template>
