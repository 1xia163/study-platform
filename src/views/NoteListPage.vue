<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseModal from '@/components/BaseModal.vue'
import EmptyState from '@/components/EmptyState.vue'
import NoteCard from '@/components/NoteCard.vue'
import PageHeader from '@/components/PageHeader.vue'
import SearchFilterBar from '@/components/SearchFilterBar.vue'
import { COURSE_NAMES, isValidKnowledgePoint } from '@/constants/courses'
import { useNoteStore } from '@/stores/note'
import { useTaskStore } from '@/stores/task'

const noteStore = useNoteStore()
const taskStore = useTaskStore()
const route = useRoute()
const router = useRouter()

const keyword = ref('')
const courseFilter = ref('all')
const tagFilter = ref('all')
const sortOrder = ref('desc')
const isLoading = ref(true)

const sourceCourse = ref('')
const sourcePoint = ref('')
const sourceTaskId = ref('')
const selectedIds = ref([])

const SORT_OPTIONS = [
  { value: 'desc', label: '更新时间 ↓' },
  { value: 'asc', label: '更新时间 ↑' },
]

const pickMode = computed(() => route.query.pick === '1' && Boolean(sourceTaskId.value))
const sourceTask = computed(
  () => taskStore.tasks.find((task) => task.taskId === sourceTaskId.value) ?? null,
)
const hasSource = computed(() => Boolean(sourceCourse.value || sourcePoint.value || sourceTaskId.value))
const sourceLabel = computed(() => {
  const parts = []
  if (sourceCourse.value) parts.push(sourceCourse.value)
  if (sourcePoint.value) parts.push(sourcePoint.value)
  if (sourceTask.value) parts.push(`任务「${sourceTask.value.title}」`)
  return parts.join(' · ')
})

const courseNotes = computed(() =>
  courseFilter.value === 'all'
    ? noteStore.notes
    : noteStore.notes.filter((note) => note.course === courseFilter.value),
)

const tagOptions = computed(() => {
  const tags = new Set()
  courseNotes.value.forEach((note) => note.tags.forEach((tag) => tags.add(tag)))
  return [...tags].sort((left, right) => left.localeCompare(right, 'zh-Hans-CN'))
})

const filteredNotes = computed(() => {
  const word = keyword.value.trim().toLowerCase()
  return noteStore.notes.filter((note) => {
    if (word && !note.title.toLowerCase().includes(word)) return false
    if (courseFilter.value !== 'all' && note.course !== courseFilter.value) return false
    if (sourcePoint.value && note.knowledgePoint !== sourcePoint.value) return false
    if (tagFilter.value !== 'all' && !note.tags.includes(tagFilter.value)) return false
    return true
  })
})

const visibleNotes = computed(() =>
  [...filteredNotes.value].sort((left, right) =>
    sortOrder.value === 'asc'
      ? left.updatedAt - right.updatedAt
      : right.updatedAt - left.updatedAt,
  ),
)

const hasNotes = computed(() => noteStore.totalCount > 0)

let loadingTimer = null
onMounted(() => {
  loadingTimer = window.setTimeout(() => {
    isLoading.value = false
  }, 300)
})
onBeforeUnmount(() => {
  if (loadingTimer) window.clearTimeout(loadingTimer)
})

const QUERY_KEYS = ['course', 'knowledgePoint', 'sourceTaskId', 'pick']
let appliedQueryKey = ''

function queryKeyOf(query) {
  return QUERY_KEYS.map((key) => `${key}=${query[key] ?? ''}`).join('&')
}

function readQuery() {
  const query = route.query
  const key = queryKeyOf(query)
  if (key === appliedQueryKey) return
  appliedQueryKey = key

  const course = typeof query.course === 'string' ? query.course : ''
  const point = typeof query.knowledgePoint === 'string' ? query.knowledgePoint : ''
  const taskId = typeof query.sourceTaskId === 'string' ? query.sourceTaskId : ''

  sourceCourse.value = COURSE_NAMES.includes(course) ? course : ''
  sourcePoint.value =
    sourceCourse.value && isValidKnowledgePoint(sourceCourse.value, point) ? point : ''
  sourceTaskId.value = taskId

  if (sourceCourse.value) courseFilter.value = sourceCourse.value

  if (taskId) {
    const task = taskStore.tasks.find((item) => item.taskId === taskId)
    selectedIds.value = task ? [...task.linkedNoteIds] : []
  }
}

watch(() => route.query, readQuery, { immediate: true })

watch(courseFilter, () => {
  if (tagFilter.value !== 'all' && !tagOptions.value.includes(tagFilter.value)) {
    tagFilter.value = 'all'
  }
})

function clearSource() {
  sourceCourse.value = ''
  sourcePoint.value = ''
  sourceTaskId.value = ''
  selectedIds.value = []
  courseFilter.value = 'all'
  if (Object.keys(route.query).length > 0) router.replace({ name: 'note-list' })
}

function resetFilters() {
  keyword.value = ''
  tagFilter.value = 'all'
  sortOrder.value = 'desc'
  clearSource()
}

function toggleSelect(note) {
  const index = selectedIds.value.indexOf(note.noteId)
  if (index === -1) selectedIds.value.push(note.noteId)
  else selectedIds.value.splice(index, 1)
}

function confirmPick() {
  const taskId = sourceTaskId.value
  if (!taskId || !selectedIds.value.length) return

  const task = taskStore.tasks.find((item) => item.taskId === taskId)
  const merged = [...new Set([...(task?.linkedNoteIds ?? []), ...selectedIds.value])]
  taskStore.linkNotes(taskId, merged)
  merged.forEach((noteId) => noteStore.linkTask(noteId, taskId))
  router.push({ name: 'plan' })
}

function cancelPick() {
  selectedIds.value = []
  router.replace({ name: 'note-list' })
}

const deletingNote = ref(null)
const deleteOpen = computed({
  get: () => deletingNote.value !== null,
  set: (open) => {
    if (!open) deletingNote.value = null
  },
})
const deleteTitle = computed(() =>
  deletingNote.value ? `删除笔记「${deletingNote.value.title}」？` : '删除笔记',
)

function handleDelete(note) {
  deletingNote.value = note
}

function confirmDelete() {
  if (!deletingNote.value) return
  const noteId = deletingNote.value.noteId
  noteStore.removeNote(noteId)
  taskStore.tasks.forEach((task) => {
    if (task.linkedNoteIds.includes(noteId)) {
      taskStore.linkNotes(
        task.taskId,
        task.linkedNoteIds.filter((id) => id !== noteId),
      )
    }
  })
  deletingNote.value = null
}

function handleReview(note) {
  const query = { action: 'new', title: `复习：${note.title}` }
  if (note.course) query.course = note.course
  if (note.knowledgePoint) query.knowledgePoint = note.knowledgePoint
  router.push({ name: 'plan', query })
}
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
        <RouterLink
          v-if="!pickMode"
          class="btn btn--primary btn--sm"
          :to="{ name: 'note-new' }"
        >
          新建笔记
        </RouterLink>
      </template>
    </PageHeader>

    <div v-if="hasSource" class="card card--soft note-source">
      <p class="small">来源条件：{{ sourceLabel }}</p>
      <div class="note-source__actions">
        <button
          v-if="pickMode"
          class="btn btn--sm btn--ghost"
          type="button"
          @click="cancelPick"
        >
          返回原任务
        </button>
        <button class="btn btn--sm btn--ghost" type="button" @click="resetFilters">
          清除来源条件
        </button>
      </div>
    </div>

    <div v-if="pickMode" class="card note-pick">
      <p class="small">
        选择要关联到{{ sourceTask ? `任务「${sourceTask.title}」` : '原任务' }}的笔记，可多选；已选
        {{ selectedIds.length }} 条。
      </p>
      <div class="note-pick__actions">
        <button class="btn btn--sm btn--ghost" type="button" @click="cancelPick">取消</button>
        <button
          class="btn btn--sm btn--green"
          type="button"
          :disabled="selectedIds.length === 0"
          @click="confirmPick"
        >
          确认关联
        </button>
      </div>
    </div>

    <p class="note-summary card card--soft">
      共 {{ noteStore.totalCount }} 条笔记，按更新时间{{ sortOrder === 'asc' ? '升序' : '倒序' }}排列<template
        v-if="visibleNotes.length !== noteStore.totalCount"
      >，当前筛选出 {{ visibleNotes.length }} 条</template
      >。
    </p>

    <SearchFilterBar v-model:keyword="keyword" placeholder="搜索笔记标题" @reset="resetFilters">
      <select v-model="courseFilter" class="select filter-control" aria-label="按课程筛选笔记">
        <option value="all">全部课程</option>
        <option v-for="name in COURSE_NAMES" :key="name" :value="name">{{ name }}</option>
      </select>

      <select v-model="tagFilter" class="select filter-control" aria-label="按标签筛选笔记">
        <option value="all">全部标签</option>
        <option v-for="tag in tagOptions" :key="tag" :value="tag">{{ tag }}</option>
      </select>

      <select
        v-model="sortOrder"
        class="select filter-control filter-control--sort"
        aria-label="按更新时间排序"
      >
        <option v-for="item in SORT_OPTIONS" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </SearchFilterBar>

    <div v-if="isLoading" class="stack" aria-busy="true" aria-label="笔记加载中">
      <div v-for="n in 3" :key="n" class="card skeleton-card">
        <span class="skeleton-line skeleton-line--title" />
        <span class="skeleton-line skeleton-line--meta" />
        <span class="skeleton-line skeleton-line--tags" />
      </div>
    </div>

    <EmptyState
      v-else-if="!hasNotes"
      variant="empty"
      title="还没有笔记"
      desc="把刚学的知识点记下来，之后复习和自测都用得上。"
    >
      <RouterLink class="btn btn--primary btn--sm" :to="{ name: 'note-new' }">新建笔记</RouterLink>
    </EmptyState>

    <EmptyState
      v-else-if="visibleNotes.length === 0"
      variant="no-result"
      title="没有符合条件的笔记"
      desc="换个关键词，或清除课程与标签筛选再看看。"
    >
      <button class="btn btn--sm btn--ghost" type="button" @click="resetFilters">
        清除筛选
      </button>
    </EmptyState>

    <div v-else class="stack">
      <NoteCard
        v-for="note in visibleNotes"
        :key="note.noteId"
        :note="note"
        :selectable="pickMode"
        :selected="selectedIds.includes(note.noteId)"
        @toggle-select="toggleSelect"
        @review="handleReview"
        @delete="handleDelete"
      />
    </div>

    <BaseModal
      v-model="deleteOpen"
      :title="deleteTitle"
      desc="删除后无法恢复，任务里的关联也会一并移除。"
      size="sm"
    >
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
.note-summary {
  margin-bottom: var(--sp-3);
  color: var(--c-green);
  font-size: var(--fs-sub);
}

.note-source {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
  color: var(--c-green);
}

.note-source__actions,
.note-pick__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-1);
}

.note-pick {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
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
  animation: note-skeleton 1.2s ease-in-out infinite;
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

@keyframes note-skeleton {
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

