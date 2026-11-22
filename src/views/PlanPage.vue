<script setup>
import { computed, ref } from 'vue'

import BaseModal from '@/components/BaseModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()

const tasks = computed(() => taskStore.sortedByDeadline)
const pendingCount = computed(() => taskStore.totalCount - taskStore.completedCount)

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

    <div class="stack">
      <TaskCard
        v-for="task in tasks"
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
</style>
