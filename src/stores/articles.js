import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 文章 store：id 用作动态路由参数 /articles/:id
// state → articles；getters → 计数/分类/标签汇总；actions → 查找/增删
export const useArticlesStore = defineStore('articles', () => {
  // ---------- state ----------
  const articles = ref([
    {
      id: 'vue3-getting-started',
      title: 'Vue 3 组合式 API 入门指南',
      date: '2026-09-15',
      category: '前端开发',
      tags: ['Vue 3', 'Composition API', '前端'],
      summary: '从零开始学习 Vue 3 组合式 API，理解 ref、reactive、computed、watch 的核心概念。',
      content: 'Vue 3 的组合式 API（Composition API）是一次重大的范式转变。它允许我们以函数的方式组织组件逻辑，而不是按选项（data、methods、computed）分散开来。\n\n## ref 与 reactive\n\nref 用于基本类型，reactive 用于对象。ref 需要通过 .value 访问，但在模板中自动解包。\n\n## computed\n\ncomputed 返回一个只读的 ref，当依赖变化时自动重新计算。\n\n## watch\n\nwatch 用于侦听响应式数据的变化，执行副作用。\n\n通过组合式 API，我们可以将相关逻辑聚合在一起，提高代码的可读性和复用性。'
    },
    {
      id: 'css-flexbox-tips',
      title: 'CSS Flexbox 布局技巧总结',
      date: '2026-08-22',
      category: 'CSS',
      tags: ['CSS', 'Flexbox', '布局'],
      summary: 'Flexbox 是现代 CSS 布局的核心工具，本文总结了日常开发中最常用的技巧。',
      content: 'Flexbox（弹性盒子）是 CSS3 引入的一维布局模型，特别适合组件级别的对齐和分布。\n\n## 容器属性\n\n- display: flex — 启用弹性布局\n- flex-direction — 主轴方向（row | column）\n- justify-content — 主轴对齐\n- align-items — 交叉轴对齐\n- flex-wrap — 是否换行\n\n## 项目属性\n\n- flex: 1 — 等比分配剩余空间\n- align-self — 单独设置交叉轴对齐\n\n## 常见布局\n\n水平垂直居中只需三行：display: flex; justify-content: center; align-items: center;'
    },
    {
      id: 'js-async-await',
      title: '深入理解 JavaScript async/await',
      date: '2026-07-10',
      category: 'JavaScript',
      tags: ['JavaScript', '异步', 'async'],
      summary: 'async/await 是 Promise 的语法糖，让异步代码像同步一样直观，但底层仍是事件循环。',
      content: 'async/await 是 ES2017 引入的异步编程语法，让异步代码的书写和阅读更接近同步风格。\n\n## 基本用法\n\nasync 函数总是返回 Promise，await 可以暂停执行直到 Promise 完成。\n\n## 错误处理\n\n使用 try/catch 捕获 await 表达式的异常，比 .catch() 更直观。\n\n## 并发请求\n\n使用 Promise.all 配合 await 可以并行发起多个请求，而不是串行等待。\n\n## 注意事项\n\n- await 只能在 async 函数内使用\n- 错误未被捕获会导致 UnhandledPromiseRejection\n- 循环中使用 await 会串行执行，需要并发时用 Promise.all'
    },
    {
      id: 'git-workflow-guide',
      title: 'Git 团队协作工作流实践',
      date: '2026-06-05',
      category: '工具',
      tags: ['Git', '版本控制', '协作'],
      summary: '从分支策略到代码评审，总结小型团队中 Git 协作的最佳实践。',
      content: 'Git 是团队协作开发的核心工具，合理的工作流能减少冲突、提高效率。\n\n## 分支策略\n\n- main / master — 生产分支，只接受合并\n- develop — 开发集成分支\n- feature/* — 功能分支，完成后合并回 develop\n- hotfix/* — 紧急修复，合并回 main 和 develop\n\n## 常用操作\n\n- git rebase -i — 交互式变基，整理提交历史\n- git stash — 暂存工作区\n- git cherry-pick — 摘取单个 commit\n\n## 代码评审\n\nPull Request 是代码评审的主要形式。每次 PR 应只关注一个功能点，便于审查。'
    }
  ])

  // ---------- getters ----------
  const articleCount = computed(() => articles.value.length)
  // 所有分类（去重）
  const categories = computed(() => [...new Set(articles.value.map(a => a.category))])
  // 所有标签（去重）
  const allTags = computed(() => [...new Set(articles.value.flatMap(a => a.tags))])
  // 按日期倒序排列
  const sortedByDateDesc = computed(() =>
    [...articles.value].sort((a, b) => b.date.localeCompare(a.date))
  )

  // ---------- actions（CRUD） ----------
  // 查：根据 id 查找文章（详情页使用）
  function getArticleById(id) {
    return articles.value.find(a => a.id === id)
  }
  // 增：新增文章
  function addArticle(article) {
    articles.value.push({ ...article })
  }
  // 改：按 id 匹配后合并更新字段
  function updateArticle(id, data) {
    const target = articles.value.find(a => a.id === id)
    if (target) Object.assign(target, data)
  }
  // 删：删除文章
  function removeArticle(id) {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx > -1) articles.value.splice(idx, 1)
  }
  // 批量保存：草稿模式整体替换为归一化后的新列表
  // 用于后台管理页「保存修改」一次性写回全部增删改
  function saveArticles(list) {
    articles.value.splice(0, articles.value.length, ...list)
  }

  return {
    articles,
    articleCount, categories, allTags, sortedByDateDesc,
    getArticleById, addArticle, updateArticle, removeArticle, saveArticles
  }
})
