<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseModal from '@/components/BaseModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import { FOCUS_DEFAULTS, FOCUS_LIMITS, useFocusStore } from '@/stores/focus'
import { useTaskStore } from '@/stores/task'
import { formatClock, formatHourMinute } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const focusStore = useFocusStore()
const taskStore = useTaskStore()

const setup = reactive({
  taskId: '',
  focusMinutes: FOCUS_DEFAULTS.focusMinutes,
  breakMinutes: FOCUS_DEFAULTS.breakMinutes,
  rounds: FOCUS_DEFAULTS.rounds,
})

const errors = reactive({
  focusMinutes: '',
  breakMinutes: '',
  rounds: '',
})

const restoring = ref(false)
const endOpen = ref(false)
const endMessage = ref('')
const startedAtText = ref('')

const openTasks = computed(() => taskStore.tasks.filter((task) => !task.isCompleted))
const timer = computed(() => focusStore.timer)
const running = computed(() => focusStore.isRunning)
const paused = computed(() => focusStore.isPaused)
const done = computed(() => focusStore.isDone)
const idle = computed(() => timer.value.status === 'idle')

const linkedTask = computed(
  () => taskStore.tasks.find((task) => task.taskId === timer.value.taskId) ?? null,
)
const courseText = computed(() => timer.value.course || linkedTask.value?.course || '独立专注')
const clockText = computed(() => formatClock(focusStore.remainingSeconds))
const roundText = computed(() => `第 ${timer.value.currentRound} / ${timer.value.rounds} 轮`)
const progressPercent = computed(() => Math.round(focusStore.phaseProgress * 100))
const todaySessions = computed(() => {
  const today = new Date().toDateString()
  return focusStore.recentSessions.filter(
    (session) => new Date(session.endedAt).toDateString() === today,
  )
})
const todayMinutes = computed(() =>
  todaySessions.value.reduce((sum, session) => sum + session.durationMinutes, 0),
)

function readQueryTask() {
  const taskId = typeof route.query.taskId === 'string' ? route.query.taskId : ''
  if (!taskId) return
  const task = taskStore.tasks.find((item) => item.taskId === taskId)
  if (task) setup.taskId = task.taskId
}

function syncSetupFromTimer() {
  const current = timer.value
  setup.focusMinutes = current.focusMinutes
  setup.breakMinutes = current.breakMinutes
  setup.rounds = current.rounds
  setup.taskId = current.taskId ?? ''
}

// 先同步持久化的设置；待开始时再用 query 里的 taskId 覆盖预选任务
syncSetupFromTimer()
if (idle.value) readQueryTask()

let ticker = null
onMounted(() => {
  if (running.value || paused.value) {
    // 恢复持久化的计时状态，先给一个短暂的恢复态，避免直接闪出运行中的界面
    restoring.value = true
    window.setTimeout(() => {
      restoring.value = false
    }, 300)
  }
  ticker = window.setInterval(() => {
    focusStore.tick()
  }, 500)
})

onBeforeUnmount(() => {
  if (ticker) window.clearInterval(ticker)
})

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function validateNumber(field, value, label) {
  const limit = FOCUS_LIMITS[field]
  const number = Number(value)
  if (!Number.isFinite(number) || !Number.isInteger(number)) {
    errors[field] = `请填写${label}的整数分钟数`
    return false
  }
  if (number < limit.min || number > limit.max) {
    errors[field] = `${label}需在 ${limit.min}–${limit.max} 之间`
    return false
  }
  return true
}

function validateSetup() {
  clearErrors()
  const focusOk = validateNumber('focusMinutes', setup.focusMinutes, '学习时长')
  const breakOk = validateNumber('breakMinutes', setup.breakMinutes, '休息时长')
  const roundOk = validateNumber('rounds', setup.rounds, '轮数')
  return focusOk && breakOk && roundOk
}

function start() {
  if (!validateSetup()) return

  const task = openTasks.value.find((item) => item.taskId === setup.taskId)
  focusStore.setDurations({
    focusMinutes: Number(setup.focusMinutes),
    breakMinutes: Number(setup.breakMinutes),
    rounds: Number(setup.rounds),
  })
  focusStore.startTimer({
    taskId: task ? task.taskId : null,
    course: task ? task.course : '',
  })
  startedAtText.value = formatHourMinute(Date.now())
}

function pause() {
  focusStore.pauseTimer()
}

function resume() {
  focusStore.resumeTimer()
}

function askEnd() {
  endOpen.value = true
}

function confirmEnd() {
  const recorded = focusStore.endEarly()
  endOpen.value = false
  syncSetupFromTimer()
  endMessage.value = recorded
    ? '已结束本次专注，未完成的部分不计入时长。'
    : '已结束本次专注，本次时长不足一分钟，未生成记录。'
}

function again() {
  focusStore.resetTimer()
  syncSetupFromTimer()
  endMessage.value = ''
}

function writeNote() {
  const query = {}
  if (timer.value.taskId) query.taskId = timer.value.taskId
  if (timer.value.course) query.course = timer.value.course
  const task = linkedTask.value
  if (task?.knowledgePoint) query.knowledgePoint = task.knowledgePoint
  if (task?.title) query.title = `${task.title} · 专注笔记`
  router.push({ name: 'note-new', query })
}

function backToTask() {
  if (timer.value.taskId) router.push({ name: 'plan' })
  else router.push({ name: 'home' })
}
</script>

<template>
  <div class="page page--narrow">
    <PageHeader
      eyebrow="P05 · F04"
      title="专注学习"
      desc="支持从任务开始或独立专注；切换页面后保留计时，专注记录用于首页复盘。"
      art="书桌与专注时钟"
      art-src="/illustrations/p05-focus-desk.png"
    />

    <div v-if="restoring" class="card card--soft focus-restoring" aria-live="polite">
      正在恢复上次的计时…
    </div>

    <!-- 待开始：设置区 -->
    <section v-if="idle && !restoring" class="card focus-setup">
      <h2 class="section-title">开始一次专注</h2>

      <div class="field">
        <label class="field__label" for="focus-task">关联任务</label>
        <select id="focus-task" v-model="setup.taskId" class="select">
          <option value="">独立专注（不关联任务）</option>
          <option v-for="task in openTasks" :key="task.taskId" :value="task.taskId">
            {{ task.title }} · {{ task.course }}
          </option>
        </select>
      </div>

      <div class="focus-setup__row">
        <div class="field">
          <label class="field__label" for="focus-minutes">学习时长（分钟）</label>
          <input
            id="focus-minutes"
            v-model="setup.focusMinutes"
            class="input"
            :class="{ 'input--invalid': errors.focusMinutes }"
            type="number"
            :min="FOCUS_LIMITS.focusMinutes.min"
            :max="FOCUS_LIMITS.focusMinutes.max"
            @input="errors.focusMinutes = ''"
          />
          <p v-if="errors.focusMinutes" class="field__error">{{ errors.focusMinutes }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="break-minutes">休息时长（分钟）</label>
          <input
            id="break-minutes"
            v-model="setup.breakMinutes"
            class="input"
            :class="{ 'input--invalid': errors.breakMinutes }"
            type="number"
            :min="FOCUS_LIMITS.breakMinutes.min"
            :max="FOCUS_LIMITS.breakMinutes.max"
            @input="errors.breakMinutes = ''"
          />
          <p v-if="errors.breakMinutes" class="field__error">{{ errors.breakMinutes }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="focus-rounds">轮数</label>
          <input
            id="focus-rounds"
            v-model="setup.rounds"
            class="input"
            :class="{ 'input--invalid': errors.rounds }"
            type="number"
            :min="FOCUS_LIMITS.rounds.min"
            :max="FOCUS_LIMITS.rounds.max"
            @input="errors.rounds = ''"
          />
          <p v-if="errors.rounds" class="field__error">{{ errors.rounds }}</p>
        </div>
      </div>

      <button class="btn btn--primary btn--block" type="button" @click="start">
        开始专注
      </button>

      <p v-if="endMessage" class="small muted focus-note">{{ endMessage }}</p>
    </section>

    <!-- 计时中 / 暂停 -->
    <section v-if="(running || paused) && !restoring" class="card focus-clock">
      <p class="focus-clock__phase">
        {{ focusStore.phaseLabel }}
        <span class="focus-clock__round">{{ roundText }}</span>
      </p>
      <p class="focus-clock__time">{{ clockText }}</p>
      <p class="small muted">
        {{ courseText }}
        <template v-if="linkedTask"> · 任务「{{ linkedTask.title }}」</template>
        <template v-if="startedAtText"> · 开始于 {{ startedAtText }}</template>
      </p>

      <div
        class="focus-clock__progress"
        role="progressbar"
        :aria-valuenow="progressPercent"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span :style="{ width: progressPercent + '%' }" />
      </div>

      <div class="focus-clock__actions">
        <button v-if="running" class="btn btn--sm btn--ghost" type="button" @click="pause">
          暂停
        </button>
        <button v-else class="btn btn--sm btn--green" type="button" @click="resume">继续</button>
        <button class="btn btn--sm btn--danger" type="button" @click="askEnd">提前结束</button>
      </div>

      <p v-if="paused" class="small muted focus-note">已暂停，剩余时间会保留。</p>
    </section>

    <!-- 全部轮次结束 -->
    <section v-if="done && !restoring" class="card focus-done">
      <h2 class="section-title">本轮专注完成</h2>
      <p class="small muted">
        共完成 {{ timer.rounds }} 轮学习；今天累计记录 {{ todayMinutes }} 分钟。
      </p>

      <div class="focus-done__actions">
        <button class="btn btn--sm btn--primary" type="button" @click="again">再来一轮</button>
        <button class="btn btn--sm btn--ghost" type="button" @click="writeNote">记录笔记</button>
        <button class="btn btn--sm btn--ghost" type="button" @click="backToTask">
          {{ timer.taskId ? '返回任务' : '返回首页' }}
        </button>
      </div>
    </section>

    <section class="card focus-history">
      <h2 class="section-title">今天的专注记录</h2>
      <p v-if="!todaySessions.length" class="small muted">今天还没有完成的学习时段。</p>
      <ul v-else class="focus-history__list">
        <li v-for="session in todaySessions" :key="session.sessionId" class="focus-history__item">
          <span>{{ formatHourMinute(session.endedAt) }}</span>
          <span class="muted">{{ session.course || '独立专注' }}</span>
          <span>{{ session.durationMinutes }} 分钟</span>
        </li>
      </ul>
      <p class="small muted focus-note">本周累计 {{ focusStore.weeklyFocusMinutes }} 分钟。</p>
    </section>

    <BaseModal
      v-model="endOpen"
      title="提前结束本次专注？"
      desc="未完成的部分不会计入已完成时长。"
      size="sm"
    >
      <p class="small muted">已学习的时间会按整分钟记录，休息时间不计入。</p>

      <template #footer>
        <button class="btn btn--sm btn--ghost" type="button" @click="endOpen = false">
          继续专注
        </button>
        <button class="btn btn--sm btn--danger" type="button" @click="confirmEnd">
          确定结束
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.focus-restoring {
  margin-bottom: var(--sp-2);
  color: var(--c-green);
  font-size: var(--fs-sub);
}

.focus-setup,
.focus-clock,
.focus-done,
.focus-history {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.focus-setup__row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-2);
}

.focus-clock {
  align-items: center;
  text-align: center;
}

.focus-clock__phase {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  color: var(--c-green);
  font-size: var(--fs-section);
}

.focus-clock__round {
  padding: 2px 10px;
  border-radius: var(--r-tag);
  background: var(--c-green-soft);
  font-size: var(--fs-sub);
}

.focus-clock__time {
  font-size: var(--fs-hero);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.focus-clock__progress {
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: var(--r-tag);
  background: var(--c-green-soft);
}

.focus-clock__progress span {
  display: block;
  height: 100%;
  background: var(--c-green);
  transition: width 0.3s linear;
}

.focus-clock__actions,
.focus-done__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--sp-2);
}

.focus-note {
  margin: 0;
}

.focus-history__list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.focus-history__item {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-2);
  padding-bottom: var(--sp-1);
  border-bottom: 1px solid var(--c-border);
  font-size: var(--fs-sub);
}

.focus-history__item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

@media (max-width: 767px) {
  .focus-setup__row {
    grid-template-columns: 1fr;
  }

  .focus-clock__time {
    font-size: clamp(48px, 18vw, 96px);
  }
}
</style>
