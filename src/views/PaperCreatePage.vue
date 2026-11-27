<script setup>
import PageHeader from '@/components/PageHeader.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestionStore } from '@/stores/question'

const route = useRoute()
const router = useRouter()
const qStore = useQuestionStore()

// 表单状态
const course = ref('')
const yearStart = ref('')
const yearEnd = ref('')
const knowledgePoints = ref([])

// 题型数量
const typeCounts = ref({
  单选: 0,
  多选: 0,
  判断: 0,
  主观: 0,
})

// 动态课程和知识点
const courseOptions = computed(() =>
  [...new Set(qStore.questionList.map((q) => q.course).filter(Boolean))].map((value) => ({
    label: value,
    value,
  }))
)
const courseQuestions = computed(() => qStore.questionList.filter((q) => q.course === course.value))
const currentKnowledgeOptions = computed(() =>
  [...new Set(courseQuestions.value.map((q) => q.knowledgePoint).filter(Boolean))].map((value) => ({
    label: value,
    value,
  }))
)
const hasKnownYears = computed(() => courseQuestions.value.some((q) => Number.isInteger(q.year)))
const keyword = ref('')
const inheritedType = ref('')
const clearExtraFilters = () => {
  keyword.value = ''
  inheritedType.value = ''
}
watch(
  course,
  () => {
    knowledgePoints.value = []
    yearStart.value = ''
    yearEnd.value = ''
    keyword.value = ''
    inheritedType.value = ''
  },
  { flush: 'sync' }
)

// 总题量
const totalCount = computed(() => {
  return Object.values(typeCounts.value).reduce((sum, val) => sum + Number(val || 0), 0)
})

// 根据条件筛选题库
const filterQuestions = computed(() => {
  let list = [...qStore.questionList]
  if (keyword.value) list = list.filter((q) => q.title.includes(keyword.value))
  if (inheritedType.value) list = list.filter((q) => q.type === inheritedType.value)

  if (course.value) {
    list = list.filter((item) => item.course === course.value)
  }

  if (yearStart.value !== '' || yearEnd.value !== '') {
    list = list.filter((item) =>
      (item.years || [item.year]).some(
        (year) =>
          Number.isInteger(year) &&
          (yearStart.value === '' || year >= Number(yearStart.value)) &&
          (yearEnd.value === '' || year <= Number(yearEnd.value))
      )
    )
  }

  if (yearEnd.value !== '') {
    list = list.filter(
      (item) => Number.isInteger(item.year) && Number(item.year) <= Number(yearEnd.value)
    )
  }

  if (knowledgePoints.value.length > 0) {
    list = list.filter((item) => knowledgePoints.value.includes(item.knowledgePoint))
  }

  return list
})

// 各题型可用数量
const availableByType = computed(() => {
  const map = {
    单选: 0,
    多选: 0,
    判断: 0,
    主观: 0,
  }

  filterQuestions.value.forEach((q) => {
    if (map[q.type] !== undefined) {
      map[q.type]++
    }
  })

  return map
})

// 符合条件的题目总数
const availableTotal = computed(() => {
  return filterQuestions.value.length
})

// 题型统计
const typeSummary = computed(() => {
  return [
    { name: '单选', count: availableByType.value.单选 },
    { name: '多选', count: availableByType.value.多选 },
    { name: '判断', count: availableByType.value.判断 },
    { name: '主观', count: availableByType.value.主观 },
  ]
})

// 题量不足提示
const lackTip = computed(() => {
  const tips = []

  for (const type of Object.keys(typeCounts.value)) {
    const need = Number(typeCounts.value[type])
    const have = availableByType.value[type]

    if (need > have) {
      tips.push(`${type}：需要${need}题，题库仅${have}题`)
    }
  }

  return tips
})

// 表单校验
const canGenerate = computed(() => {
  if (!course.value) return false

  if (totalCount.value < 1) return false

  if (
    yearStart.value !== '' &&
    yearEnd.value !== '' &&
    Number(yearStart.value) > Number(yearEnd.value)
  ) {
    return false
  }

  // 题型数量必须是非负整数
  for (const count of Object.values(typeCounts.value)) {
    if (!Number.isInteger(Number(count)) || Number(count) < 0) {
      return false
    }
  }

  if (lackTip.value.length > 0) return false

  return true
})

const draft = computed(() => {
  const paper = qStore.currentPaper
  return paper?.questions?.length && !paper.submitTime ? paper : null
})

const continueDraft = () => {
  if (draft.value) {
    router.push({ name: 'paper-detail', params: { id: draft.value.id } })
  }
}

// 生成试卷
const handleGenerate = () => {
  if (!canGenerate.value) {
    alert('请检查组卷条件和题量')
    return
  }

  const picked = []

  // 按题型随机抽题
  for (const type of Object.keys(typeCounts.value)) {
    const need = Number(typeCounts.value[type])

    if (need <= 0) continue

    const typePool = filterQuestions.value.filter((q) => q.type === type)

    // 随机打乱题目
    const shuffled = [...typePool]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    picked.push(...shuffled.slice(0, need))
  }

  // 检查实际抽取数量
  if (picked.length !== totalCount.value || picked.length === 0) {
    alert('实际抽取题目数量不足，请检查题库')
    return
  }

  // 计算试卷总分
  const totalScore = picked.reduce((sum, q) => sum + Number(q.score || 0), 0)

  if (draft.value && !window.confirm('还有一份未交卷的试卷。开始新试卷会替换原进度，确定继续？')) {
    return
  }

  // 统一保存到 currentPaper
  qStore.currentPaper = {
    id: Date.now(),
    createTime: new Date().toLocaleString(),
    questions: picked,
    userAnswer: {},
    course: course.value,
    paperName: `${course.value}知识点自测`,
    fullScore: totalScore,
    score: 0,
  }

  console.log('P07生成的试卷：', qStore.currentPaper)

  // 跳转到 P08 作答页面
  router
    .push({
      name: 'paper-detail',
      params: {
        id: qStore.currentPaper.id,
      },
    })
    .catch((error) => {
      console.error('跳转失败：', error)
    })
}

// 重置全部条件
const handleReset = () => {
  keyword.value = ''
  inheritedType.value = ''
  course.value = ''
  yearStart.value = ''
  yearEnd.value = ''
  knowledgePoints.value = []

  typeCounts.value = {
    单选: 0,
    多选: 0,
    判断: 0,
    主观: 0,
  }
}

// 查看题库
const goQuestionBank = () => {
  router.push({
    name: 'bank',
    query: {
      courseFilter: course.value,
      yearFilter:
        yearStart.value !== '' && Number(yearStart.value) === Number(yearEnd.value)
          ? yearStart.value
          : '',
      knowledgePointFilter: knowledgePoints.value.length === 1 ? knowledgePoints.value[0] : '',
      keyword: keyword.value,
      typeFilter: inheritedType.value,
    },
  })
}

// 从题库页面跳转回来时回填条件
onMounted(() => {
  const query = route.query
  course.value = String(query.courseFilter || query.course || '')
  if (query.yearFilter && hasKnownYears.value) {
    yearStart.value = Number(query.yearFilter)
    yearEnd.value = Number(query.yearFilter)
  }
  const requested = String(query.knowledgePointFilter || query.knowledgePoint || '').split(',')
  knowledgePoints.value = currentKnowledgeOptions.value
    .map((opt) => opt.value)
    .filter((v) => requested.includes(v))
  keyword.value = String(query.keyword || '')
  inheritedType.value = String(query.typeFilter || '')
})
</script>

<template>
  <div class="paper-page">
    <!-- 页面标题 -->
    <PageHeader
      eyebrow="P07 · F07"
      title="规则组卷"
      desc="先确认筛选条件与各题型数量，生成后计算本次试卷的实际总分。"
      art="paperArrange"
    />

    <!-- 主体左右布局 -->
    <section class="paper-layout">
      <!-- 左侧：组卷表单 -->
      <div class="paper-form">
        <!-- 课程 -->
        <div class="field">
          <label class="field__label">课程（必填）</label>

          <select v-model="course" class="custom-input">
            <option value="">请选择课程</option>

            <option v-for="opt in courseOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- 年份范围 -->
        <div class="field">
          <label class="field__label">年份范围（可选）</label>

          <div class="year-row">
            <input
              v-model.number="yearStart"
              :disabled="!!course && !hasKnownYears"
              type="number"
              placeholder="起始年份，不限"
              class="custom-input"
            />

            <span class="year-separator">至</span>

            <input
              v-model.number="yearEnd"
              :disabled="!!course && !hasKnownYears"
              type="number"
              placeholder="结束年份，不限"
              class="custom-input"
            />
          </div>

          <p v-if="course && !hasKnownYears" class="tip">该课程题库未注明年份，按不限年份组卷。</p>
          <p v-if="yearStart && yearEnd && Number(yearStart) > Number(yearEnd)" class="error-text">
            起始年份不能大于结束年份
          </p>
        </div>

        <!-- 知识点 -->
        <div class="field">
          <label class="field__label">知识点（多选，可选）</label>

          <div v-if="currentKnowledgeOptions.length === 0" class="tip">请先选择课程</div>

          <div v-else class="knowledge-group">
            <label v-for="opt in currentKnowledgeOptions" :key="opt.value" class="knowledge-item">
              <input v-model="knowledgePoints" type="checkbox" :value="opt.value" />

              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>

        <div v-if="keyword || inheritedType" class="field">
          <p class="tip">
            来自题库的条件：{{ keyword || '不限关键词' }} / {{ inheritedType || '不限题型' }}
          </p>
          <button class="btn" @click="clearExtraFilters">清除附加条件</button>
        </div>

        <!-- 各题型数量 -->
        <div class="field">
          <label class="field__label">各题型数量（非负整数）</label>

          <div class="count-grid">
            <div v-for="type in ['单选', '多选', '判断', '主观']" :key="type" class="count-item">
              <label>{{ type }}</label>

              <input
                v-model.number="typeCounts[type]"
                type="number"
                min="0"
                step="1"
                class="custom-input"
              />
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="lackTip.length" class="error-box">
          <strong>题量不足，请调整：</strong>

          <p v-for="msg in lackTip" :key="msg">
            {{ msg }}
          </p>
        </div>

        <!-- 底部按钮 -->
        <div class="action-row">
          <button v-if="draft" class="btn" type="button" @click="continueDraft">
            继续作答
          </button>
          <button class="btn primary" :disabled="!canGenerate" @click="handleGenerate">
            生成并开始
          </button>

          <button class="btn" @click="handleReset">重置</button>

          <button class="btn" @click="goQuestionBank">查看题库</button>
        </div>
      </div>

      <!-- 右侧：统计摘要 -->
      <aside class="paper-sidebar">
        <!-- 组卷摘要 -->
        <div class="summary-card">
          <h3>组卷摘要</h3>

          <p>
            题目数量
            <strong>{{ totalCount }}</strong>
            道
          </p>

          <div class="summary-divider"></div>

          <p class="summary-score">
            卷面总分：
            <span>生成后计算</span>
          </p>
        </div>

        <!-- 可用题量 -->
        <div class="summary-card">
          <h3>符合条件的题量</h3>

          <div class="available-list">
            <div v-for="item in typeSummary" :key="item.name" class="available-item">
              <span>{{ item.name }}</span>
              <strong>{{ item.count }}</strong>
            </div>
          </div>

          <div class="summary-divider"></div>

          <p class="available-total">可用题目共 {{ availableTotal }} 道</p>
        </div>

        <!-- 生成提示 -->
        <div class="sidebar-tip">
          <span class="tip-dot"></span>
          题量不足时，请调整对应题型数量，其他筛选条件会保留。
        </div>
      </aside>
    </section>
  </div>
</template>

<style scoped>
/* 页面整体 */
.paper-page {
  width: 100%;
  min-height: 620px;
  padding: 26px 30px 40px;
  box-sizing: border-box;
  background: #fff8ee;
  border: 1px solid #eee5d8;
  border-radius: 14px;
  color: #282920;
}

/* 主体左右分栏 */
.paper-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(230px, 1fr);
  gap: 28px;
  margin-top: 22px;
}

/* 左侧表单 */
.paper-form {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 23px;
}

/* 表单项目 */
.field {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
}

.field__label {
  font-size: 14px;
  color: #56634e;
  font-weight: 500;
}

/* 统一输入框 */
.custom-input {
  width: 100%;
  height: 39px;
  padding: 0 12px;
  border: 1px solid #b9c8b1;
  border-radius: 12px;
  background: #fff;
  color: #30352c;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
}

.custom-input:focus {
  border-color: #668052;
  box-shadow: 0 0 0 2px rgba(102, 128, 82, 0.1);
}

.custom-input::placeholder {
  color: #999f93;
}

/* 年份 */
.year-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.year-row input {
  flex: 1;
  min-width: 0;
}

.year-separator {
  color: #68745e;
  font-size: 14px;
}

/* 知识点 */
.knowledge-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.knowledge-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border: 1px solid #bdcbb5;
  border-radius: 20px;
  background: #fff;
  color: #506447;
  font-size: 13px;
  cursor: pointer;
}

.knowledge-item input {
  accent-color: #668052;
}

/* 题型数量 */
.count-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.count-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.count-item label {
  font-size: 14px;
  color: #43513c;
}

.count-item input {
  text-align: center;
}

/* 右侧 */
.paper-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 摘要卡片 */
.summary-card {
  padding: 17px 18px;
  background: #fff;
  border: 1px solid #bdcbb5;
  border-radius: 13px;
}

.summary-card h3 {
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 600;
  color: #292c25;
}

.summary-card p {
  margin: 8px 0;
  font-size: 14px;
  color: #596651;
}

.summary-card strong {
  color: #34452c;
  font-size: 17px;
}

.summary-divider {
  height: 1px;
  background: #edf0e9;
  margin: 13px 0;
}

.summary-score span {
  color: #64735b;
}

/* 可用题量 */
.available-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.available-item {
  display: flex;
  justify-content: space-between;
  padding: 9px 11px;
  border-radius: 9px;
  background: #f4f7f0;
  color: #526648;
  font-size: 13px;
}

.available-item strong {
  font-size: 14px;
}

.available-total {
  color: #526b3f !important;
  font-weight: 600;
}

/* 右侧说明 */
.sidebar-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 4px;
  color: #68745e;
  font-size: 13px;
  line-height: 1.7;
}

.tip-dot {
  width: 7px;
  height: 7px;
  margin-top: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #e94719;
}

/* 操作按钮 */
.action-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.btn {
  min-height: 36px;
  padding: 7px 17px;
  border: 1px solid #bdcbb5;
  border-radius: 20px;
  background: #fff;
  color: #43523c;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  background: #edf3e9;
}

.btn.primary {
  background: #eb3d12;
  border-color: #eb3d12;
  color: #fff;
}

.btn.primary:hover {
  background: #d8320c;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 错误提示 */
.error-text {
  margin: 0;
  color: #c94b37;
  font-size: 13px;
}

.error-box {
  padding: 12px 15px;
  border: 1px solid #edc3b8;
  border-radius: 10px;
  background: #fff5f1;
  color: #b84c36;
  font-size: 13px;
}

.error-box p {
  margin: 5px 0 0;
}

.tip {
  color: #8b9285;
  font-size: 14px;
}

/* 手机适配 */
@media (max-width: 768px) {
  .paper-page {
    min-height: 100%;
    padding: 16px 13px 90px;
    border: none;
    border-radius: 0;
  }

  .paper-layout {
    grid-template-columns: 1fr;
    gap: 22px;
    margin-top: 18px;
  }

  .paper-form {
    gap: 20px;
  }

  .year-row {
    gap: 7px;
  }

  .year-row input {
    width: 0;
  }

  .count-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .paper-sidebar {
    gap: 12px;
  }

  .summary-card {
    padding: 15px;
  }

  .action-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .action-row .btn.primary {
    grid-column: 1 / -1;
  }

  .action-row .btn {
    width: 100%;
  }
}
</style>
