<script setup>
import { computed, onMounted, ref } from 'vue'

import EmptyState from '@/components/EmptyState.vue'
import MasteryTag from '@/components/MasteryTag.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useFocusStore } from '@/stores/focus'
import { useNoteStore } from '@/stores/note'
import { useTaskStore } from '@/stores/task'
import { formatHourMinute, formatMonthDay, isOverdue, todayString, weekdayLabel } from '@/utils/date'

const taskStore = useTaskStore()
const noteStore = useNoteStore()
const focusStore = useFocusStore()

const loadState = ref('loading')

const today = todayString()

const overdueTasks = computed(() => taskStore.overdueTasks)
const todayTasks = computed(() =>
  taskStore.tasks
    .filter((task) => !task.isCompleted && !isOverdue(task.deadline, task.isCompleted))
    .sort((left, right) => (left.deadline < right.deadline ? -1 : 1)),
)
const hasPendingTasks = computed(() => todayTasks.value.length > 0 || overdueTasks.value.length > 0)

const totalCount = computed(() => taskStore.totalCount)
const completedCount = computed(() => taskStore.completedCount)
const progressPercent = computed(() =>
  totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100),
)

const weeklyFocusMinutes = computed(() => focusStore.weeklyFocusMinutes)
const recentSessions = computed(() => focusStore.recentSessions.slice(0, 3))

const recentNotes = computed(() =>
  [...noteStore.notes].sort((left, right) => right.updatedAt - left.updatedAt).slice(0, 3),
)
const reviewNotes = computed(() =>
  noteStore.notes.filter((note) => note.mastery === 'none').slice(0, 3),
)

const todayLabel = computed(() => `${formatMonthDay(today)} · ${weekdayLabel()}`)

let loadTimer = null
function load() {
  loadState.value = 'loading'
  if (loadTimer) window.clearTimeout(loadTimer)
  loadTimer = window.setTimeout(() => {
    try {
      // 触发一次各 store 的读取，尽早暴露数据结构问题
      void taskStore.tasks.length
      void noteStore.notes.length
      void focusStore.sessions.length
      loadState.value = 'ready'
    } catch {
      loadState.value = 'error'
    }
  }, 300)
}

onMounted(load)

function reviewTaskLink(note) {
  const query = { action: 'new', title: `复习：${note.title}` }
  if (note.course) query.course = note.course
  if (note.knowledgePoint) query.knowledgePoint = note.knowledgePoint
  return { name: 'plan', query }
}
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="P01 · F01 / F05"
      title="学习首页"
      desc="承接今日行动与学习复盘，主要入口始终是计划、笔记和专注。"
      art="学习校园"
      art-src="/illustrations/p01-home-campus.png"
    >
      <template #actions>
        <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'plan', query: { action: 'new' } }">
          新建任务
        </RouterLink>
      </template>
    </PageHeader>

    <p class="home-today small muted">今天是 {{ todayLabel }}</p>

    <div v-if="loadState === 'loading'" class="stack" aria-busy="true" aria-label="首页数据加载中">
      <div v-for="n in 3" :key="n" class="card skeleton-card">
        <span class="skeleton-line skeleton-line--title" />
        <span class="skeleton-line skeleton-line--meta" />
      </div>
    </div>

    <EmptyState
      v-else-if="loadState === 'error'"
      variant="error"
      title="首页数据读取失败"
      desc="本地数据暂时读不出来，可以重试一次。"
    >
      <button class="btn btn--sm btn--primary" type="button" @click="load">重新加载</button>
    </EmptyState>

    <template v-else>
      <section class="grid-cards home-stats">
        <div class="card card--soft home-stat">
          <p class="home-stat__label small">任务完成进度</p>
          <p class="home-stat__value">{{ completedCount }} / {{ totalCount }}</p>
          <div
            class="home-progress"
            role="progressbar"
            :aria-valuenow="progressPercent"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span :style="{ width: progressPercent + '%' }" />
          </div>
          <p class="small muted">已完成 {{ progressPercent }}%</p>
        </div>

        <div class="card card--soft home-stat">
          <p class="home-stat__label small">本周专注时长</p>
          <p class="home-stat__value">{{ weeklyFocusMinutes }}<span class="home-stat__unit">分钟</span></p>
          <p class="small muted">本周一至今，按已完成的学习时段累计。</p>
        </div>
      </section>

      <section class="card home-section">
        <div class="home-section__head">
          <h2 class="section-title">今日待办</h2>
          <RouterLink class="btn btn--sm btn--ghost" :to="{ name: 'plan' }">去计划页</RouterLink>
        </div>

        <EmptyState
          v-if="!hasPendingTasks"
          variant="empty"
          compact
          title="今天没有待办任务"
          desc="可以新建一个任务，或者去专注学习一会儿。"
        >
          <RouterLink
            class="btn btn--sm btn--primary"
            :to="{ name: 'plan', query: { action: 'new' } }"
          >
            新建任务
          </RouterLink>
        </EmptyState>

        <template v-else>
          <div v-if="overdueTasks.length" class="home-sub">
            <p class="home-sub__title small">已逾期 {{ overdueTasks.length }} 条</p>
            <ul class="home-list">
              <li v-for="task in overdueTasks" :key="task.taskId" class="home-list__item">
                <span class="home-list__title">{{ task.title }}</span>
                <span class="small muted">{{ task.course }} · 截止 {{ formatMonthDay(task.deadline) }}</span>
              </li>
            </ul>
          </div>

          <div v-if="todayTasks.length" class="home-sub">
            <p class="home-sub__title small">待完成 {{ todayTasks.length }} 条</p>
            <ul class="home-list">
              <li v-for="task in todayTasks" :key="task.taskId" class="home-list__item">
                <span class="home-list__title">{{ task.title }}</span>
                <span class="small muted">{{ task.course }} · 截止 {{ formatMonthDay(task.deadline) }}</span>
              </li>
            </ul>
          </div>
        </template>
      </section>

      <section class="card home-section">
        <div class="home-section__head">
          <h2 class="section-title">最近笔记</h2>
          <RouterLink class="btn btn--sm btn--ghost" :to="{ name: 'note-list' }">查看全部</RouterLink>
        </div>

        <EmptyState
          v-if="!recentNotes.length"
          variant="empty"
          compact
          title="还没有笔记"
          desc="学到的知识点可以随手记下来。"
        >
          <RouterLink class="btn btn--sm btn--primary" :to="{ name: 'note-new' }">新建笔记</RouterLink>
        </EmptyState>

        <ul v-else class="home-list">
          <li v-for="note in recentNotes" :key="note.noteId" class="home-list__item">
            <RouterLink class="home-list__title" :to="{ name: 'note-edit', params: { id: note.noteId } }">
              {{ note.title }}
            </RouterLink>
            <MasteryTag :value="note.mastery" />
          </li>
        </ul>
      </section>

      <section class="card home-section">
        <div class="home-section__head">
          <h2 class="section-title">待复盘知识点</h2>
          <span class="small muted">掌握程度为「未掌握」的笔记</span>
        </div>

        <p v-if="!reviewNotes.length" class="small muted">暂时没有需要复盘的知识点。</p>

        <ul v-else class="home-list">
          <li v-for="note in reviewNotes" :key="note.noteId" class="home-list__item">
            <span class="home-list__title">
              {{ note.title }}
              <span class="small muted">
                · {{ note.course }}<template v-if="note.knowledgePoint"> · {{ note.knowledgePoint }}</template>
              </span>
            </span>
            <RouterLink class="btn btn--sm btn--ghost" :to="reviewTaskLink(note)">加入复习任务</RouterLink>
          </li>
        </ul>
      </section>

      <section class="card home-section">
        <div class="home-section__head">
          <h2 class="section-title">最近专注</h2>
          <RouterLink class="btn btn--sm btn--ghost" :to="{ name: 'focus' }">去专注</RouterLink>
        </div>

        <p v-if="!recentSessions.length" class="small muted">还没有专注记录。</p>

        <ul v-else class="home-list">
          <li v-for="session in recentSessions" :key="session.sessionId" class="home-list__item">
            <span class="home-list__title">{{ session.course || '独立专注' }}</span>
            <span class="small muted">
              {{ session.durationMinutes }} 分钟 · {{ formatHourMinute(session.endedAt) }}
            </span>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.home-today {
  margin-bottom: var(--sp-2);
}

.home-stats {
  margin-bottom: var(--sp-3);
}

.home-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.home-stat__label {
  color: var(--c-green);
}

.home-stat__value {
  font-size: var(--fs-title);
  font-weight: 500;
  line-height: 1.1;
}

.home-stat__unit {
  margin-left: 4px;
  font-size: var(--fs-sub);
  font-weight: 400;
}

.home-progress {
  height: 8px;
  overflow: hidden;
  border-radius: var(--r-tag);
  background: rgba(255, 255, 255, 0.7);
}

.home-progress span {
  display: block;
  height: 100%;
  background: var(--c-green);
  transition: width 0.3s ease;
}

.home-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.home-section__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-1);
}

.home-sub__title {
  margin-bottom: 6px;
  color: var(--c-text-muted);
}

.home-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}

.home-list__item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-1);
  padding-bottom: var(--sp-1);
  border-bottom: 1px solid var(--c-border);
}

.home-list__item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.home-list__title {
  font-size: var(--fs-body);
  font-weight: 500;
}

.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  display: block;
  height: 14px;
  border-radius: var(--r-tag);
  background: linear-gradient(90deg, var(--c-border) 25%, var(--c-green-soft) 50%, var(--c-border) 75%);
  background-size: 200% 100%;
  animation: home-skeleton 1.2s ease-in-out infinite;
}

.skeleton-line--title {
  width: 38%;
  height: 18px;
}

.skeleton-line--meta {
  width: 62%;
}

@keyframes home-skeleton {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-line {
    animation: none;
  }
}
</style>
