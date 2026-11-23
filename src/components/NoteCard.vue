<script setup>
import { computed } from 'vue'

import MasteryTag from '@/components/MasteryTag.vue'
import { formatDateTime } from '@/utils/date'

const props = defineProps({
  note: { type: Object, required: true },
})

const photoCount = computed(() => (Array.isArray(props.note.photos) ? props.note.photos.length : 0))
const updatedText = computed(() => formatDateTime(props.note.updatedAt))
</script>

<template>
  <article class="card note-card">
    <RouterLink
      class="note-card__main"
      :to="{ name: 'note-edit', params: { id: note.noteId } }"
    >
      <div class="note-card__head">
        <h2 class="note-card__title">{{ note.title }}</h2>
        <MasteryTag :value="note.mastery" />
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
    </RouterLink>
  </article>
</template>

<style scoped>
.note-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
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
