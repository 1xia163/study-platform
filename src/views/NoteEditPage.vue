<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

import BaseModal from '@/components/BaseModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import { COURSE_NAMES, isValidCourse, knowledgePointsOf } from '@/constants/courses'
import { DEFAULT_MASTERY, MASTERY } from '@/constants/mastery'
import { useNoteStore } from '@/stores/note'
import { useTaskStore } from '@/stores/task'

const route = useRoute()
const router = useRouter()
const noteStore = useNoteStore()
const taskStore = useTaskStore()

const noteId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const isEdit = computed(() => Boolean(noteId.value))

const form = reactive({
  title: '',
  course: '',
  knowledgePoint: '',
  tagsText: '',
  content: '',
  mastery: DEFAULT_MASTERY,
})

const errors = reactive({
  title: '',
  course: '',
  knowledgePoint: '',
  content: '',
})

const photos = ref([])
const saving = ref(false)
const baseline = ref('')
let bypassGuard = false

const knowledgePoints = computed(() => knowledgePointsOf(form.course))
const isDirty = computed(() => baseline.value !== '' && snapshot() !== baseline.value)

function snapshot() {
  return JSON.stringify({
    title: form.title,
    course: form.course,
    knowledgePoint: form.knowledgePoint,
    tagsText: form.tagsText,
    content: form.content,
    mastery: form.mastery,
  })
}

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function fillFromNote(note) {
  form.title = note.title ?? ''
  form.course = note.course ?? ''
  form.knowledgePoint = note.knowledgePoint ?? ''
  form.tagsText = Array.isArray(note.tags) ? note.tags.join('，') : ''
  form.content = note.content ?? ''
  form.mastery = note.mastery ?? DEFAULT_MASTERY
  photos.value = Array.isArray(note.photos) ? [...note.photos] : []
}

function fillFromQuery() {
  const query = route.query
  const taskId = typeof query.sourceTaskId === 'string' ? query.sourceTaskId : ''
  const task = taskId ? taskStore.tasks.find((item) => item.taskId === taskId) : null

  const course = typeof query.course === 'string' ? query.course : (task?.course ?? '')
  if (course && isValidCourse(course)) form.course = course

  const point = typeof query.knowledgePoint === 'string' ? query.knowledgePoint : ''
  if (form.course && knowledgePointsOf(form.course).includes(point)) form.knowledgePoint = point
  else if (task?.knowledgePoint && form.course === task.course) form.knowledgePoint = task.knowledgePoint

  if (typeof query.title === 'string' && query.title.trim()) form.title = query.title.trim()
}

function resetForm() {
  form.title = ''
  form.course = ''
  form.knowledgePoint = ''
  form.tagsText = ''
  form.content = ''
  form.mastery = DEFAULT_MASTERY
  photos.value = []
}

function load() {
  clearErrors()
  baseline.value = ''
  resetForm()

  if (isEdit.value) {
    const note = noteStore.notes.find((item) => item.noteId === noteId.value)
    if (!note) {
      router.replace({ name: 'note-list' })
      return
    }
    fillFromNote(note)
  } else {
    fillFromQuery()
  }

  baseline.value = snapshot()
}

watch(() => [route.params.id, route.query], load, { immediate: true })

function onCourseChange() {
  form.knowledgePoint = ''
  errors.course = ''
}

function validate() {
  clearErrors()

  if (!form.title.trim()) errors.title = '请输入笔记标题'
  if (!isValidCourse(form.course)) errors.course = '请选择课程'

  if (form.knowledgePoint && !knowledgePoints.value.includes(form.knowledgePoint)) {
    errors.knowledgePoint = '知识点不属于当前课程'
  }

  if (!form.content.trim() && photos.value.length === 0) {
    errors.content = '请填写正文，或至少添加一张照片'
  }

  return !Object.values(errors).some(Boolean)
}

function parseTags(text) {
  return [...new Set(String(text).split(/[,，、]/).map((item) => item.trim()).filter(Boolean))]
}

function buildPayload() {
  return {
    title: form.title.trim(),
    course: form.course,
    knowledgePoint: form.knowledgePoint,
    tags: parseTags(form.tagsText),
    content: form.content.trim(),
    mastery: form.mastery,
  }
}

async function save() {
  if (saving.value || !validate()) return false

  saving.value = true
  // 本地存储没有真实网络延迟，这里留一小段等待以呈现「保存中」并防重复提交
  await new Promise((resolve) => setTimeout(resolve, 300))

  const payload = buildPayload()
  if (isEdit.value) noteStore.updateNote(noteId.value, payload)
  else noteStore.addNote(payload)

  saving.value = false
  baseline.value = snapshot()
  return true
}

async function handleSave() {
  const ok = await save()
  if (ok) router.push({ name: 'note-list' })
}

const leaveOpen = ref(false)
const pendingTarget = ref(null)

onBeforeRouteLeave((to) => {
  if (bypassGuard || !isDirty.value) return true
  pendingTarget.value = to.fullPath
  leaveOpen.value = true
  return false
})

function stayOnPage() {
  leaveOpen.value = false
  pendingTarget.value = null
}

function discardAndLeave() {
  bypassGuard = true
  leaveOpen.value = false
  const target = pendingTarget.value
  pendingTarget.value = null
  router.push(target ?? { name: 'note-list' })
}

async function saveAndLeave() {
  const ok = await save()
  if (!ok) {
    leaveOpen.value = false
    return
  }
  bypassGuard = true
  leaveOpen.value = false
  const target = pendingTarget.value
  pendingTarget.value = null
  router.push(target ?? { name: 'note-list' })
}
</script>

<template>
  <div class="page page--narrow">
    <PageHeader
      :eyebrow="isEdit ? 'P04 · F03 / F05 · 编辑' : 'P04 · F03 / F05 · 新建'"
      :title="isEdit ? '编辑笔记' : '新建笔记'"
      desc="课程、知识点和掌握程度串联任务、笔记与自测；保存后才更新列表和首页。"
      art="相片与图文笔记"
      art-src="/illustrations/p04-photo-notes.png"
    >
      <template #actions>
        <RouterLink class="btn btn--sm btn--ghost" :to="{ name: 'note-list' }">返回列表</RouterLink>
        <button
          class="btn btn--sm btn--primary"
          type="button"
          :disabled="saving"
          @click="handleSave"
        >
          {{ saving ? '保存中' : '保存' }}
        </button>
      </template>
    </PageHeader>

    <form class="card note-form" novalidate @submit.prevent="handleSave">
      <div class="field">
        <label class="field__label" for="note-title">标题<span class="req">*</span></label>
        <input
          id="note-title"
          v-model="form.title"
          class="input"
          :class="{ 'input--invalid': errors.title }"
          type="text"
          placeholder="例如：二叉树遍历方法"
          @input="errors.title = ''"
        />
        <p v-if="errors.title" class="field__error">{{ errors.title }}</p>
      </div>

      <div class="note-form__row">
        <div class="field">
          <label class="field__label" for="note-course">课程<span class="req">*</span></label>
          <select
            id="note-course"
            v-model="form.course"
            class="select"
            :class="{ 'select--invalid': errors.course }"
            @change="onCourseChange"
          >
            <option value="">请选择课程</option>
            <option v-for="name in COURSE_NAMES" :key="name" :value="name">{{ name }}</option>
          </select>
          <p v-if="errors.course" class="field__error">{{ errors.course }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="note-point">知识点</label>
          <select
            id="note-point"
            v-model="form.knowledgePoint"
            class="select"
            :class="{ 'select--invalid': errors.knowledgePoint }"
            :disabled="!form.course"
            @change="errors.knowledgePoint = ''"
          >
            <option value="">不指定</option>
            <option v-for="point in knowledgePoints" :key="point" :value="point">{{ point }}</option>
          </select>
          <p v-if="errors.knowledgePoint" class="field__error">{{ errors.knowledgePoint }}</p>
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="note-tags">标签</label>
        <input
          id="note-tags"
          v-model="form.tagsText"
          class="input"
          type="text"
          placeholder="用逗号分隔，例如：递归，遍历"
        />
        <p class="small muted">保存时会去掉空标签和重复项。</p>
      </div>

      <div class="field">
        <span class="field__label">掌握程度<span class="req">*</span></span>
        <div class="mastery-group" role="radiogroup" aria-label="掌握程度">
          <button
            v-for="item in MASTERY"
            :key="item.value"
            class="mastery-option"
            :class="[item.tagClass, { 'is-active': form.mastery === item.value }]"
            type="button"
            role="radio"
            :aria-checked="form.mastery === item.value"
            @click="form.mastery = item.value"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="note-content">
          正文<span v-if="photos.length === 0" class="req">*</span>
        </label>
        <textarea
          id="note-content"
          v-model="form.content"
          class="textarea note-form__content"
          :class="{ 'textarea--invalid': errors.content }"
          placeholder="记录知识要点、例题思路或易错提醒"
          @input="errors.content = ''"
        />
        <p v-if="errors.content" class="field__error">{{ errors.content }}</p>
        <p v-else-if="photos.length" class="small muted">
          本笔记已有 {{ photos.length }} 张照片，正文可以留空。
        </p>
      </div>
    </form>

    <BaseModal
      v-model="leaveOpen"
      title="有未保存的修改"
      desc="离开后这些修改不会保留。"
      size="sm"
      :close-on-overlay="false"
    >
      <p class="small muted">可以先保存再离开，也可以直接放弃这次修改。</p>

      <template #footer>
        <button class="btn btn--sm btn--ghost" type="button" @click="stayOnPage">继续编辑</button>
        <button class="btn btn--sm btn--danger" type="button" @click="discardAndLeave">
          放弃修改
        </button>
        <button
          class="btn btn--sm btn--primary"
          type="button"
          :disabled="saving"
          @click="saveAndLeave"
        >
          {{ saving ? '保存中' : '保存后离开' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.note-form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.note-form__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sp-2);
}

.note-form__content {
  min-height: 220px;
}

.mastery-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-1);
}

.mastery-option {
  padding: 6px 16px;
  border: 1px solid transparent;
  border-radius: var(--r-tag);
  color: var(--c-text);
  font-size: var(--fs-sub);
  line-height: 1.6;
  opacity: 0.62;
  transition:
    opacity 0.15s ease,
    border-color 0.15s ease;
}

.mastery-option:hover {
  opacity: 0.85;
}

.mastery-option.is-active {
  border-color: var(--c-green);
  font-weight: 500;
  opacity: 1;
}

@media (max-width: 767px) {
  .note-form__row {
    grid-template-columns: 1fr;
  }

  .note-form__content {
    min-height: 160px;
  }
}
</style>
