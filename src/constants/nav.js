/**
 * 导航配置 —— 桌面顶部导航与手机底部导航共用这份数据
 * 新增页面只改这里，两处导航自动同步
 * 依据 02 设计：桌面「首页 / 计划 / 笔记 / 专注 / 自测▾」
 *              手机「首页 / 计划 / 笔记 / 专注 / 更多」
 */
export const mainNav = [
  { name: 'home', label: '首页', group: 'home' },
  { name: 'plan', label: '学习计划', group: 'plan' },
  { name: 'note-list', label: '课程笔记', group: 'note' },
  { name: 'focus', label: '专注学习', group: 'focus' },
]

export const selfTestNav = [
  { name: 'bank', label: '真题题库' },
  { name: 'paper-create', label: '规则组卷' },
  { name: 'record', label: '练习记录与错题' },
]

export const tabBarNav = [
  { name: 'home', label: '首页', group: 'home', icon: 'home' },
  { name: 'plan', label: '计划', group: 'plan', icon: 'calendar' },
  { name: 'note-list', label: '笔记', group: 'note', icon: 'book' },
  { name: 'focus', label: '专注', group: 'focus', icon: 'clock' },
]
