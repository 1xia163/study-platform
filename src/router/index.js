import { createRouter, createWebHistory } from 'vue-router'

/**
 * 路由表 —— 严格对应 02《页面设计说明》的 9 个页面
 *
 * 页面           路由              功能
 * P01 学习首页    /                F01 / F05
 * P02 学习计划    /plan            F02
 * P03 笔记列表    /note            F03
 * P04 笔记编辑    /note/new、/note/:id   F03 / F05
 * P05 专注学习    /focus           F04
 * P06 真题题库    /bank            F06
 * P07 规则组卷    /paper/create    F07
 * P08 作答反馈    /paper/:id       F08
 * P09 练习记录    /record          F09
 *
 * meta.group 用于导航高亮：home / plan / note / focus / selftest
 * meta.hideTabBar 手机端隐藏底部导航（答题页使用）
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: '学习首页', group: 'home' },
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('@/views/PlanPage.vue'),
    meta: { title: '学习计划与待办', group: 'plan' },
  },
  {
    path: '/note',
    name: 'note-list',
    component: () => import('@/views/NoteListPage.vue'),
    meta: { title: '课程笔记', group: 'note' },
  },
  {
    path: '/note/new',
    name: 'note-new',
    component: () => import('@/views/NoteEditPage.vue'),
    meta: { title: '新建笔记', group: 'note' },
  },
  {
    // 必须放在 /note/new 之后，否则 new 会被当成 :id
    path: '/note/:id',
    name: 'note-edit',
    component: () => import('@/views/NoteEditPage.vue'),
    meta: { title: '编辑笔记', group: 'note' },
    props: true,
  },
  {
    path: '/focus',
    name: 'focus',
    component: () => import('@/views/FocusPage.vue'),
    meta: { title: '专注学习', group: 'focus' },
  },
  {
    path: '/bank',
    name: 'bank',
    component: () => import('@/views/BankPage.vue'),
    meta: { title: '真题题库', group: 'selftest' },
  },
  {
    path: '/paper/create',
    name: 'paper-create',
    component: () => import('@/views/PaperCreatePage.vue'),
    meta: { title: '规则组卷', group: 'selftest' },
  },
  {
    // 同样必须在 /paper/create 之后
    path: '/paper/:id',
    name: 'paper-detail',
    component: () => import('@/views/PaperDetailPage.vue'),
    meta: { title: '作答与反馈', group: 'selftest', hideTabBar: true },
    props: true,
  },
  {
    path: '/record',
    name: 'record',
    component: () => import('@/views/RecordPage.vue'),
    meta: { title: '练习记录与错题', group: 'selftest' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { title: '页面不存在' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title
  document.title = title ? `${title} · 个人学习平台` : '个人学习平台'
})

export default router
