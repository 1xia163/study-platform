<script setup>
import { computed } from 'vue'

import PageHeader from '@/components/PageHeader.vue'
import { priorityLabel } from '@/constants/priority'
import { useTaskStore } from '@/stores/task'
import { formatMonthDay, isOverdue } from '@/utils/date'

const taskStore = useTaskStore()

const tasks = computed(() => taskStore.sortedByDeadline)
const pendingCount = computed(() => taskStore.totalCount - taskStore.completedCount)

const STATUS_META = {
  done: { label: '已完成', className: 'tag--familiar' },
  overdue: { label: '已逾期', className: 'tag--none' },
  pending: { label: '未完成', className: 'tag--outline' },
}

function statusOf(task) {
  if (task.isCompleted) return STATUS_META.done
  if (isOverdue(task.deadline, task.isCompleted)) return STATUS_META.overdue
  return STATUS_META.pending
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
        <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'plan', query: { action: 'new' } }">
          新建任务
        </RouterLink>
      </template>
    </PageHeader>

    <p class="plan-summary card card--soft">
      共 {{ taskStore.totalCount }} 条任务，未完成 {{ pendingCount }} 条，已完成
      {{ taskStore.completedCount }} 条，已逾期 {{ taskStore.overdueTasks.length }} 条。
    </p>

    <ul class="stack">
      <li v-for="task in tasks" :key="task.taskId" class="card task-item">
        <div class="task-item__main">
          <h2 class="task-item__title">{{ task.title }}</h2>
          <p class="task-item__meta small muted">
            {{ task.course }}
            <template v-if="task.knowledgePoint"> · {{ task.knowledgePoint }}</template>
            · 截止
            <time :datetime="task.deadline">{{ formatMonthDay(task.deadline) }}</time>
          </p>
        </div>

        <div class="task-item__tags">
          <span class="tag tag--outline">优先级 {{ priorityLabel(task.priority) }}</span>
          <span class="tag" :class="statusOf(task).className">{{ statusOf(task).label }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.plan-summary {
  margin-bottom: var(--sp-3);
  color: var(--c-green);
  font-size: var(--fs-sub);
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
}

.task-item__main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.task-item__title {
  font-size: var(--fs-body);
  font-weight: 500;
  line-height: 1.4;
}

.task-item__tags {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--sp-1);
}

@media (max-width: 767px) {
  .task-item {
    align-items: flex-start;
    flex-direction: column;
  }

  .task-item__tags {
    justify-content: flex-start;
  }
}
</style>
