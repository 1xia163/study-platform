import { defineStore } from 'pinia'

import { isThisWeek } from '@/utils/date'

export const FOCUS_LIMITS = {
  focusMinutes: { min: 1, max: 180 },
  breakMinutes: { min: 1, max: 60 },
  rounds: { min: 1, max: 12 },
}

export const FOCUS_DEFAULTS = {
  focusMinutes: 25,
  breakMinutes: 5,
  rounds: 4,
}

function createSessionId() {
  return `focus-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function createIdleTimer() {
  return {
    status: 'idle',
    taskId: null,
    course: '',
    focusMinutes: FOCUS_DEFAULTS.focusMinutes,
    breakMinutes: FOCUS_DEFAULTS.breakMinutes,
    rounds: FOCUS_DEFAULTS.rounds,
    currentRound: 1,
    phaseDurationMs: 0,
    phaseStartedAt: null,
    phaseEndsAt: null,
    remainingMs: null,
    pausedPhase: '',
    startedAt: null,
  }
}

function startPhase(timer, phase) {
  const minutes = phase === 'focus' ? timer.focusMinutes : timer.breakMinutes
  const now = Date.now()
  timer.status = phase
  timer.phaseDurationMs = minutes * 60 * 1000
  timer.phaseStartedAt = now
  timer.phaseEndsAt = now + timer.phaseDurationMs
  timer.remainingMs = null
  timer.pausedPhase = ''
}

export const useFocusStore = defineStore('focus', {
  state: () => ({
    timer: createIdleTimer(),
    sessions: [],
    // 当前时间戳，由页面每秒推进；只用来驱动剩余时间计算，不参与持久化
    nowMs: Date.now(),
  }),

  getters: {
    /** 是否正在计时（学习或休息阶段） */
    isRunning: (state) => state.timer.status === 'focus' || state.timer.status === 'break',
    isPaused: (state) => state.timer.status === 'paused',
    isDone: (state) => state.timer.status === 'done',

    /** 当前阶段的标签：学习 / 休息 */
    phaseLabel: (state) => {
      const status = state.timer.status === 'paused' ? state.timer.pausedPhase : state.timer.status
      if (status === 'focus') return '学习'
      if (status === 'break') return '休息'
      return ''
    },

    /** 剩余秒数：运行中按「结束时间戳 - 当前时间」推算，暂停时取保存的剩余量 */
    remainingSeconds: (state) => {
      const timer = state.timer
      if (timer.status === 'focus' || timer.status === 'break') {
        return Math.max(0, Math.ceil((timer.phaseEndsAt - state.nowMs) / 1000))
      }
      if (timer.status === 'paused') {
        return Math.max(0, Math.ceil((timer.remainingMs ?? 0) / 1000))
      }
      if (timer.status === 'done') return 0
      return timer.focusMinutes * 60
    },

    /** 当前阶段已进行的比例，0–1 */
    phaseProgress: (state) => {
      const timer = state.timer
      if (!timer.phaseDurationMs) return 0
      const remaining = state.timer.status === 'focus' || state.timer.status === 'break'
        ? Math.max(0, timer.phaseEndsAt - state.nowMs)
        : Math.max(0, timer.remainingMs ?? timer.phaseDurationMs)
      return Math.min(1, Math.max(0, 1 - remaining / timer.phaseDurationMs))
    },

    /** 本周一至今的专注分钟数 */
    weeklyFocusMinutes: (state) =>
      state.sessions
        .filter((session) => isThisWeek(session.endedAt))
        .reduce((sum, session) => sum + (Number(session.durationMinutes) || 0), 0),

    /** 最近完成的专注记录，倒序 */
    recentSessions: (state) => [...state.sessions].sort((left, right) => right.endedAt - left.endedAt),
  },

  actions: {
    /** 推进时钟并处理到期的阶段；返回值表示本次是否发生了阶段切换 */
    tick() {
      this.nowMs = Date.now()
      const timer = this.timer
      if (timer.status !== 'focus' && timer.status !== 'break') return false
      if (this.nowMs < timer.phaseEndsAt) return false
      this.completePhase()
      return true
    },

    completePhase() {
      const timer = this.timer

      if (timer.status === 'focus') {
        this.recordSession({
          taskId: timer.taskId,
          course: timer.course,
          durationMinutes: timer.focusMinutes,
          startedAt: timer.phaseStartedAt,
          endedAt: timer.phaseEndsAt,
        })

        if (timer.currentRound >= timer.rounds) {
          this.finishTimer()
          return
        }

        startPhase(timer, 'break')
        return
      }

      if (timer.status === 'break') {
        timer.currentRound += 1
        startPhase(timer, 'focus')
      }
    },

    startTimer({ taskId = null, course = '' } = {}) {
      const timer = this.timer
      timer.taskId = taskId || null
      timer.course = course || ''
      timer.currentRound = 1
      timer.startedAt = Date.now()
      startPhase(timer, 'focus')
    },

    pauseTimer() {
      const timer = this.timer
      if (timer.status !== 'focus' && timer.status !== 'break') return
      timer.remainingMs = Math.max(0, timer.phaseEndsAt - Date.now())
      timer.pausedPhase = timer.status
      timer.status = 'paused'
      timer.phaseEndsAt = null
    },

    resumeTimer() {
      const timer = this.timer
      if (timer.status !== 'paused') return
      const remaining = Math.max(0, timer.remainingMs ?? 0)
      const now = Date.now()
      timer.status = timer.pausedPhase === 'break' ? 'break' : 'focus'
      timer.phaseEndsAt = now + remaining
      // 让 session 的 startedAt 仍然反映真实开始时刻
      timer.phaseStartedAt = now - Math.max(0, timer.phaseDurationMs - remaining)
      timer.remainingMs = null
      timer.pausedPhase = ''
    },

    /**
     * 提前结束：未完成的部分不计入完成时长，只记录已经学到的整分钟数
     * @returns {boolean} 是否写入了记录
     */
    endEarly() {
      const timer = this.timer
      const phase = timer.status === 'paused' ? timer.pausedPhase : timer.status
      if (phase !== 'focus' && phase !== 'break') {
        this.finishTimer()
        return false
      }

      const remaining = timer.status === 'paused'
        ? Math.max(0, timer.remainingMs ?? 0)
        : Math.max(0, timer.phaseEndsAt - Date.now())
      const elapsedMs = Math.max(0, timer.phaseDurationMs - remaining)
      const elapsedMinutes = Math.floor(elapsedMs / 60000)

      let recorded = false
      if (phase === 'focus' && elapsedMinutes > 0) {
        this.recordSession({
          taskId: timer.taskId,
          course: timer.course,
          durationMinutes: elapsedMinutes,
          startedAt: timer.phaseStartedAt,
          endedAt: Date.now(),
        })
        recorded = true
      }

      // 提前结束回到待开始，而不是显示「本轮完成」，避免误导
      this.resetTimer()
      return recorded
    },

    finishTimer() {
      const timer = this.timer
      timer.status = 'done'
      timer.phaseDurationMs = 0
      timer.phaseStartedAt = null
      timer.phaseEndsAt = null
      timer.remainingMs = null
      timer.pausedPhase = ''
    },

    /** 回到待开始状态，保留时长与轮数设置 */
    resetTimer() {
      const timer = this.timer
      const keep = {
        focusMinutes: timer.focusMinutes,
        breakMinutes: timer.breakMinutes,
        rounds: timer.rounds,
        taskId: timer.taskId,
        course: timer.course,
      }
      this.timer = { ...createIdleTimer(), ...keep }
      this.nowMs = Date.now()
    },

    setDurations({ focusMinutes, breakMinutes, rounds } = {}) {
      const timer = this.timer
      if (Number.isFinite(focusMinutes)) timer.focusMinutes = focusMinutes
      if (Number.isFinite(breakMinutes)) timer.breakMinutes = breakMinutes
      if (Number.isFinite(rounds)) timer.rounds = rounds
    },

    recordSession({ taskId, course, durationMinutes, startedAt, endedAt }) {
      const minutes = Number(durationMinutes) || 0
      if (minutes <= 0) return null
      const session = {
        sessionId: createSessionId(),
        taskId: taskId || null,
        course: course || '',
        durationMinutes: minutes,
        startedAt: startedAt ?? Date.now(),
        endedAt: endedAt ?? Date.now(),
      }
      this.sessions.push(session)
      return session
    },
  },

  persist: {
    // key 由 stores/index.js 统一加 zhike: 前缀，这里只挑需要持久化的字段
    pick: ['timer', 'sessions'],
  },
})
