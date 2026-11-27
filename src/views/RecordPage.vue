<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useQuestionStore } from '@/stores/question'
import QuestionImages from '@/components/QuestionImages.vue'
import { hasReferenceAnswer, readPaperGrading } from '@/utils/paperGrading'

const route = useRoute()
const router = useRouter()
const qStore = useQuestionStore()
const activeTab = ref(route.query.tab === 'wrong' ? 'wrong' : 'record')
const courseFilter = ref('')
const knowledgePointFilter = ref('')
const expanded = ref(null)
const more = ref(null)

// 读取 Pinia 中的真实记录，不依赖 currentPaper
const records = computed(() => qStore.recordList || [])
const wrong = computed(() =>
  (qStore.wrongList || []).filter((item) => hasReferenceAnswer(item.stdAnswer))
)
const course = (p) => p.course || p.questions?.[0]?.course || '未分类'
const id = (p) => p.id ?? p.paperId

// 课程与知识点筛选
const courseOptions = computed(() => [
  ...new Set([...records.value.map(course), ...wrong.value.map((w) => w.course)].filter(Boolean)),
])
const kpOptions = computed(() => [
  ...new Set(
    [...records.value.flatMap((p) => p.questions || []), ...wrong.value]
      .filter((q) => !courseFilter.value || q.course === courseFilter.value)
      .map((q) => q.knowledgePoint)
      .filter(Boolean)
  ),
])
watch(courseFilter, () => {
  knowledgePointFilter.value = ''
})
watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = tab === 'wrong' ? 'wrong' : 'record'
  }
)
const time = (p) => p.submitTime || p.createTime
const hasFilter = computed(() => Boolean(courseFilter.value || knowledgePointFilter.value))
const clearFilters = () => {
  courseFilter.value = ''
  knowledgePointFilter.value = ''
}
const retry = async () => {
  if (typeof qStore.loadRecords === 'function') {
    await qStore.loadRecords()
  } else {
    // 当前 Store 使用本地数组，没有独立的记录请求接口。
    qStore.error = ''
  }
}

// 筛选并排序练习记录
const filteredRecord = computed(() =>
  records.value
    .filter(
      (p) =>
        (!courseFilter.value || course(p) === courseFilter.value) &&
        (!knowledgePointFilter.value ||
          p.questions?.some((q) => q.knowledgePoint === knowledgePointFilter.value))
    )
    .sort((a, b) => new Date(time(b)) - new Date(time(a)))
)

// 筛选并排序错题
const filteredWrong = computed(() =>
  wrong.value
    .filter(
      (w) =>
        (!courseFilter.value || w.course === courseFilter.value) &&
        (!knowledgePointFilter.value || w.knowledgePoint === knowledgePointFilter.value)
    )
    .sort((a, b) => b.lastWrongTime - a.lastWrongTime)
)
const date = (t) => {
  const d = new Date(t)
  return Number.isNaN(d.getTime())
    ? '时间未知'
    : d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}
const summaries = computed(() =>
  Object.fromEntries(
    records.value.map((paper) => [
      id(paper),
      paper.grading || (paper.questions?.length && paper.userAnswer)
        ? readPaperGrading(paper)
        : {
            score: paper.score ?? 0,
            fullScore: paper.fullScore,
            pendingCount: paper.pendingCount,
          },
    ])
  )
)
const format = (a) =>
  Array.isArray(a)
    ? a.join('、') || '未作答'
    : a === 'T'
      ? '正确'
      : a === 'F'
        ? '错误'
        : a === '' || a == null
          ? '未作答'
          : a
// 回看历史试卷（P08 根据编号从 recordList 读取）
const review = (p) => {
  const paperId = id(p)
  if (paperId == null || !p.questions?.length) {
    alert('该记录缺少完整试卷，暂时无法回看')
    return
  }
  router.push({
    name: 'paper-detail',
    params: { id: paperId },
    query: { isReviewed: '1' },
  })
}
// 创建复习任务
const task = (w) => {
  router.push({
    name: 'plan',
    query: {
      course: w.course,
      knowledgePoint: w.knowledgePoint,
      title: `复习：${w.title}`,
    },
  })
}
</script>
<template>
  <div class="page record-page">
    <PageHeader
      eyebrow="P09 · F09"
      title="练习记录与错题"
      desc="回看练习，安排复习"
      art="放大镜与复盘"
    />
    <nav class="subnav">
      <button @click="router.push({ name: 'bank' })">题库</button>
      /
      <button @click="router.push({ name: 'paper-create' })">组卷</button>
      /
      <span>记录与错题</span>
    </nav>
    <div class="tabs">
      <button :class="{ active: activeTab === 'record' }" @click="activeTab = 'record'">
        练习记录
      </button>
      <button :class="{ active: activeTab === 'wrong' }" @click="activeTab = 'wrong'">
        错题回顾
      </button>
    </div>
    <div class="filters">
      <label>
        课程：
        <select v-model="courseFilter">
          <option value="">全部</option>
          <option v-for="c in courseOptions" :key="c">{{ c }}</option>
        </select>
      </label>
      <label>
        知识点：
        <select v-model="knowledgePointFilter">
          <option value="">全部</option>
          <option v-for="k in kpOptions" :key="k">{{ k }}</option>
        </select>
      </label>
    </div>
    <button v-if="hasFilter" class="clear-filter" type="button" @click="clearFilters">
      清除筛选
    </button>
    <section v-if="qStore.loading" class="items" aria-busy="true">
      <div v-for="n in 2" :key="n" class="entry skeleton">正在读取记录……</div>
    </section>
    <section v-else-if="qStore.error" class="entry empty" role="alert">
      <p>{{ qStore.error }}</p>
      <button type="button" @click="retry">重试</button>
    </section>
    <section v-else-if="activeTab === 'record'" class="items">
      <div v-if="!filteredRecord.length" class="entry empty">
        <p>{{ records.length ? '没有符合筛选条件的记录' : '暂无练习记录' }}</p>
        <button v-if="hasFilter" @click="clearFilters">清除筛选</button>
        <button v-else @click="router.push({ name: 'paper-create' })">去自测</button>
      </div>
      <article v-for="p in filteredRecord" :key="id(p)" class="entry">
        <h3>{{ p.paperName || `${course(p)}知识点自测` }}</h3>
        <p>{{ date(time(p)) }} / {{ p.questions?.length || 0 }} 题</p>

        <p v-if="summaries[id(p)].fullScore > 0">
          自动得分 {{ summaries[id(p)].score }} / {{ summaries[id(p)].fullScore }} 分
        </p>
        <p v-else-if="summaries[id(p)].grading">本卷无可自动判分的题目</p>
        <p v-else>已保存得分 {{ summaries[id(p)].score }} 分</p>

        <p v-if="summaries[id(p)].pendingCount > 0">
          待评阅 {{ summaries[id(p)].pendingCount }} 题
        </p>
        <p v-else-if="summaries[id(p)].reviewStatus === 'complete'">无待评阅题目</p>

        <p v-if="summaries[id(p)].reviewFullScore > 0">
          已评阅得分 {{ summaries[id(p)].reviewScore }} / {{ summaries[id(p)].reviewFullScore }} 分
        </p>
        <div class="actions">
          <button @click="review(p)">回看作答</button>
        </div>
      </article>
    </section>
    <section v-else class="items">
      <div v-if="!filteredWrong.length" class="entry empty">
        <p>{{ wrong.length ? '没有符合筛选条件的错题' : '暂无错题，继续加油' }}</p>
        <button v-if="hasFilter" @click="clearFilters">清除筛选</button>
        <button v-else @click="router.push({ name: 'bank' })">去学习</button>
      </div>
      <article v-for="w in filteredWrong" :key="w.questionId" class="entry">
        <h3>{{ w.title }}</h3>
        <p>{{ w.course }} / {{ w.knowledgePoint }}</p>
        <div class="actions">
          <button @click="expanded = expanded === w.questionId ? null : w.questionId">
            {{ expanded === w.questionId ? '收起解析' : '展开解析' }}
          </button>
          <button @click="more = more === w.questionId ? null : w.questionId">更多</button>
        </div>
        <QuestionImages :images="w.images || []" />
        <div v-if="expanded === w.questionId" class="explanation">
          <p>你的答案：{{ format(w.userAnswer) }}</p>
          <p>参考答案：{{ format(w.stdAnswer) }}</p>
          <p>解析：{{ w.explanation || '暂无解析' }}</p>
        </div>
        <div v-if="more === w.questionId" class="actions">
          <button
            :disabled="!w.noteId"
            @click="router.push({ name: 'note-edit', params: { id: w.noteId } })"
          >
            打开相关笔记
          </button>
          <button @click="task(w)">创建复习任务</button>
        </div>
      </article>
    </section>
    <p class="tip">
      {{
        activeTab === 'record'
          ? '切换到错题标签后替换列表；重复答错更新同一条错题及最近作答。'
          : '错题重复出现时更新最近一次作答。更多 → 打开相关笔记 / 创建复习任务'
      }}
    </p>
  </div>
</template>

<style scoped>
.record-page {
  width: 100%;
  color: #29342b;
  padding-bottom: 36px;
  box-sizing: border-box;
}

.subnav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  color: #526b3f;
  margin: 0 0 18px;
  font-size: 14px;
}

.subnav button {
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0;
}

.tabs,
.filters,
.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tabs {
  gap: 30px;
  margin: 18px 0;
}

.record-page button {
  cursor: pointer;
  font: inherit;
}

.tabs button,
.actions button,
.empty button {
  border: 1px solid #bdcbb5;
  background: #fff;
  color: #29342b;
  border-radius: 12px;
  padding: 5px 12px;
  font-size: 14px;
}

.tabs button.active {
  background: #eb3d12;
  border-color: #eb3d12;
  color: white;
}

.filters {
  margin-bottom: 18px;
}

.filters label {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #bdcbb5;
  border-radius: 10px;
  background: white;
  padding: 5px 10px;
  width: 240px;
  box-sizing: border-box;
  font-size: 14px;
  color: #586452;
}

.filters select {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}

.clear-filter {
  border: 0;
  background: transparent;
  color: #526b3f;
  margin: 0 0 12px;
  padding: 0;
  text-decoration: underline;
}
.skeleton {
  min-height: 70px;
  color: #78836e;
  background: #f5f8f2;
}
.items {
  display: grid;
  gap: 14px;
}

.entry {
  border: 1px solid #bdcbb5;
  border-radius: 12px;
  background: white;
  padding: 12px 16px;
  overflow-wrap: anywhere;
}

.entry h3 {
  font-size: 17px;
  font-weight: 500;
  margin: 0 0 5px;
}

.entry p {
  font-size: 13px;
  color: #596451;
  margin: 0;
  line-height: 1.7;
}

.actions {
  margin-top: 14px;
  gap: 8px;
}

.actions button {
  padding: 3px 10px;
}

.actions button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.explanation {
  margin-top: 12px;
  padding: 12px;
  background: #f5f8f2;
  border-radius: 8px;
}

.empty {
  text-align: center;
  padding: 36px 12px;
}

.empty button {
  margin-top: 12px;
}

.tip {
  margin: 40px 0 0;
  color: #596451;
  font-size: 14px;
  line-height: 1.7;
}

@media (max-width: 650px) {
  .subnav {
    display: none;
  }
  .tabs {
    gap: 0;
    justify-content: space-between;
    max-width: 260px;
  }
  .filters {
    flex-wrap: nowrap;
    gap: 10px;
  }
  .filters label {
    width: 50%;
    min-width: 0;
    padding: 7px;
  }
  .entry {
    padding: 14px;
  }
  .entry h3 {
    font-size: 16px;
  }
  .actions {
    margin-top: 24px;
  }
  .tip {
    margin-top: 28px;
  }
}
</style>
