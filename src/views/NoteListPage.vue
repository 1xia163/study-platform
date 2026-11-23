<script setup>
import { computed } from 'vue'

import EmptyState from '@/components/EmptyState.vue'
import NoteCard from '@/components/NoteCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useNoteStore } from '@/stores/note'

const noteStore = useNoteStore()

const notes = computed(() => noteStore.sortedByUpdatedAt)
const hasNotes = computed(() => noteStore.totalCount > 0)
</script>

<template>
  <div class="page">
    <PageHeader
      eyebrow="P03 · F03"
      title="课程笔记"
      desc="按课程和知识点找笔记，再决定继续编辑、复习或用真题检验理解。"
      art="书籍与课程笔记"
      art-src="/illustrations/p03-note-library.png"
    >
      <template #actions>
        <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'note-new' }">新建笔记</RouterLink>
      </template>
    </PageHeader>

    <p class="note-summary card card--soft">共 {{ noteStore.totalCount }} 条笔记，按更新时间倒序排列。</p>

    <EmptyState
      v-if="!hasNotes"
      variant="empty"
      title="还没有笔记"
      desc="把刚学的知识点记下来，之后复习和自测都用得上。"
    >
      <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'note-new' }">新建笔记</RouterLink>
    </EmptyState>

    <div v-else class="stack">
      <NoteCard v-for="note in notes" :key="note.noteId" :note="note" />
    </div>
  </div>
</template>

<style scoped>
.note-summary {
  margin-bottom: var(--sp-3);
  color: var(--c-green);
  font-size: var(--fs-sub);
}
</style>

