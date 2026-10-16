import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 学习经历 + 荣誉成就 store
// state → education/honors；getters → 计数；actions → 增删
export const useEducationStore = defineStore('education', () => {
  // ---------- state ----------
  const education = ref([
    {
      period: '2022.09 - 至今',
      school: '重庆工程学院',
      major: '计算机科学与技术',
      degree: '本科',
      detail: '主修前端开发方向，学习 HTML/CSS/JavaScript、Vue、React 等前端技术。'
    },
    {
      period: '2019.09 - 2022.06',
      school: 'XX 高级中学',
      major: '理科',
      degree: '高中',
      detail: ''
    }
  ])

  const honors = ref([
    {
      icon: '🥇',
      title: '校级一等奖学金',
      organization: '重庆工程学院',
      date: '2023',
      desc: '学业成绩优异，获得校级一等奖学金。'
    },
    {
      icon: '🏆',
      title: '网页设计大赛二等奖',
      organization: '计算机学院',
      date: '2023',
      desc: '参与学院网页设计大赛，作品获得二等奖。'
    },
    {
      icon: '📜',
      title: '英语四级证书',
      organization: '教育部考试中心',
      date: '2023',
      desc: '通过全国大学英语四级考试。'
    }
  ])

  // ---------- getters ----------
  const educationCount = computed(() => education.value.length)
  const honorsCount = computed(() => honors.value.length)
  // 按时间倒序排列的学习经历（展示用）
  const educationByDateDesc = computed(() =>
    [...education.value].sort((a, b) => b.period.localeCompare(a.period))
  )

  // ---------- actions ----------
  // 新增学习经历
  function addEducation(entry) {
    if (!entry.school) return
    education.value.push({ ...entry })
  }
  // 删除学习经历
  function removeEducation(index) {
    education.value.splice(index, 1)
  }
  // 新增荣誉
  function addHonor(entry) {
    if (!entry.title) return
    honors.value.push({ ...entry })
  }
  // 删除荣誉
  function removeHonor(index) {
    honors.value.splice(index, 1)
  }

  return {
    education, honors,
    educationCount, honorsCount, educationByDateDesc,
    addEducation, removeEducation, addHonor, removeHonor
  }
})
