<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import BaseModal from '@/components/BaseModal.vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchFilterBar from '@/components/SearchFilterBar.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import { useTaskStore } from '@/stores/task'
import { compareDateString, isOverdue } from '@/utils/date'

const taskStore = useTaskStore()

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
}

function handleDelete(task) {
  deletingTask.value = task
}

function confirmDelete() {
  if (!deletingTask.value) return
  taskStore.removeTask(deletingTask.value.taskId)
  deletingTask.value = null
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
      />
    </div>

    <TaskForm v-model="formOpen" :task="editingTask" @submit="handleSubmit" />

    <BaseModal v-model="deleteOpen" :title="deleteTitle" desc="删除后无法恢复。" size="sm">
      <template #footer>
        <button class="btn btn--sm btn--ghost" type="button" @click="deleteOpen = false">
          取消
        </button>
        <button class="btn btn--sm btn--danger" type="button" @click="confirmDelete">删除</button>
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
