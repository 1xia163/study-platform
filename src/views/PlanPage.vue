<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseModal from '@/components/BaseModal.vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchFilterBar from '@/components/SearchFilterBar.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import { isValidCourse, isValidKnowledgePoint } from '@/constants/courses'
import { useTaskStore } from '@/stores/task'
import { compareDateString, formatMonthDay, isBeforeToday, isOverdue, isValidDateString, todayString } from '@/utils/date'

const taskStore = useTaskStore()
const route = useRoute()
const router = useRouter()

const pendingCount = computed(() => taskStore.totalCount - taskStore.completedCount)

const keyword = ref('')
const statusFilter = ref('all')
const sortOrder = ref('asc')
const isLoading = ref(true)

const STATUS_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: 'pending', label: '未完成' },
  { value: 'completed', label: '已完成' },
  { value: 'overdue', label: '逾期' },
]

const minimumDate = todayString()

const filteredTasks = computed(() => {
  const word = keyword.value.trim().toLowerCase()
  return taskStore.tasks.filter((task) => {
    if (word && !task.title.toLowerCase().includes(word)) return false
    if (statusFilter.value === 'pending') return !task.isCompleted
    if (statusFilter.value === 'completed') return task.isCompleted
    if (statusFilter.value === 'overdue') return isOverdue(task.deadline, task.isCompleted)
    return true
  })
})

const visibleTasks = computed(() =>
  [...filteredTasks.value].sort((left, right) =>
    compareDateString(left.deadline, right.deadline, sortOrder.value),
  ),
)

const hasTasks = computed(() => taskStore.totalCount > 0)

let loadingTimer = null
onMounted(() => {
  // 任务来自本地 store，没有真实请求；保留一段很短的加载态，避免首屏白屏
  loadingTimer = window.setTimeout(() => {
    isLoading.value = false
  }, 300)
})
onBeforeUnmount(() => {
  if (loadingTimer) window.clearTimeout(loadingTimer)
})

function resetFilters() {
  keyword.value = ''
  statusFilter.value = 'all'
  sortOrder.value = 'asc'
}

const formOpen = ref(false)
const editingTask = ref(null)
const sourcePreset = ref(null)

const sourcePresetLabel = computed(() => {
  const preset = sourcePreset.value
  if (!preset) return ''
  const parts = []
  if (preset.title) parts.push(preset.title)
  if (preset.course) parts.push(preset.course)
  if (preset.knowledgePoint) parts.push(preset.knowledgePoint)
  if (preset.deadline) parts.push(`截止 ${formatMonthDay(preset.deadline)}`)
  return parts.join(' · ')
})

const QUERY_KEYS = ['action', 'title', 'course', 'knowledgePoint', 'deadline']
let appliedQueryKey = ''

function queryKeyOf(query) {
  return QUERY_KEYS.map((key) => `${key}=${query[key] ?? ''}`).join('&')
}

function readQuery() {
  const query = route.query
  const key = queryKeyOf(query)
  if (key === appliedQueryKey) return
  appliedQueryKey = key

  // 用户已经在填表单时，新的 query 不覆盖已填内容
  if (formOpen.value) return

  const preset = {}
  const title = typeof query.title === 'string' ? query.title.trim() : ''
  if (title) preset.title = title

  const course = typeof query.course === 'string' ? query.course : ''
  if (course && isValidCourse(course)) preset.course = course

  const point = typeof query.knowledgePoint === 'string' ? query.knowledgePoint : ''
  if (preset.course && point && isValidKnowledgePoint(preset.course, point)) {
    preset.knowledgePoint = point
  }

  const deadline = typeof query.deadline === 'string' ? query.deadline : ''
  if (deadline && isValidDateString(deadline)) preset.deadline = deadline

  sourcePreset.value = Object.keys(preset).length > 0 ? preset : null

  if (query.action === 'new') {
    editingTask.value = null
    formOpen.value = true
  }
}

watch(() => route.query, readQuery, { immediate: true })

function clearSourceQuery() {
  sourcePreset.value = null
  if (Object.keys(route.query).length > 0) {
    router.replace({ name: 'plan' })
  }
}

const deletingTask = ref(null)
const deleteOpen = computed({
  get: () => deletingTask.value !== null,
  set: (open) => {
    if (!open) deletingTask.value = null
  },
})
const deleteTitle = computed(() =>
  deletingTask.value ? `删除任务「${deletingTask.value.title}」？` : '删除任务',
)

function handleToggle(task) {
  taskStore.toggleComplete(task.taskId)
}

function openCreate() {
  editingTask.value = null
  formOpen.value = true
}

function openEdit(task) {
  editingTask.value = task
  formOpen.value = true
}

function handleSubmit(payload) {
  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.taskId, payload)
  } else {
    taskStore.addTask(payload)
  }
  formOpen.value = false
  editingTask.value = null

  // 预填已消费，清掉地址栏来源参数，刷新后不再自动弹表单
  if (Object.keys(route.query).length > 0) {
    sourcePreset.value = null
    router.replace({ name: 'plan' })
  }
}

function handleDelete(task) {
  deletingTask.value = task
}

function confirmDelete() {
  if (!deletingTask.value) return
  taskStore.removeTask(deletingTask.value.taskId)
  deletingTask.value = null
}

const postponingTask = ref(null)
const postponeDate = ref('')
const postponeError = ref('')
const postponeOpen = computed({
  get: () => postponingTask.value !== null,
  set: (open) => {
    if (!open) {
      postponingTask.value = null
      postponeError.value = ''
    }
  },
})
const postponeTitle = computed(() =>
  postponingTask.value ? `延期任务「${postponingTask.value.title}」` : '延期任务',
)

function openPostpone(task) {
  postponingTask.value = task
  postponeDate.value = task.deadline
  postponeError.value = ''
}

function confirmPostpone() {
  if (!postponingTask.value) return

  if (!postponeDate.value) {
    postponeError.value = '请选择新的截止日期'
    return
  }
  if (!isValidDateString(postponeDate.value)) {
    postponeError.value = '请选择有效日期'
    return
  }
  if (isBeforeToday(postponeDate.value)) {
    postponeError.value = '延期日期不能早于今天'
    return
  }

  taskStore.postponeTask(postponingTask.value.taskId, postponeDate.value)
  postponingTask.value = null
  postponeError.value = ''
}

function goLinkNote(task) {
  const query = { pick: '1', sourceTaskId: task.taskId }
  if (task.course) query.course = task.course
  if (task.knowledgePoint) query.knowledgePoint = task.knowledgePoint
  router.push({ name: 'note-list', query })
}
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="P02 · F02"
      title="学习计划与待办"
      desc="同一份任务通过搜索、状态筛选和日期排序展示，新建与编辑使用同一表单。"
      art="任务日历与清单"
      art-src="/illustrations/p02-plan-calendar.png"
    >
      <template #actions>
        <button class="btn btn--primary btn--sm" type="button" @click="openCreate">
          新建任务
        </button>
      </template>
    </PageHeader>

    <div v-if="sourcePreset" class="card card--soft plan-source">
      <p class="small">来源条件：{{ sourcePresetLabel }}</p>
      <button class="btn btn--ghost btn--sm" type="button" @click="clearSourceQuery">
        清除来源条件
      </button>
    </div>

    <p class="plan-summary card card--soft">
      共 {{ taskStore.totalCount }} 条任务，未完成 {{ pendingCount }} 条，已完成
      {{ taskStore.completedCount }} 条，已逾期 {{ taskStore.overdueTasks.length }} 条。
    </p>

    <SearchFilterBar
      v-model:keyword="keyword"
      placeholder="搜索任务标题"
      @reset="resetFilters"
    >
      <select
        v-model="statusFilter"
        class="select filter-control"
        aria-label="按状态筛选任务"
      >
        <option v-for="item in STATUS_OPTIONS" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>

      <select
        v-model="sortOrder"
        class="select filter-control filter-control--sort"
        aria-label="按截止日期排序"
      >
        <option value="asc">截止日期 ↑</option>
        <option value="desc">截止日期 ↓</option>
      </select>
    </SearchFilterBar>

    <div v-if="isLoading" class="stack" aria-busy="true" aria-label="任务加载中">
      <div v-for="n in 3" :key="n" class="card skeleton-card">
        <span class="skeleton-line skeleton-line--title" />
        <span class="skeleton-line skeleton-line--meta" />
        <span class="skeleton-line skeleton-line--tags" />
      </div>
    </div>

    <EmptyState
      v-else-if="!hasTasks"
      variant="empty"
      title="还没有任务"
      desc="先建一个任务，从今天的复习或作业开始。"
    >
      <button class="btn btn--primary btn--sm" type="button" @click="openCreate">
        新建任务
      </button>
    </EmptyState>

    <EmptyState
      v-else-if="visibleTasks.length === 0"
      variant="no-result"
      title="没有符合条件的任务"
      desc="换个关键词，或清除状态筛选再看看。"
    >
      <button class="btn btn--ghost btn--sm" type="button" @click="resetFilters">
        清除筛选
      </button>
    </EmptyState>

    <div v-else class="stack">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.taskId"
        :task="task"
        @toggle="handleToggle"
        @edit="openEdit"
        @delete="handleDelete"
        @postpone="openPostpone"
        @link-note="goLinkNote"
      />
    </div>

    <TaskForm v-model="formOpen" :task="editingTask" :preset="sourcePreset" @submit="handleSubmit" />

    <BaseModal v-model="deleteOpen" :title="deleteTitle" desc="删除后无法恢复。" size="sm">
      <template #footer>
        <button class="btn btn--sm btn--ghost" type="button" @click="deleteOpen = false">
          取消
        </button>
        <button class="btn btn--sm btn--danger" type="button" @click="confirmDelete">删除</button>
      </template>
    </BaseModal>

    <BaseModal
      v-model="postponeOpen"
      :title="postponeTitle"
      desc="选一个新的截止日期，任务内容和其他设置不变。"
      size="sm"
    >
      <div class="field">
        <label class="field__label" for="postpone-date">新的截止日期<span class="req">*</span></label>
        <input
          id="postpone-date"
          v-model="postponeDate"
          class="input"
          :class="{ 'input--invalid': postponeError }"
          type="date"
          :min="minimumDate"
          @input="postponeError = ''"
        />
        <p v-if="postponeError" class="field__error">{{ postponeError }}</p>
      </div>

      <template #footer>
        <button class="btn btn--sm btn--ghost" type="button" @click="postponeOpen = false">
          取消
        </button>
        <button class="btn btn--sm btn--green" type="button" @click="confirmPostpone">
          保存延期
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.plan-summary {
  margin-bottom: var(--sp-3);
  color: var(--c-green);
  font-size: var(--fs-sub);
}

.plan-source {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
  color: var(--c-green);
}

.filter-control {
  width: auto;
  min-width: 118px;
}

.filter-control--sort {
  min-width: 132px;
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
  animation: plan-skeleton 1.2s ease-in-out infinite;
}

.skeleton-line--title {
  width: 38%;
  height: 18px;
}

.skeleton-line--meta {
  width: 62%;
}

.skeleton-line--tags {
  width: 30%;
}

@keyframes plan-skeleton {
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
