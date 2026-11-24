<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'

import BaseModal from '@/components/BaseModal.vue'
import PageHeader from '@/components/PageHeader.vue'
import { COURSE_NAMES, isValidCourse, knowledgePointsOf } from '@/constants/courses'
import { DEFAULT_MASTERY, MASTERY } from '@/constants/mastery'
import { useNoteStore } from '@/stores/note'
import { useTaskStore } from '@/stores/task'
import { deletePhoto, getPhoto, putPhoto } from '@/utils/photoDb'

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

const MAX_PHOTOS = 6
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const photos = ref([])
const removedPhotoIds = ref([])
const photoError = ref('')
const previewOpen = ref(false)
const previewSrc = ref('')
const previewAlt = ref('')

const saving = ref(false)
const baseline = ref('')
let bypassGuard = false
let loadToken = 0

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
    photoIds: photos.value.map((photo) => photo.photoId),
  })
}

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function createPhotoId() {
  return `photo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function revokeBlobUrl(url) {
  if (typeof url === 'string' && url.startsWith('blob:')) URL.revokeObjectURL(url)
}

function fillFromNote(note) {
  form.title = note.title ?? ''
  form.course = note.course ?? ''
  form.knowledgePoint = note.knowledgePoint ?? ''
  form.tagsText = Array.isArray(note.tags) ? note.tags.join('，') : ''
  form.content = note.content ?? ''
  form.mastery = note.mastery ?? DEFAULT_MASTERY
  attachExistingPhotos(Array.isArray(note.photos) ? note.photos : [])
}

/** 先渲染元数据（含演示占位图），再异步把 IndexedDB 里的二进制换成 blob URL */
async function attachExistingPhotos(notePhotos) {
  const token = loadToken
  photos.value = notePhotos.map((photo) => ({
    photoId: photo.photoId,
    fileName: photo.fileName,
    fallbackSrc: photo.fallbackSrc ?? '',
    isNew: false,
    blob: null,
    url: photo.fallbackSrc ?? '',
  }))

  for (let index = 0; index < photos.value.length; index += 1) {
    const photoId = photos.value[index].photoId
    const blob = await getPhoto(photoId)
    if (token !== loadToken || !blob) continue
    const target = photos.value[index]
    if (!target || target.photoId !== photoId) continue
    target.url = URL.createObjectURL(blob)
  }
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
  photos.value.forEach((photo) => revokeBlobUrl(photo.url))
  photos.value = []
  removedPhotoIds.value = []
  photoError.value = ''
}

function load() {
  loadToken += 1
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

function buildPhotoMeta() {
  return photos.value.map((photo, index) => {
    const meta = { photoId: photo.photoId, fileName: photo.fileName, sortOrder: index }
    if (photo.fallbackSrc) meta.fallbackSrc = photo.fallbackSrc
    return meta
  })
}

function buildPayload() {
  return {
    title: form.title.trim(),
    course: form.course,
    knowledgePoint: form.knowledgePoint,
    tags: parseTags(form.tagsText),
    content: form.content.trim(),
    mastery: form.mastery,
    photos: buildPhotoMeta(),
  }
}

/** 新照片写 IndexedDB、被移除的照片删掉；两者都成功后才更新 localStorage 元数据 */
async function persistPhotos() {
  const removed = [...removedPhotoIds.value]
  for (const photo of photos.value) {
    if (photo.isNew && photo.blob) await putPhoto(photo.photoId, photo.blob)
  }
  for (const photoId of removed) await deletePhoto(photoId)

  removedPhotoIds.value = []
  photos.value.forEach((photo) => {
    photo.isNew = false
    photo.blob = null
  })
}

async function save() {
  if (saving.value || !validate()) return false

  saving.value = true
  // 本地存储没有真实网络延迟，这里留一小段等待以呈现「保存中」并防重复提交
  await new Promise((resolve) => setTimeout(resolve, 300))

  try {
    await persistPhotos()
  } catch {
    photoError.value = '照片保存失败，请重试'
    saving.value = false
    return false
  }

  const payload = buildPayload()
  if (isEdit.value) noteStore.updateNote(noteId.value, payload)
  else noteStore.addNote(payload)

  saving.value = false
  baseline.value = snapshot()
  return true
}

function onFilesSelected(event) {
  const files = Array.from(event.target.files ?? [])
  event.target.value = ''
  if (!files.length) return

  photoError.value = ''
  let message = ''

  for (const file of files) {
    if (photos.value.length >= MAX_PHOTOS) {
      message = `最多只能添加 ${MAX_PHOTOS} 张照片`
      break
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      message = `${file.name} 不是 JPEG / PNG / WebP 图片`
      continue
    }
    if (file.size > MAX_PHOTO_BYTES) {
      message = `${file.name} 超过 5MB`
      continue
    }
    photos.value.push({
      photoId: createPhotoId(),
      fileName: file.name,
      fallbackSrc: '',
      isNew: true,
      blob: file,
      url: URL.createObjectURL(file),
    })
  }

  if (message) photoError.value = message
}

function movePhoto(index, offset) {
  const target = index + offset
  if (target < 0 || target >= photos.value.length) return
  const list = [...photos.value]
  const [item] = list.splice(index, 1)
  list.splice(target, 0, item)
  photos.value = list
}

function removePhoto(index) {
  const [item] = photos.value.splice(index, 1)
  if (!item) return
  revokeBlobUrl(item.url)
  if (!item.isNew) removedPhotoIds.value.push(item.photoId)
  photoError.value = ''
}

function openPreview(index) {
  const photo = photos.value[index]
  if (!photo || !photo.url) {
    photoError.value = '这张演示照片没有实际图片，添加新照片后可预览'
    return
  }
  previewSrc.value = photo.url
  previewAlt.value = photo.fileName
  previewOpen.value = true
}

onBeforeUnmount(() => {
  photos.value.forEach((photo) => revokeBlobUrl(photo.url))
})

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

      <div class="field">
        <span class="field__label">照片（最多 {{ MAX_PHOTOS }} 张）</span>

        <div class="photo-grid">
          <figure v-for="(photo, index) in photos" :key="photo.photoId" class="photo-tile">
            <button
              class="photo-tile__preview"
              type="button"
              :aria-label="`预览 ${photo.fileName}`"
              @click="openPreview(index)"
            >
              <img v-if="photo.url" :src="photo.url" :alt="photo.fileName" />
              <span v-else class="photo-tile__placeholder">暂无预览</span>
            </button>

            <figcaption class="photo-tile__name">{{ photo.fileName }}</figcaption>

            <div class="photo-tile__actions">
              <button
                class="btn btn--sm btn--ghost"
                type="button"
                :disabled="index === 0"
                :aria-label="`前移 ${photo.fileName}`"
                @click="movePhoto(index, -1)"
              >
                ↑
              </button>
              <button
                class="btn btn--sm btn--ghost"
                type="button"
                :disabled="index === photos.length - 1"
                :aria-label="`后移 ${photo.fileName}`"
                @click="movePhoto(index, 1)"
              >
                ↓
              </button>
              <button
                class="btn btn--sm btn--danger"
                type="button"
                :aria-label="`移除 ${photo.fileName}`"
                @click="removePhoto(index)"
              >
                移除
              </button>
            </div>
          </figure>

          <label v-if="photos.length < MAX_PHOTOS" class="photo-add">
            <input
              class="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              @change="onFilesSelected"
            />
            <span class="photo-add__icon" aria-hidden="true">＋</span>
            <span class="photo-add__text">添加照片</span>
          </label>
        </div>

        <p v-if="photoError" class="field__error">{{ photoError }}</p>
        <p v-else class="small muted">
          支持 JPEG / PNG / WebP，单张不超过 5MB；排序与移除在保存后才生效。
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

    <BaseModal v-model="previewOpen" :title="previewAlt || '照片预览'" size="lg">
      <img v-if="previewSrc" class="photo-preview" :src="previewSrc" :alt="previewAlt" />
      <template #footer>
        <button class="btn btn--sm btn--ghost" type="button" @click="previewOpen = false">
          关闭
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

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--sp-2);
}

.photo-tile {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: var(--sp-1);
  border: 1px solid var(--c-border);
  border-radius: var(--r-field);
  background: var(--c-surface);
}

.photo-tile__preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: none;
  border-radius: var(--r-field);
  background: var(--c-green-soft);
  padding: 0;
}

.photo-tile__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-tile__placeholder {
  color: var(--c-green);
  font-size: var(--fs-sub);
}

.photo-tile__name {
  overflow: hidden;
  color: var(--c-text-muted);
  font-size: var(--fs-sub);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.photo-tile__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.photo-tile__actions .btn {
  min-width: 36px;
  padding: 0 8px;
}

.photo-add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  aspect-ratio: 4 / 3;
  border: 1px dashed var(--c-border-strong);
  border-radius: var(--r-field);
  color: var(--c-text-muted);
  font-size: var(--fs-sub);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
}

.photo-add:hover {
  border-color: var(--c-green);
  color: var(--c-green);
}

.photo-add__icon {
  font-size: var(--fs-section);
  line-height: 1;
}

.photo-preview {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

@media (max-width: 767px) {
  .note-form__row {
    grid-template-columns: 1fr;
  }

  .note-form__content {
    min-height: 160px;
  }

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
