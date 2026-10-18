import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'

// 个人信息 store：展示与编辑共享同一份响应式数据
// state → profile；getters → 派生展示数据；actions → 修改入口
export const useProfileStore = defineStore('profile', () => {
  // ---------- state ----------
  const profile = reactive({
    name: '喻婷婷',
    age: 21,
    tagline: '前端开发学习者 · 用代码构建美好界面',
    location: '中国',
    phone: '13193297416',
    email: '3331581492@qq.com',
    website: 'https://example.com',
    avatar: '/IMG_1102.png',
    school: '重庆工程学院',
    major: '计算机科学与技术',
    bio: '正在学习 Vue 3 与前端工程化，喜欢把想法变成可交互的界面。'
  })

  // 初始快照，用于 reset action
  const initialProfile = { ...profile }

  // ---------- getters ----------
  // 是否设置了头像
  const hasAvatar = computed(() => !!profile.avatar)
  // 格式化展示名：姓名 + 签名
  const displayName = computed(() => `${profile.name} · ${profile.tagline}`)
  // 年龄展示文案
  const ageText = computed(() => `${profile.age} 岁`)

  // ---------- actions ----------
  // 合并更新个人信息（EditCard 保存时调用）
  function updateProfile(newData) {
    Object.assign(profile, newData)
  }
  // 重置为初始值
  function resetProfile() {
    Object.assign(profile, initialProfile)
  }

  return { profile, hasAvatar, displayName, ageText, updateProfile, resetProfile }
})
