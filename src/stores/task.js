import { defineStore } from 'pinia'

import { DEFAULT_PRIORITY } from '@/constants/priority'
import { addDays, compareDateString, isOverdue, todayString } from '@/utils/date'

const DAY = 24 * 60 * 60 * 1000

function createTaskId() {
  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * 首次使用的演示任务：日期按「今天 ± N 天」生成，避免过几天全部变成逾期。
 * 这里只是 state 初始值；localStorage 已有 zhike:task 时会被持久化数据覆盖，
 * 用户把任务删光后也不会自动恢复。
 */
function createSeedTasks() {
  const today = todayString()
  const now = Date.now()

  return [
    {
      taskId: 'seed-task-1',
      title: '复习二叉树遍历',
      course: '数据结构',
      knowledgePoint: '二叉树遍历',
      deadline: addDays(today, 4),
      priority: 'medium',
      description: '',
      isCompleted: false,
      completedAt: null,
      linkedNoteIds: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      taskId: 'seed-task-2',
      title: '整理 Python 异常笔记',
      course: 'Python',
      knowledgePoint: '异常处理',
      deadline: addDays(today, -4),
      priority: 'high',
      description: '',
      isCompleted: false,
      completedAt: null,
      linkedNoteIds: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      taskId: 'seed-task-3',
      title: '完成离散数学复盘',
      course: '离散数学',
      knowledgePoint: '图论',
      deadline: addDays(today, -3),
      priority: 'low',
      description: '',
      isCompleted: true,
      completedAt: now - 3 * DAY,
      linkedNoteIds: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      taskId: 'seed-task-4',
      title: '栈与队列专项练习',
      course: '数据结构',
      knowledgePoint: '栈与队列',
      deadline: addDays(today, 1),
      priority: 'high',
      description: '',
      isCompleted: false,
      completedAt: null,
      linkedNoteIds: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      taskId: 'seed-task-5',
      title: 'Python 文件读写实验',
      course: 'Python',
      knowledgePoint: '文件读写',
      deadline: addDays(today, 7),
      priority: 'low',
      description: '',
      isCompleted: false,
      completedAt: null,
      linkedNoteIds: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      taskId: 'seed-task-6',
      title: '命题逻辑错题重做',
      course: '离散数学',
      knowledgePoint: '命题逻辑',
      deadline: addDays(today, -1),
      priority: 'medium',
      description: '',
      isCompleted: true,
      completedAt: now - 1 * DAY,
      linkedNoteIds: [],
      createdAt: now,
      updatedAt: now,
    },
  ]
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: createSeedTasks(),
  }),

  getters: {
    sortedByDeadline: (state) =>
      [...state.tasks].sort((left, right) => compareDateString(left.deadline, right.deadline)),

    todayTasks: (state) =>
      state.tasks.filter((task) => !task.isCompleted && !isOverdue(task.deadline, task.isCompleted)),

    overdueTasks: (state) => state.tasks.filter((task) => isOverdue(task.deadline, task.isCompleted)),

    completedCount: (state) => state.tasks.filter((task) => task.isCompleted).length,

    totalCount: (state) => state.tasks.length,
  },

  actions: {
    addTask(payload = {}) {
      const now = Date.now()
      const isCompleted = Boolean(payload.isCompleted)
      const task = {
        taskId: createTaskId(),
        title: String(payload.title ?? '').trim(),
        course: payload.course ?? '',
        knowledgePoint: payload.knowledgePoint ?? '',
        deadline: payload.deadline ?? '',
        priority: payload.priority ?? DEFAULT_PRIORITY,
        description: payload.description ?? '',
        isCompleted,
        completedAt: isCompleted ? now : null,
        linkedNoteIds: Array.isArray(payload.linkedNoteIds) ? [...payload.linkedNoteIds] : [],
        createdAt: now,
        updatedAt: now,
      }
      this.tasks.push(task)
      return task
    },

    updateTask(taskId, patch = {}) {
      const task = this.tasks.find((item) => item.taskId === taskId)
      if (!task) return null

      const next = { ...patch }
      delete next.taskId
      delete next.createdAt
      Object.assign(task, next)
      if ('isCompleted' in next) {
        task.completedAt = next.isCompleted ? (task.completedAt ?? Date.now()) : null
      }
      task.updatedAt = Date.now()
      return task
    },

    removeTask(taskId) {
      const index = this.tasks.findIndex((item) => item.taskId === taskId)
      if (index === -1) return false
      this.tasks.splice(index, 1)
      return true
    },

    toggleComplete(taskId) {
      const task = this.tasks.find((item) => item.taskId === taskId)
      if (!task) return null
      task.isCompleted = !task.isCompleted
      task.completedAt = task.isCompleted ? Date.now() : null
      task.updatedAt = Date.now()
      return task
    },

    postponeTask(taskId, newDeadline) {
      const task = this.tasks.find((item) => item.taskId === taskId)
      if (!task) return null
      task.deadline = newDeadline
      task.updatedAt = Date.now()
      return task
    },

    linkNotes(taskId, noteIds) {
      const task = this.tasks.find((item) => item.taskId === taskId)
      if (!task) return null
      const ids = Array.isArray(noteIds) ? noteIds : []
      task.linkedNoteIds = [...new Set(ids.filter((id) => typeof id === 'string' && id))]
      task.updatedAt = Date.now()
      return task
    },
  },

  persist: true,
})
