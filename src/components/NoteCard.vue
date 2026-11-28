<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import MasteryTag from '@/components/MasteryTag.vue'
import { formatDateTime } from '@/utils/date'

const props = defineProps({
  note: { type: Object, required: true },
  selectable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-select', 'review', 'delete'])

const photoCount = computed(() => (Array.isArray(props.note.photos) ? props.note.photos.length : 0))
const updatedText = computed(() => formatDateTime(props.note.updatedAt))

function onMainClick(event) {
  if (!props.selectable) return
  event.preventDefault()
  emit('toggle-select', props.note)
}

function onKeydown(event) {
  if (!props.selectable) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('toggle-select', props.note)
  }
}
</script>

<template>
  <article class="card note-card" :class="{ 'is-selected': selectable && selected }">
    <component
      :is="selectable ? 'div' : RouterLink"
      class="note-card__main"
      :to="selectable ? undefined : { name: 'note-edit', params: { id: note.noteId } }"
      :role="selectable ? 'checkbox' : undefined"
      :aria-checked="selectable ? selected : undefined"
      :tabindex="selectable ? 0 : undefined"
      @click="onMainClick"
      @keydown="onKeydown"
    >
      <div class="note-card__head">
        <h2 class="note-card__title">{{ note.title }}</h2>
        <div class="note-card__badges">
          <MasteryTag :value="note.mastery" />
          <span
            v-if="selectable"
            class="note-card__check"
            :class="{ 'is-on': selected }"
            aria-hidden="true"
          >
            {{ selected ? '✓' : '' }}
          </span>
        </div>
      </div>

      <p class="note-card__meta small muted">
        {{ note.course }}
        <template v-if="note.knowledgePoint"> · {{ note.knowledgePoint }}</template>
        · 更新于 {{ updatedText }}
        <template v-if="photoCount"> · 照片 {{ photoCount }} 张</template>
      </p>

      <p v-if="note.content" class="note-card__excerpt">{{ note.content }}</p>

      <ul v-if="note.tags && note.tags.length" class="note-card__tags">
        <li v-for="tag in note.tags" :key="tag" class="tag tag--outline">{{ tag }}</li>
      </ul>
    </component>

    <div v-if="!selectable" class="note-card__actions">
      <button class="btn btn--sm btn--ghost" type="button" @click="emit('review', note)">
        复习
      </button>
      <button class="btn btn--sm btn--danger" type="button" @click="emit('delete', note)">
        删除
      </button>
    </div>
  </article>
</template>

<style scoped>
.note-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.note-card.is-selected {
  border-color: var(--c-green);
  background: var(--c-green-soft);
}

.note-card__main {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  min-width: 0;
}

.note-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-2);
}

.note-card__title {
  font-size: var(--fs-body);
  font-weight: 500;
  line-height: 1.4;
}

.note-card__badges {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--sp-1);
}

.note-card__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid var(--c-border-strong);
  border-radius: 50%;
  background: var(--c-surface);
  color: #fff;
  font-size: 13px;
  line-height: 1;
}

.note-card__check.is-on {
  border-color: var(--c-green);
  background: var(--c-green);
}

.note-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-1);
}

.note-card__excerpt {
  display: -webkit-box;
  overflow: hidden;
  color: var(--c-text-muted);
  font-size: var(--fs-sub);
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.note-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-1);
}

@media (max-width: 767px) {
  .note-card__head {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sp-1);
  }
}
</style>
