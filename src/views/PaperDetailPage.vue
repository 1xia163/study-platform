<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useQuestionStore } from '@/stores/question'
import QuestionImages from '@/components/QuestionImages.vue'
import { hasReferenceAnswer, objectiveAnswer, readPaperGrading } from '@/utils/paperGrading'

const route = useRoute()
const router = useRouter()
const qStore = useQuestionStore()

const paperId = computed(() => route.params.id)

const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})
const subjectiveAnswers = ref({})
const isSubmitted = ref(false)
const showFilter = ref('all')
const submittedPaper = ref(null)
const reviewScoreInput = ref('')
const reviewComment = ref('')
const reviewError = ref('')

// 当前题目
const currentQuestion = computed(() => {
  return questions.value[currentIndex.value] || null
})

// 题目总数
const totalCount = computed(() => questions.value.length)

// 判断答案是否有效

const hasAnswer = (q, idx) => {
  if (q.type === '主观') {
    return String(subjectiveAnswers.value[idx] || '').trim() !== ''
  }

  const answer = answers.value[idx]

  if (q.type === '多选') {
    return Array.isArray(answer) && answer.length > 0
  }

  return answer !== undefined && answer !== null && answer !== ''
}

// 已答题数量
const answeredCount = computed(() => {
  return questions.value.filter((q, idx) => hasAnswer(q, idx)).length
})

// 未答题数量
const unansweredCount = computed(() => {
  return totalCount.value - answeredCount.value
})

const result = computed(() => {
  const record = qStore.recordList.find(
    (item) => String(item.id ?? item.paperId) === String(paperId.value)
  )
  const paper = record ?? submittedPaper.value
  return paper ? readPaperGrading(paper) : null
})

const objectiveScore = computed(() => result.value?.score ?? 0)
const objectiveMaxScore = computed(() => result.value?.fullScore ?? 0)
const wrongCount = computed(() => result.value?.wrongCount ?? 0)
const pendingCount = computed(() => result.value?.pendingCount ?? 0)
const gradeFor = (q) => result.value?.grading?.[q.id]
const currentGrade = computed(() => gradeFor(currentQuestion.value ?? {}))
const currentExpected = computed(() =>
  currentQuestion.value ? objectiveAnswer(currentQuestion.value) : null
)

const statusLabel = {
  correct: '正确',
  wrong: '错误',
  pending: '待评阅',
  reference: '参考答案自查',
  reviewed: '已评阅',
}

const feedbackTone = (status) =>
  status === 'correct' || status === 'wrong' ? status : 'subjective'

const getQuestionStatus = (q, idx) =>
  isSubmitted.value ? gradeFor(q)?.status : hasAnswer(q, idx) ? 'done' : 'empty'

const displayQuestions = computed(() =>
  questions.value
    .map((question, index) => ({
      question,
      index,
      status: gradeFor(question)?.status,
    }))
    .filter((item) => showFilter.value === 'all' || item.status === showFilter.value)
)

watch(currentGrade, (grade) => {
  reviewScoreInput.value = grade?.status === 'reviewed' ? grade.score : ''
  reviewComment.value = grade?.comment ?? ''
  reviewError.value = ''
})

const saveManualReview = () => {
  if (
    reviewScoreInput.value === '' ||
    !qStore.saveReview(paperId.value, currentQuestion.value.id, {
      score: Number(reviewScoreInput.value),
      comment: reviewComment.value,
    })
  ) {
    reviewError.value = '请输入题目分值范围内的有效分数'
    return
  }
  reviewError.value = ''
}

const optionClass = (value) => {
  if (!isSubmitted.value || currentExpected.value === null) return ''
  const expected = currentExpected.value
  const selected = answers.value[currentIndex.value]
  const correct = Array.isArray(expected) ? expected.includes(value) : expected === value
  const chosen = Array.isArray(selected) ? selected.includes(value) : selected === value
  if (correct) return 'option-correct'
  return chosen ? 'option-wrong' : ''
}

// 加载试卷
onMounted(() => {
  const reviewing = route.query.isReviewed === '1'
  const record = qStore.recordList.find((p) => String(p.id ?? p.paperId) === String(paperId.value))
  const paper = record ?? (reviewing ? null : qStore.currentPaper)

  if (!paper?.questions?.length || String(paper.id ?? paper.paperId) !== String(paperId.value)) {
    router.replace({ name: 'paper-create' })
    return
  }

  questions.value = paper.questions
  questions.value.forEach((q, idx) => {
    const saved = paper.userAnswer?.[q.id]
    if (q.type === '多选') {
      answers.value[idx] = Array.isArray(saved) ? [...saved] : []
    } else if (q.type === '主观') {
      subjectiveAnswers.value[idx] = saved ?? ''
    } else {
      answers.value[idx] = saved ?? ''
    }
  })

  if (record || paper.submitTime) {
    submittedPaper.value = paper
    isSubmitted.value = true
  } else if (Number.isInteger(paper.currentIndex)) {
    currentIndex.value = Math.min(Math.max(paper.currentIndex, 0), questions.value.length - 1)
  }
})

// 页面使用下标，Store 统一使用题目 ID
const collectAnswers = () => {
  return Object.fromEntries(
    questions.value.map((q, idx) => {
      const answer =
        q.type === '主观' ? (subjectiveAnswers.value[idx] ?? '') : (answers.value[idx] ?? null)
      return [q.id, Array.isArray(answer) ? [...answer] : answer]
    })
  )
}

// 保存未交卷试卷的作答和题号
watch(
  [answers, subjectiveAnswers, currentIndex],
  () => {
    const paper = qStore.currentPaper
    if (!isSubmitted.value && paper && String(paper.id) === String(paperId.value)) {
      qStore.$patch(() => {
        paper.userAnswer = collectAnswers()
        paper.currentIndex = currentIndex.value
      })
    }
  },
  { deep: true }
)

// 多选题始终以数组形式保存
const toggleMultiple = (letter, checked) => {
  if (isSubmitted.value) return
  const idx = currentIndex.value
  const selected = Array.isArray(answers.value[idx]) ? answers.value[idx] : []
  answers.value[idx] = checked
    ? [...new Set([...selected, letter])]
    : selected.filter((item) => item !== letter)
}

// 上一题
const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// 下一题
const nextQuestion = () => {
  if (currentIndex.value < totalCount.value - 1) {
    currentIndex.value++
  }
}

// 跳转到指定题目
const jumpToQuestion = (idx) => {
  currentIndex.value = idx
}

const handleSubmit = () => {
  if (isSubmitted.value) return
  const paper = qStore.currentPaper
  if (!paper || String(paper.id) !== String(paperId.value)) {
    alert('试卷不存在，请重新组卷')
    return
  }
  paper.userAnswer = collectAnswers()
  const record = qStore.submitPaper()
  if (!record) return

  submittedPaper.value = record
  isSubmitted.value = true
}

// 重新查看全部题目
const showAllQuestions = () => {
  showFilter.value = 'all'
  currentIndex.value = 0
}

// 结果页跳转
const goNote = () => router.push({ name: 'note-list' })
const goPlan = () => router.push({ name: 'plan' })
const goWrong = () => router.push({ name: 'record', query: { tab: 'wrong' } })
const backCreate = () => router.push({ name: 'paper-create' })

// 显示答案
const formatAnswer = (answer) => {
  if (answer === undefined || answer === null || answer === '') {
    return '未作答'
  }

  if (Array.isArray(answer)) {
    return answer.length ? answer.join('、') : '未作答'
  }

  if (answer === 'T') return '正确'
  if (answer === 'F') return '错误'

  return answer
}
</script>

<template>
  <div class="page answer-page">
    <!-- 页面标题 -->
    <PageHeader
      eyebrow="P08"
      title="作答与反馈"
      desc="作答完成后提交，查看得分与逐题解析"
      art="安静书写作答"
    />

    <section v-if="totalCount > 0" class="answer-layout">
      <!-- 左侧答题卡 -->
      <aside class="answer-sidebar">
        <div class="side-card">
          <h3>答题卡</h3>

          <p class="side-tip">点击题号可以切换题目</p>

          <div class="number-grid">
            <button
              v-for="(q, idx) in questions"
              :key="q.id ?? idx"
              type="button"
              :class="['num-btn', getQuestionStatus(q, idx), { active: currentIndex === idx }]"
              @click="jumpToQuestion(idx)"
            >
              {{ idx + 1 }}
            </button>
          </div>

          <div class="side-divider"></div>

          <div class="answer-stat">
            <span>已答</span>
            <strong>{{ answeredCount }} / {{ totalCount }}</strong>
          </div>

          <div class="answer-stat">
            <span>未答</span>
            <strong>{{ unansweredCount }}</strong>
          </div>

          <div v-if="!isSubmitted" class="status-legend">
            <div>
              <i class="legend-dot done-dot"></i>
              已答
            </div>
            <div>
              <i class="legend-dot empty-dot"></i>
              未答
            </div>
            <div>
              <i class="legend-dot active-dot"></i>
              当前题
            </div>
          </div>

          <div v-else class="status-legend">
            <div>
              <i class="legend-dot correct-dot"></i>
              正确
            </div>
            <div>
              <i class="legend-dot wrong-dot"></i>
              错误
            </div>
            <div>
              <i class="legend-dot empty-dot"></i>
              未答
            </div>
          </div>
        </div>

        <!-- 成绩摘要 -->
        <div v-if="isSubmitted" class="side-card score-card">
          <h3>本次成绩</h3>

          <div v-if="objectiveMaxScore > 0" class="score-number">
            {{ objectiveScore }}
            <small>/ {{ objectiveMaxScore }} 分</small>
          </div>
          <p v-if="objectiveMaxScore > 0">自动得分</p>
          <p v-else>本卷无可自动判分的题目</p>
          <p>待评阅 {{ pendingCount }} 题</p>

          <div class="score-detail">
            <span>客观题错题</span>
            <strong>{{ wrongCount }} 道</strong>
          </div>
        </div>
      </aside>

      <!-- 右侧答题主体 -->
      <main class="answer-main">
        <!-- 顶部信息 -->
        <div class="question-top">
          <div>
            <h2>作答与反馈</h2>
            <p>请认真阅读题目，选择或填写你的答案</p>
          </div>

          <div class="progress-info">
            <span>第 {{ currentIndex + 1 }} / {{ totalCount }} 题</span>
            <div class="progress-track">
              <div
                class="progress-value"
                :style="{ width: `${((currentIndex + 1) / totalCount) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 当前题目 -->
        <div v-if="currentQuestion" class="question-card">
          <div class="question-meta">
            <span class="question-index">第 {{ currentIndex + 1 }} 题</span>

            <span class="question-type">{{ currentQuestion.type }}题</span>

            <span class="question-score">{{ currentQuestion.score }} 分</span>
            <span
              v-if="isSubmitted && currentGrade"
              :class="['result-label', `result-${feedbackTone(currentGrade.status)}`]"
            >
              {{ statusLabel[currentGrade.status] }}
            </span>
          </div>

          <h3 class="question-title">
            {{ currentQuestion.title }}
          </h3>
          <QuestionImages :images="currentQuestion?.images || []" />

          <!-- 单选题 -->
          <div v-if="currentQuestion.type === '单选'" class="option-list">
            <label
              v-for="(opt, oi) in currentQuestion.options"
              :key="oi"
              :class="[
                'option-item',
                {
                  selected: answers[currentIndex] === String.fromCharCode(65 + oi),
                },
                // 单选、多选各使用这一项
                optionClass(String.fromCharCode(65 + oi)),
              ]"
            >
              <input
                v-model="answers[currentIndex]"
                type="radio"
                :value="String.fromCharCode(65 + oi)"
                :disabled="isSubmitted"
              />

              <span class="option-letter">
                {{ String.fromCharCode(65 + oi) }}
              </span>

              <span class="option-text">{{ opt }}</span>
            </label>
          </div>

          <!-- 多选题 -->
          <div v-else-if="currentQuestion.type === '多选'" class="option-list">
            <label
              v-for="(opt, oi) in currentQuestion.options"
              :key="oi"
              :class="[
                'option-item',
                {
                  selected:
                    Array.isArray(answers[currentIndex]) &&
                    answers[currentIndex].includes(String.fromCharCode(65 + oi)),
                },
                optionClass(String.fromCharCode(65 + oi)),
              ]"
            >
              <input
                type="checkbox"
                :value="String.fromCharCode(65 + oi)"
                :checked="
                  Array.isArray(answers[currentIndex]) &&
                  answers[currentIndex].includes(String.fromCharCode(65 + oi))
                "
                :disabled="isSubmitted"
                @change="toggleMultiple(String.fromCharCode(65 + oi), $event.target.checked)"
              />

              <span class="option-letter">
                {{ String.fromCharCode(65 + oi) }}
              </span>

              <span class="option-text">{{ opt }}</span>
            </label>
          </div>

          <!-- 判断题 -->
          <div v-else-if="currentQuestion.type === '判断'" class="option-list">
            <label
              v-for="opt in [
                { label: '正确', value: 'T' },
                { label: '错误', value: 'F' },
              ]"
              :key="opt.value"
              :class="[
                'option-item',
                { selected: answers[currentIndex] === opt.value },
                optionClass(opt.value),
              ]"
            >
              <input
                v-model="answers[currentIndex]"
                type="radio"
                :value="opt.value"
                :disabled="isSubmitted"
              />

              <span class="option-text">{{ opt.label }}</span>
            </label>
          </div>

          <!-- 主观题 -->
          <div v-else-if="currentQuestion.type === '主观'" class="subjective-area">
            <textarea
              v-model="subjectiveAnswers[currentIndex]"
              rows="6"
              :disabled="isSubmitted"
              placeholder="请在这里填写你的答案……"
            ></textarea>

            <p class="input-tip">
              {{
                hasReferenceAnswer(currentQuestion.answer)
                  ? '提交后可根据参考答案自行核对'
                  : '暂无参考答案，提交后保留作答，可录入评阅结果'
              }}
            </p>
          </div>

          <!-- 提交后显示解析 -->
          <div v-if="isSubmitted" class="result-box">
            <div class="result-row">
              <strong>你的答案</strong>
              <span>
                {{
                  formatAnswer(
                    currentQuestion.type === '主观'
                      ? subjectiveAnswers[currentIndex]
                      : answers[currentIndex]
                  )
                }}
              </span>
            </div>

            <div class="result-row">
              <strong>参考答案</strong>
              <span v-if="currentQuestion.type === '主观'">
                {{
                  hasReferenceAnswer(currentQuestion.answer)
                    ? formatAnswer(currentQuestion.answer)
                    : '暂无参考答案'
                }}
              </span>
              <span v-else>
                {{ currentExpected === null ? '暂无参考答案' : formatAnswer(currentExpected) }}
              </span>
            </div>

            <form
              v-if="['pending', 'reviewed'].includes(currentGrade?.status)"
              @submit.prevent="saveManualReview"
            >
              <p v-if="currentGrade.status === 'reviewed'">
                已评阅 {{ currentGrade.score }} / {{ currentGrade.maxScore }} 分
              </p>

              <label>
                评阅分数
                <input
                  v-model.number="reviewScoreInput"
                  type="number"
                  min="0"
                  :max="currentGrade.maxScore"
                  step="any"
                  required
                />
              </label>

              <label>
                评语
                <textarea v-model="reviewComment" rows="3"></textarea>
              </label>

              <button class="action-btn secondary" type="submit">保存评阅</button>
              <p v-if="reviewError" role="alert">{{ reviewError }}</p>
            </form>

            <div class="result-explanation">
              <strong>答案解析</strong>
              <p>{{ currentQuestion.explanation || '暂无解析' }}</p>
            </div>
          </div>

          <!-- 题目操作 -->
          <div class="question-actions">
            <button
              class="action-btn secondary"
              :disabled="currentIndex === 0"
              @click="prevQuestion"
            >
              上一题
            </button>

            <button v-if="!isSubmitted" class="action-btn primary" @click="handleSubmit">
              提交作答
            </button>

            <button v-else class="action-btn primary" @click="showAllQuestions">
              查看全部题目
            </button>

            <button
              class="action-btn secondary"
              :disabled="currentIndex >= totalCount - 1"
              @click="nextQuestion"
            >
              下一题
            </button>
          </div>
        </div>

        <!-- 提交后结果筛选 -->
        <div v-if="isSubmitted" class="result-footer">
          <div class="result-footer-title">
            <h3>答题结果</h3>
            <p>
              客观题得分 {{ objectiveScore }} / {{ objectiveMaxScore }} 分， 共
              {{ wrongCount }} 道客观题答错或未答
            </p>
          </div>

          <div class="filter-buttons">
            <button :class="{ active: showFilter === 'all' }" @click="showFilter = 'all'">
              全部题目
            </button>

            <button :class="{ active: showFilter === 'wrong' }" @click="showFilter = 'wrong'">
              查看错题
            </button>
          </div>

          <div class="filter-list">
            <button
              v-for="item in displayQuestions"
              :key="item.index"
              class="filter-item"
              @click="jumpToQuestion(item.index)"
            >
              <span>
                第 {{ item.index + 1 }} 题：
                {{ item.question.title }}
              </span>

              <span :class="['filter-status', `status-${feedbackTone(item.status)}`]">
                {{ statusLabel[item.status] }}
              </span>
            </button>
          </div>

          <div class="result-actions">
            <button class="action-btn secondary" @click="goNote">相关笔记</button>

            <button class="action-btn secondary" @click="goPlan">创建复习任务</button>

            <button class="action-btn secondary" @click="goWrong">查看错题</button>

            <button class="action-btn primary" @click="backCreate">返回组卷</button>
          </div>
        </div>

        <!-- 提交前提示 -->
        <div v-else class="bottom-tip">
          <strong>提交确认</strong>
          <span>提交后将显示答题结果、正确答案和逐题解析。</span>
        </div>
      </main>
    </section>

    <!-- 加载失败 -->
    <section v-else class="empty-card">
      <h3>暂时没有可作答的试卷</h3>
      <p>请返回组卷页面，重新生成试卷。</p>
      <button class="action-btn primary" @click="backCreate">返回组卷</button>
    </section>
  </div>
</template>

<style scoped>
/* 页面整体 */
.answer-page {
  width: 100%;
  min-height: 650px;
  padding-bottom: 40px;
  color: #292c25;
}

/* 左右布局 */
.answer-layout {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  margin-top: 22px;
}

/* 左侧 */
.answer-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-card {
  padding: 18px 16px;
  background: #fff;
  border: 1px solid #bdcbb5;
  border-radius: 13px;
}

.side-card h3 {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 600;
  color: #34452c;
}

.side-tip {
  margin: 0 0 14px;
  font-size: 12px;
  color: #879080;
}

/* 题号网格 */
.number-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}

.num-btn {
  height: 36px;
  border: 1px solid #bdcbb5;
  border-radius: 11px;
  background: #fff;
  color: #3d4936;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.num-btn:hover {
  background: #edf3e9;
}

.num-btn.active {
  border-color: #526d3e;
  background: #dcead7;
  color: #344d29;
  font-weight: 600;
}

.num-btn.done {
  background: #edf4e9;
}

.num-btn.wrong {
  background: #fff0eb;
  border-color: #e7a18e;
  color: #bd4b32;
}

.num-btn.correct {
  background: #e5f2df;
  border-color: #9dbb8d;
  color: #416535;
}

.side-divider {
  height: 1px;
  background: #edf0e9;
  margin: 17px 0;
}

.answer-stat {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 13px;
  color: #64705c;
}

.answer-stat strong {
  color: #405735;
}

.status-legend {
  display: grid;
  gap: 9px;
  margin-top: 17px;
  font-size: 12px;
  color: #697363;
}

.status-legend > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
}

.done-dot {
  background: #9bb58d;
}

.empty-dot {
  background: #fff;
  border: 1px solid #bdcbb5;
}

.active-dot {
  background: #526d3e;
}

.correct-dot {
  background: #79a66a;
}

.wrong-dot {
  background: #e27b62;
}

/* 成绩卡片 */
.score-card {
  background: #f1f6ed;
}

.score-number {
  margin-top: 14px;
  color: #47683b;
  font-size: 32px;
  font-weight: 700;
}

.score-number small {
  font-size: 13px;
  font-weight: 400;
}

.score-card p {
  margin: 5px 0 15px;
  font-size: 12px;
  color: #78836e;
}

.score-detail {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #dce6d5;
  font-size: 13px;
  color: #64705c;
}

/* 右侧主体 */
.answer-main {
  min-width: 0;
}

.question-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 17px;
}

.question-top h2 {
  margin: 0 0 7px;
  font-size: 23px;
  color: #292c25;
}

.question-top p {
  margin: 0;
  font-size: 13px;
  color: #75806d;
}

.progress-info {
  min-width: 130px;
  color: #526b3f;
  font-size: 13px;
  text-align: right;
}

.progress-track {
  height: 6px;
  margin-top: 8px;
  border-radius: 10px;
  background: #e7ecdf;
  overflow: hidden;
}

.progress-value {
  height: 100%;
  border-radius: 10px;
  background: #8da97c;
  transition: width 0.2s;
}

/* 题目卡片 */
.question-card {
  padding: 22px 21px;
  background: #fff;
  border: 1px solid #bdcbb5;
  border-radius: 13px;
  box-shadow: 0 3px 12px rgba(64, 75, 52, 0.04);
}

.question-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 17px;
}

.question-meta span {
  font-size: 13px;
}

.question-index {
  color: #526b3f;
  font-weight: 600;
}

.question-type {
  color: #64705c;
}

.question-score {
  color: #64705c;
}

.result-label {
  margin-left: auto;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px !important;
}

.result-correct {
  background: #e7f2e1;
  color: #4d773e;
}

.result-wrong {
  background: #fff0eb;
  color: #bd4b32;
}

.result-subjective {
  background: #f0f1ed;
  color: #697363;
}

.question-title {
  margin: 0 0 25px;
  font-size: 19px;
  line-height: 1.7;
  font-weight: 600;
  color: #292c25;
  overflow-wrap: anywhere;
}

/* 选项 */
.option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 43px;
  padding: 9px 12px;
  border: 1px solid #bdcbb5;
  border-radius: 11px;
  background: #fff;
  color: #4c5746;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.option-item:hover {
  background: #f5f8f2;
  border-color: #829b73;
}

.option-item.selected {
  background: #edf4e9;
  border-color: #789466;
}

.option-item input {
  width: 16px;
  height: 16px;
  accent-color: #607e4c;
  flex-shrink: 0;
}

.option-letter {
  color: #526b3f;
  font-weight: 600;
}

.option-text {
  line-height: 1.5;
}

.option-correct {
  background: #edf6e9 !important;
  border-color: #91b57e !important;
}

.option-wrong {
  background: #fff1ec !important;
  border-color: #e5a08e !important;
}

/* 主观题 */
.subjective-area textarea {
  width: 100%;
  min-height: 150px;
  box-sizing: border-box;
  padding: 13px;
  border: 1px solid #bdcbb5;
  border-radius: 11px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.7;
}

.subjective-area textarea:focus {
  border-color: #789466;
  box-shadow: 0 0 0 2px rgba(120, 148, 102, 0.1);
}

.subjective-area textarea:disabled {
  background: #f6f8f3;
}

.input-tip {
  margin: 8px 0 0;
  color: #899184;
  font-size: 12px;
}

/* 答案解析 */
.result-box {
  margin-top: 23px;
  padding: 16px;
  border-radius: 11px;
  background: #f5f8f2;
  border: 1px solid #e0e8d9;
}

.result-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.6;
}

.result-row strong,
.result-explanation strong {
  min-width: 65px;
  color: #526b3f;
}

.result-row span {
  color: #485442;
  overflow-wrap: anywhere;
}

.result-explanation {
  padding-top: 12px;
  border-top: 1px solid #dfe7d9;
  font-size: 13px;
  line-height: 1.7;
}

.result-explanation p {
  margin: 8px 0 0;
  color: #596451;
}

/* 操作按钮 */
.question-actions {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin-top: 25px;
}

.action-btn {
  min-height: 40px;
  padding: 8px 17px;
  border: 1px solid #bdcbb5;
  border-radius: 10px;
  background: #fff;
  color: #43523c;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.action-btn:hover {
  background: #edf3e9;
}

.action-btn.primary {
  background: #eb3d12;
  border-color: #eb3d12;
  color: #fff;
}

.action-btn.primary:hover {
  background: #d8320c;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.question-actions button:first-child {
  justify-self: start;
}

.question-actions button:last-child {
  justify-self: end;
}

/* 底部说明 */
.bottom-tip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
  padding: 10px 3px;
  color: #65705c;
  font-size: 13px;
}

.bottom-tip strong {
  color: #526b3f;
}

/* 提交后结果区域 */
.result-footer {
  margin-top: 20px;
  padding: 19px;
  background: #fff;
  border: 1px solid #bdcbb5;
  border-radius: 13px;
}

.result-footer-title h3 {
  margin: 0 0 7px;
  color: #34452c;
  font-size: 17px;
}

.result-footer-title p {
  margin: 0;
  color: #75806d;
  font-size: 13px;
  line-height: 1.6;
}

.filter-buttons {
  display: flex;
  gap: 9px;
  margin: 17px 0 12px;
}

.filter-buttons button {
  padding: 7px 14px;
  border: 1px solid #bdcbb5;
  border-radius: 18px;
  background: #fff;
  color: #526b3f;
  cursor: pointer;
}

.filter-buttons button.active {
  background: #e5efdf;
  border-color: #8ca47d;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #e5eade;
  border-radius: 9px;
  background: #fafbf8;
  color: #4d5847;
  text-align: left;
  cursor: pointer;
}

.filter-item:hover {
  background: #f0f5eb;
}

.filter-item > span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.filter-status {
  flex-shrink: 0;
  font-size: 12px;
}

.status-correct {
  color: #5d874d;
}

.status-wrong {
  color: #c64d35;
}

.status-subjective {
  color: #7b8375;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

/* 空状态 */
.empty-card {
  padding: 50px 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #bdcbb5;
  border-radius: 13px;
}

.empty-card h3 {
  color: #34452c;
}

.empty-card p {
  color: #75806d;
  font-size: 14px;
  margin-bottom: 20px;
}

/* 平板 */
@media (max-width: 900px) {
  .answer-layout {
    grid-template-columns: 160px minmax(0, 1fr);
    gap: 13px;
  }

  .side-card {
    padding: 14px 11px;
  }

  .question-card {
    padding: 17px 15px;
  }
}

/* 手机 */
@media (max-width: 650px) {
  .answer-page {
    padding-bottom: 25px;
  }

  .answer-layout {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 15px;
  }

  .answer-sidebar {
    width: 100%;
  }

  .side-card {
    padding: 13px;
  }

  .number-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 6px;
  }

  .num-btn {
    height: 34px;
    border-radius: 9px;
  }

  .status-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 13px;
  }

  .score-card {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .score-card h3 {
    grid-column: 1 / -1;
  }

  .score-number {
    margin: 0;
  }

  .score-card p {
    margin: 0;
  }

  .score-detail {
    grid-column: 1 / -1;
    margin-top: 10px;
  }

  .question-top {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .question-top h2 {
    font-size: 20px;
  }

  .progress-info {
    width: 100%;
    text-align: left;
  }

  .question-card {
    padding: 16px 13px;
  }

  .question-title {
    font-size: 17px;
    margin-bottom: 19px;
  }

  .option-item {
    min-height: 42px;
    padding: 9px 10px;
    font-size: 13px;
  }

  .question-actions {
    grid-template-columns: 1fr 1fr;
    gap: 9px;
  }

  .question-actions button:first-child {
    justify-self: stretch;
  }

  .question-actions button:last-child {
    justify-self: stretch;
  }

  .question-actions .primary {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
  }

  .result-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .result-actions button {
    width: 100%;
  }

  .filter-item {
    padding: 9px;
  }

  .filter-item > span:first-child {
    white-space: normal;
  }
}

@media (max-width: 380px) {
  .number-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .question-meta {
    gap: 7px;
  }

  .question-meta span {
    font-size: 12px;
  }
}
</style>
