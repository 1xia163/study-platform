import { defineStore } from 'pinia'

import { DEFAULT_MASTERY } from '@/constants/mastery'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

function createNoteId() {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * 首次使用的演示笔记。
 * photos 只存 photoId / fileName / sortOrder，二进制在 IndexedDB（第 10 步接入），
 * 这里只保证照片张数有数据可测。
 */
function createSeedNotes() {
  const now = Date.now()

  return [
    {
      noteId: 'seed-note-1',
      title: '二叉树遍历方法',
      course: '数据结构',
      knowledgePoint: '二叉树遍历',
      tags: ['遍历', '递归'],
      content:
        '先序遍历「根左右」、中序遍历「左根右」、后序遍历「左右根」，层次遍历用队列逐层取出节点。',
      photos: [
        { photoId: 'seed-photo-1-1', fileName: '先序遍历示意图.png', sortOrder: 0 },
        { photoId: 'seed-photo-1-2', fileName: '中序还原笔记.png', sortOrder: 1 },
      ],
      mastery: 'none',
      linkedTaskIds: ['seed-task-1'],
      sourceTaskId: 'seed-task-1',
      createdAt: now - 6 * DAY,
      updatedAt: now - 2 * HOUR,
    },
    {
      noteId: 'seed-note-2',
      title: 'Python 异常处理',
      course: 'Python',
      knowledgePoint: '异常处理',
      tags: ['try-except'],
      content: 'try / except / else / finally 四个分支的执行顺序，以及自定义异常与抛出时机。',
      photos: [],
      mastery: 'familiar',
      linkedTaskIds: ['seed-task-2'],
      sourceTaskId: null,
      createdAt: now - 5 * DAY,
      updatedAt: now - 1 * DAY,
    },
    {
      noteId: 'seed-note-3',
      title: '二部图判定',
      course: '离散数学',
      knowledgePoint: '图论',
      tags: ['二部图', '染色'],
      content: '用 BFS 交替染色，若出现相邻同色则不是二部图；奇数长度回路一定不是二部图。',
      photos: [],
      mastery: 'skilled',
      linkedTaskIds: [],
      sourceTaskId: null,
      createdAt: now - 9 * DAY,
      updatedAt: now - 3 * DAY,
    },
    {
      noteId: 'seed-note-4',
      title: '先序中序还原树',
      course: '数据结构',
      knowledgePoint: '二叉树遍历',
      tags: ['还原', '递归'],
      content: '先序第一个元素是根，在中序里定位根即可切出左右子树区间，递归重建。',
      photos: [{ photoId: 'seed-photo-4-1', fileName: '区间切分手稿.png', sortOrder: 0 }],
      mastery: 'none',
      linkedTaskIds: ['seed-task-1'],
      sourceTaskId: null,
      createdAt: now - 3 * DAY,
      updatedAt: now - 5 * DAY,
    },
  ]
}

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: createSeedNotes(),
  }),

  getters: {
    sortedByUpdatedAt: (state) => [...state.notes].sort((left, right) => right.updatedAt - left.updatedAt),

    totalCount: (state) => state.notes.length,
  },

  actions: {
    addNote(payload = {}) {
      const now = Date.now()
      const note = {
        noteId: createNoteId(),
        title: String(payload.title ?? '').trim(),
        course: payload.course ?? '',
        knowledgePoint: payload.knowledgePoint ?? '',
        tags: Array.isArray(payload.tags) ? [...new Set(payload.tags.filter(Boolean))] : [],
        content: payload.content ?? '',
        photos: Array.isArray(payload.photos) ? payload.photos.map((item) => ({ ...item })) : [],
        mastery: payload.mastery ?? DEFAULT_MASTERY,
        linkedTaskIds: Array.isArray(payload.linkedTaskIds) ? [...payload.linkedTaskIds] : [],
        sourceTaskId: payload.sourceTaskId ?? null,
        createdAt: now,
        updatedAt: now,
      }
      this.notes.push(note)
      return note
    },

    updateNote(noteId, patch = {}) {
      const note = this.notes.find((item) => item.noteId === noteId)
      if (!note) return null

      const next = { ...patch }
      delete next.noteId
      delete next.createdAt
      Object.assign(note, next)
      note.updatedAt = Date.now()
      return note
    },

    removeNote(noteId) {
      const index = this.notes.findIndex((item) => item.noteId === noteId)
      if (index === -1) return false
      this.notes.splice(index, 1)
      return true
    },
  },

  persist: true,
})
