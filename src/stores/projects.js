import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 项目 store：id 用作动态路由参数 /projects/:id
// state → projects；getters → 计数与技术栈汇总；actions → 查找/增删
export const useProjectsStore = defineStore('projects', () => {
  // ---------- state ----------
  const projects = ref([
    {
      id: 'portfolio',
      icon: '🏠',
      name: '个人主页网站',
      period: '2026.09 - 至今',
      role: '独立开发',
      stack: ['Vue 3', 'Vue Router', 'Vite', 'Composition API'],
      summary: '展示个人信息、技能、学习经历与荣誉的个人站点。',
      desc: '本项目即当前网站：基于 Vue 3 组合式 API 与 Vite 构建，采用单页应用（SPA）架构，通过 Vue Router 的 createWebHistory 模式实现页面导航。项目中综合运用了 defineProps / defineEmits 父子通信、defineModel 双向绑定、插槽内容定制、动态路由参数等核心特性。',
      highlights: [
        '组件化拆分：页面拆分为 10+ 个可复用组件',
        '主题切换：CSS 变量实现亮/暗主题一键切换',
        '动态路由：/projects/:id 路由参数驱动详情页渲染'
      ]
    },
    {
      id: 'campus-market',
      icon: '🛒',
      name: '校园二手交易平台',
      period: '2025.03 - 2025.06',
      role: '前端负责人（3 人团队）',
      stack: ['Vue 3', 'Element Plus', 'Pinia', 'Axios'],
      summary: '面向在校学生的二手物品发布、浏览与交易撮合平台。',
      desc: '负责商品列表、发布表单与消息中心三个核心模块的前端开发。使用 Element Plus 构建表单与表格，Pinia 管理登录态与购物车，Axios 封装拦截器统一处理 Token 刷新与错误提示。',
      highlights: [
        '商品列表虚拟滚动，长列表流畅渲染',
        '图片拖拽上传与本地预览',
        ' Axios 拦截器统一处理 401 与 Token 无感刷新'
      ]
    },
    {
      id: 'weather-app',
      icon: '⛅',
      name: '天气预报小应用',
      period: '2024.11 - 2024.12',
      role: '独立开发',
      stack: ['Vue 3', 'Vite', '公开天气 API'],
      summary: '支持城市搜索与未来 7 天预报的轻量天气查询工具。',
      desc: '调用公开天气 API，实现城市搜索、当前天气展示与 7 日预报折线图。练习了组合式 API 中 watch 侦听搜索词防抖、computed 派生视图数据，以及 fetch 异步请求的错误处理。',
      highlights: [
        '搜索防抖 300ms，减少无效请求',
        'ECharts 绘制温度变化折线图',
        '响应式布局，适配手机与桌面'
      ]
    }
  ])

  // ---------- getters ----------
  const projectCount = computed(() => projects.value.length)
  // 所有项目的技术栈去重汇总（可用于技能云展示）
  const allStacks = computed(() =>
    [...new Set(projects.value.flatMap(p => p.stack))]
  )

  // ---------- actions（CRUD） ----------
  // 查：根据 id 查找项目（详情页使用）
  function getProjectById(id) {
    return projects.value.find(p => p.id === id)
  }
  // 增：新增项目
  function addProject(project) {
    projects.value.push({ ...project })
  }
  // 改：按 id 匹配后合并更新字段
  function updateProject(id, data) {
    const target = projects.value.find(p => p.id === id)
    if (target) Object.assign(target, data)
  }
  // 删：删除项目
  function removeProject(id) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx > -1) projects.value.splice(idx, 1)
  }
  // 批量保存：草稿模式整体替换为归一化后的新列表
  // 用于后台管理页「保存修改」一次性写回全部增删改
  function saveProjects(list) {
    projects.value.splice(0, projects.value.length, ...list)
  }

  return {
    projects,
    projectCount, allStacks,
    getProjectById, addProject, updateProject, removeProject, saveProjects
  }
})
