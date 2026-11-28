<script setup>
import { computed, ref } from 'vue'

import { priorityLabel } from '@/constants/priority'
import { formatMonthDay, isOverdue } from '@/utils/date'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['toggle', 'edit', 'delete', 'postpone', 'link-note', 'focus'])

const moreOpen = ref(false)

const status = computed(() => {
  if (props.task.isCompleted) return { label: '已完成', className: 'tag--familiar' }
  if (isOverdue(props.task.deadline, props.task.isCompleted)) {
    return { label: '已逾期', className: 'tag--none' }
  }
  return { label: '未完成', className: 'tag--outline' }
})

const actionsId = computed(() => `task-actions-${props.task.taskId}`)

function fire(name) {
  moreOpen.value = false
  emit(name, props.task)
}
</script>

<template>
  <article class="card task-card">
    <div class="task-card__head">
      <div class="task-card__info">
        <h2 class="task-card__title">{{ task.title }}</h2>
        <p class="task-card__meta small muted">
          {{ task.course }}
          <template v-if="task.knowledgePoint"> · {{ task.knowledgePoint }}</template>
          · 截止
          <time :datetime="task.deadline">{{ formatMonthDay(task.deadline) }}</time>
        </p>
      </div>

      <div class="task-card__tags">
        <span class="tag tag--outline">优先级 {{ priorityLabel(task.priority) }}</span>
        <span class="tag" :class="status.className">{{ status.label }}</span>
      </div>
    </div>

    <div class="task-card__actions">
      <button class="btn btn--sm btn--ghost" type="button" @click="emit('toggle', task)">
        {{ task.isCompleted ? '恢复未完成' : '完成' }}
      </button>

      <button
        class="btn btn--sm btn--ghost task-card__more"
        type="button"
        :aria-expanded="moreOpen"
        :aria-controls="actionsId"
        @click="moreOpen = !moreOpen"
      >
        {{ moreOpen ? '收起' : '更多' }}
      </button>

      <div :id="actionsId" class="task-card__secondary" :class="{ 'is-open': moreOpen }">
        <button class="btn btn--sm btn--ghost" type="button" @click="fire('edit')">编辑</button>
        <button class="btn btn--sm btn--ghost" type="button" @click="fire('postpone')">延期</button>
        <button class="btn btn--sm btn--ghost" type="button" @click="fire('link-note')">
          关联笔记
        </button>
        <button class="btn btn--sm btn--danger" type="button" @click="fire('delete')">
          删除
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.task-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-2);
}

.task-card__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.task-card__title {
  font-size: var(--fs-body);
  font-weight: 500;
  line-height: 1.4;
}

.task-card__tags {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--sp-1);
}

.task-card__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-1);
}

.task-card__secondary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-1);
}

.task-card__more {
  display: none;
}

@media (max-width: 767px) {
  .task-card__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-card__tags {
    justify-content: flex-start;
  }

  .task-card__more {
    display: inline-flex;
  }

  .task-card__secondary {
    display: none;
    width: 100%;
  }

  .task-card__secondary.is-open {
    display: flex;
  }
}
</style>
