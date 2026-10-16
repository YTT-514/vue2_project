import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useProjectsStore } from '../stores/projects.js'
import { useArticlesStore } from '../stores/articles.js'

// 路由表：name 与左侧/顶部导航的 id 一一对应，便于同步高亮
// meta.title 是页面标题，由下方 afterEach 守卫同步到浏览器标签页
const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: '个人信息' } },
  // 重定向：访问 /home 时自动跳回 /（配置式重定向）
  { path: '/home', redirect: '/' },
  { path: '/skills', name: 'skills', component: () => import('../views/SkillsView.vue'), meta: { title: '技能' } },
  { path: '/interests', name: 'interests', component: () => import('../views/InterestsView.vue'), meta: { title: '兴趣' } },
  { path: '/education', name: 'education', component: () => import('../views/EducationView.vue'), meta: { title: '学习经历' } },
  { path: '/honors', name: 'honors', component: () => import('../views/HonorsView.vue'), meta: { title: '荣誉成就' } },
  // 项目列表页
  { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue'), meta: { title: '项目展示' } },
  // 动态路由：:id 为路由参数，如 /projects/portfolio、/projects/weather-app
  // 标题取决于具体项目，在 afterEach 里按参数动态生成
  { path: '/projects/:id', name: 'project-detail', component: () => import('../views/ProjectDetailView.vue') },
  // 文章列表页
  { path: '/articles', name: 'articles', component: () => import('../views/ArticlesView.vue'), meta: { title: '文章列表' } },
  // 文章详情页：动态路由 :id
  { path: '/articles/:id', name: 'article-detail', component: () => import('../views/ArticleDetailView.vue') },
  // 登录页：meta.layout = 'blank'，App.vue 据此使用空白布局（无顶栏/侧栏）
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { layout: 'blank', title: '登录' } },
  // 后台管理（嵌套路由）：父路由是布局壳，子页面渲染在它内部的 <router-view> 出口
  // meta 定义在父路由上，子路由的 to.meta 会合并继承，守卫对整个 /admin/* 生效
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, title: '后台管理' },
    // 重定向：访问 /admin 时自动跳到默认子页面
    redirect: { name: 'admin-profile' },
    children: [
      { path: 'profile', name: 'admin-profile', component: () => import('../views/AdminProfilePanel.vue'), meta: { title: '个人简介' } },
      { path: 'projects', name: 'admin-projects', component: () => import('../views/AdminProjectsPanel.vue'), meta: { title: '项目信息' } },
      { path: 'articles', name: 'admin-articles', component: () => import('../views/AdminArticlesPanel.vue'), meta: { title: '文章管理' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫：结合 auth store 的登录状态控制后台访问
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // 1. 访问需要登录的页面但未登录 → 跳登录页，用 query 记录来源，登录后回跳
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 2. 已登录再访问登录页 → 回到来源页或进后台
  //    校验 redirect 必须是字符串且以 / 开头，防止开放重定向漏洞
  if (to.name === 'login' && authStore.isLoggedIn) {
    const redirect =
      typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/')
        ? to.query.redirect
        : '/admin'
    return redirect
  }
})

// 全局后置守卫：导航完成后同步浏览器标签页标题
// to.matched 是本次导航的匹配链（父 → 子），把链上的 meta.title 拼接起来，
// 嵌套页面自然得到层级标题，如「后台管理 · 个人简介」
router.afterEach((to) => {
  let title = to.matched.map(r => r.meta.title).filter(Boolean).join(' · ')

  // 动态路由 /projects/:id：标题跟随具体项目内容，id 无效时给出提示
  if (to.name === 'project-detail') {
    const projectsStore = useProjectsStore()
    const p = projectsStore.getProjectById(to.params.id)
    title = p ? `项目详情 · ${p.name}` : '项目未找到'
  }

  // 动态路由 /articles/:id：标题跟随具体文章内容
  if (to.name === 'article-detail') {
    const articlesStore = useArticlesStore()
    const a = articlesStore.getArticleById(to.params.id)
    title = a ? `文章 · ${a.title}` : '文章未找到'
  }

  document.title = title ? `${title} · 个人主页` : '个人主页'
})

export default router
