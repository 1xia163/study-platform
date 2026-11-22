<script setup>
import { computed, reactive, ref, watch } from 'vue'

import BaseModal from '@/components/BaseModal.vue'
import { COURSE_NAMES, isValidCourse, isValidKnowledgePoint, knowledgePointsOf } from '@/constants/courses'
import { DEFAULT_PRIORITY, PRIORITIES, isValidPriority } from '@/constants/priority'
import { isBeforeToday, isValidDateString, todayString } from '@/utils/date'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  task: { type: Object, default: null },
  preset: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const form = reactive({
  title: '',
  course: '',
  knowledgePoint: '',
  deadline: '',
  priority: DEFAULT_PRIORITY,
  description: '',
})

const errors = reactive({
  title: '',
  course: '',
  deadline: '',
  priority: '',
  knowledgePoint: '',
})

const saving = ref(false)

const isEdit = computed(() => Boolean(props.task))
const titleText = computed(() => (isEdit.value ? '编辑任务' : '新建任务'))
const knowledgePoints = computed(() => knowledgePointsOf(form.course))
const originalDeadline = computed(() => (props.task ? props.task.deadline : ''))

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function fillForm() {
  clearErrors()
  saving.value = false

  if (props.task) {
    form.title = props.task.title ?? ''
    form.course = props.task.course ?? ''
    form.knowledgePoint = props.task.knowledgePoint ?? ''
    form.deadline = props.task.deadline ?? ''
    form.priority = props.task.priority ?? DEFAULT_PRIORITY
    form.description = props.task.description ?? ''
    return
  }

  const preset = props.preset ?? {}
  form.title = preset.title ?? ''
  form.course = isValidCourse(preset.course) ? preset.course : ''
  form.knowledgePoint =
    form.course && isValidKnowledgePoint(form.course, preset.knowledgePoint)
      ? preset.knowledgePoint
      : ''
  form.deadline = isValidDateString(preset.deadline) ? preset.deadline : todayString()
  form.priority = isValidPriority(preset.priority) ? preset.priority : DEFAULT_PRIORITY
  form.description = preset.description ?? ''
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) fillForm()
  },
)

function onCourseChange() {
  form.knowledgePoint = ''
  errors.course = ''
}

function validate() {
  clearErrors()

  if (!form.title.trim()) errors.title = '请输入任务标题'
  if (!isValidCourse(form.course)) errors.course = '请选择课程'

  if (!form.deadline) {
    errors.deadline = '请选择截止日期'
  } else if (!isValidDateString(form.deadline)) {
    errors.deadline = '请选择有效日期'
  } else if (isBeforeToday(form.deadline)) {
    // 编辑时保留原有的逾期日期是允许的，改成新的过去日期才拦截
    const keepOriginal = isEdit.value && form.deadline === originalDeadline.value
    if (!keepOriginal) errors.deadline = '截止日期不能早于今天'
  }

  if (!isValidPriority(form.priority)) errors.priority = '请选择优先级'
  if (form.knowledgePoint && !isValidKnowledgePoint(form.course, form.knowledgePoint)) {
    errors.knowledgePoint = '知识点不属于当前课程'
  }

  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  if (saving.value || !validate()) return

  saving.value = true
  // 本地存储没有真实网络延迟，这里留一小段等待以呈现「保存中」并防重复提交
  await new Promise((resolve) => setTimeout(resolve, 300))

  emit('submit', {
    title: form.title.trim(),
    course: form.course,
    knowledgePoint: form.knowledgePoint,
    deadline: form.deadline,
    priority: form.priority,
    description: form.description.trim(),
  })
  saving.value = false
}
</script>

<template>
  <BaseModal v-model="open" :title="titleText" desc="课程、截止日期与优先级为必填项。" size="md">
    <form class="task-form" novalidate @submit.prevent="handleSubmit">
      <div class="field task-form__full">
        <label class="field__label" for="task-title">标题<span class="req">*</span></label>
        <input
          id="task-title"
          v-model="form.title"
          class="input"
          :class="{ 'input--invalid': errors.title }"
          type="text"
          placeholder="例如：复习二叉树遍历"
          @input="errors.title = ''"
        />
        <p v-if="errors.title" class="field__error">{{ errors.title }}</p>
      </div>

      <div class="field">
        <label class="field__label" for="task-course">课程<span class="req">*</span></label>
        <select
          id="task-course"
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
        <label class="field__label" for="task-priority">优先级<span class="req">*</span></label>
        <select
          id="task-priority"
          v-model="form.priority"
          class="select"
          :class="{ 'select--invalid': errors.priority }"
          @change="errors.priority = ''"
        >
          <option v-for="item in PRIORITIES" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
        <p v-if="errors.priority" class="field__error">{{ errors.priority }}</p>
      </div>

      <div class="field">
        <label class="field__label" for="task-deadline">截止日期<span class="req">*</span></label>
        <input
          id="task-deadline"
          v-model="form.deadline"
          class="input"
          :class="{ 'input--invalid': errors.deadline }"
          type="date"
          @change="errors.deadline = ''"
        />
        <p v-if="errors.deadline" class="field__error">{{ errors.deadline }}</p>
      </div>

      <div class="field">
        <label class="field__label" for="task-knowledge-point">知识点</label>
        <select
          id="task-knowledge-point"
          v-model="form.knowledgePoint"
          class="select"
          :disabled="!form.course"
          @change="errors.knowledgePoint = ''"
        >
          <option value="">不指定</option>
          <option v-for="point in knowledgePoints" :key="point" :value="point">
            {{ point }}
          </option>
        </select>
        <p v-if="errors.knowledgePoint" class="field__error">{{ errors.knowledgePoint }}</p>
      </div>

      <div class="field task-form__full">
        <label class="field__label" for="task-description">说明</label>
        <textarea
          id="task-description"
          v-model="form.description"
          class="textarea task-form__textarea"
          placeholder="补充任务要求或提示（可选）"
        />
      </div>
    </form>

    <template #footer>
      <button class="btn btn--sm btn--ghost" type="button" @click="open = false">取消</button>
      <button
        class="btn btn--sm btn--primary"
        type="button"
        :disabled="saving"
        @click="handleSubmit"
      >
        {{ saving ? '保存中' : '保存' }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.task-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sp-2);
}

.task-form__full {
  grid-column: 1 / -1;
}

.task-form__textarea {
  min-height: 96px;
}

@media (max-width: 767px) {
  .task-form {
    grid-template-columns: 1fr;
  }
}
</style>
