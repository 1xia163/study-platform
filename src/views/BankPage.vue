<script setup>
import PageHeader from '@/components/PageHeader.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestionStore } from '@/stores/question'
import QuestionImages from '@/components/QuestionImages.vue'

const qStore = useQuestionStore()
const route = useRoute()
const router = useRouter()

// 题目详情弹窗
const detailVisible = ref(false)
const currentQ = ref(null)

// 控制答案与解析的展开
const showAnswer = ref(false)

// 动态获取所有课程
const courseOptions = computed(() => {
  return [...new Set(qStore.questionList.map((q) => q.course).filter(Boolean))]
})

// 根据当前课程获取题目
const courseQuestions = computed(() => {
  if (!qStore.courseFilter) {
    return qStore.questionList
  }

  return qStore.questionList.filter((q) => q.course === qStore.courseFilter)
})

// 动态获取题型
const typeOptions = computed(() => {
  return [...new Set(courseQuestions.value.map((q) => q.type).filter(Boolean))]
})

// 动态获取年份
const yearOptions = computed(() => {
  return [
    ...new Set(
      courseQuestions.value
        .flatMap((q) => q.years || [q.year])
        .filter((year) => Number.isInteger(year))
    ),
  ].sort((a, b) => b - a)
})

// 动态获取知识点
const knowledgePointOptions = computed(() => {
  return [...new Set(courseQuestions.value.map((q) => q.knowledgePoint).filter(Boolean))]
})

// 是否存在筛选条件
const hasFilter = computed(() => {
  return (
    qStore.keyword ||
    qStore.courseFilter ||
    qStore.typeFilter ||
    qStore.yearFilter ||
    qStore.knowledgePointFilter
  )
})

// 切换课程时清除不匹配的筛选条件
watch(
  () => qStore.courseFilter,
  () => {
    if (!typeOptions.value.includes(qStore.typeFilter)) {
      qStore.typeFilter = ''
    }

    if (!yearOptions.value.includes(Number(qStore.yearFilter))) {
      qStore.yearFilter = ''
    }

    if (!knowledgePointOptions.value.includes(qStore.knowledgePointFilter)) {
      qStore.knowledgePointFilter = ''
    }
  }
)

// 筛选条件发生变化时重新搜索
watch(
  () => [
    qStore.keyword,
    qStore.courseFilter,
    qStore.typeFilter,
    qStore.yearFilter,
    qStore.knowledgePointFilter,
  ],
  () => {
    qStore.page = 1
    qStore.search()
  }
)

// 页面初始化
onMounted(() => {
  qStore.page = 1
  qStore.setFilterFromQuery(route.query)
})

// 打开题目详情
const openDetail = (row) => {
  currentQ.value = row
  showAnswer.value = false
  detailVisible.value = true
}

// 当前总页数
const totalPages = computed(() => {
  return Math.ceil(qStore.total / qStore.pageSize)
})

// 重试加载
const reload = () => {
  qStore.error = ''
  qStore.search()
}

// 跳转到组卷页面
// 并将当前筛选条件一起带过去
const goCreatePaper = () => {
  router.push({
    name: 'paper-create',
    query: {
      keyword: qStore.keyword,
      courseFilter: qStore.courseFilter,
      typeFilter: qStore.typeFilter,
      yearFilter: qStore.yearFilter,
      knowledgePointFilter: qStore.knowledgePointFilter,
    },
  })
}
</script>

<template>
  <div class="bank-page">
    <!-- 页面标题 -->
    <PageHeader eyebrow="P06 · F06" title="真题题库" desc="按课程和知识点查找" art="真题卡片">
      <template #actions>
        <button class="btn primary" @click="goCreatePaper">按条件组卷</button>
      </template>
    </PageHeader>

    <!-- 筛选区域 -->
    <section class="filter-area">
      <!-- 第一行：搜索 -->
      <div class="search-row">
        <input
          v-model="qStore.keyword"
          type="text"
          placeholder="搜索题干关键词"
          class="filter-input search-input"
        />
      </div>

      <!-- 第二行：筛选 -->
      <div class="filter-grid">
        <!-- 动态课程筛选 -->
        <select v-model="qStore.courseFilter" class="filter-input">
          <option value="">课程：全部</option>

          <option v-for="course in courseOptions" :key="course" :value="course">
            {{ course }}
          </option>
        </select>

        <!-- 动态年份筛选 -->
        <select v-model="qStore.yearFilter" class="filter-input">
          <option value="">年份：不限</option>

          <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}年</option>
        </select>

        <!-- 动态题型筛选 -->
        <select v-model="qStore.typeFilter" class="filter-input">
          <option value="">题型：全部</option>

          <option v-for="type in typeOptions" :key="type" :value="type">
            {{ type }}
          </option>
        </select>

        <!-- 动态知识点筛选 -->
        <select v-model="qStore.knowledgePointFilter" class="filter-input">
          <option value="">知识点：全部</option>

          <option v-for="kp in knowledgePointOptions" :key="kp" :value="kp">
            {{ kp }}
          </option>
        </select>
      </div>

      <!-- 来源条件 -->
      <div
        v-if="
          (route.query.course || route.query.knowledgePoint) &&
          (qStore.courseFilter || qStore.knowledgePointFilter)
        "
        class="source-info"
      >
        <span>
          来自笔记：
          {{ qStore.courseFilter || '' }}
          /
          {{ qStore.knowledgePointFilter || '' }}
        </span>

        <button class="text-btn" @click="qStore.resetFilter()">清除来源条件</button>
      </div>

      <!-- 普通筛选条件 -->
      <div v-else-if="hasFilter" class="source-info">
        <span>当前符合条件的题目共 {{ qStore.total }} 道</span>

        <button class="text-btn" @click="qStore.resetFilter()">清除筛选</button>
      </div>
    </section>

    <!-- 加载状态 -->
    <div v-if="qStore.loading" class="question-list">
      <div v-for="i in 3" :key="i" class="question-card skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="qStore.error" class="empty-state">
      <p>{{ qStore.error }}</p>

      <button class="btn primary" @click="reload">重新加载</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="qStore.total === 0" class="empty-state">
      <p>暂时没有找到符合条件的题目</p>

      <p class="muted">试试调整搜索关键词或筛选条件吧</p>

      <button class="btn" @click="qStore.resetFilter()">清除筛选</button>
    </div>

    <!-- 题目列表 -->
    <div v-else class="question-list">
      <article v-for="row in qStore.pageData" :key="row.id" class="question-card">
        <!-- 题干 -->
        <div class="question-title">
          <span class="type-label">{{ row.type }}题：</span>

          {{ row.title }}
        </div>

        <!-- 题目信息 -->
        <div class="question-meta">
          {{ row.year ? `${row.year}年` : '年份未注明' }}

          <span>/</span>

          {{ row.course }}

          <span>/</span>

          {{ row.knowledgePoint }}

          <span>/</span>

          {{ row.score }}分
        </div>

        <!-- 查看题目 -->
        <button class="btn outline small" @click="openDetail(row)">查看题目</button>
      </article>
    </div>

    <!-- 分页 -->
    <div v-if="!qStore.loading && !qStore.error && qStore.total > 0" class="pagination">
      <button
        class="page-btn"
        :disabled="qStore.page <= 1"
        @click="qStore.setPage(qStore.page - 1)"
      >
        上一页
      </button>

      <span class="page-info">第 {{ qStore.page }} / {{ totalPages }} 页</span>

      <button
        class="page-btn"
        :disabled="qStore.page >= totalPages"
        @click="qStore.setPage(qStore.page + 1)"
      >
        下一页
      </button>
    </div>

    <!-- 题目详情弹窗 -->
    <div v-if="detailVisible" class="dialog-mask" @click.self="detailVisible = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3>题目详情</h3>

          <button class="close-btn" aria-label="关闭弹窗" @click="detailVisible = false">×</button>
        </div>

        <div v-if="currentQ" class="dialog-body">
          <!-- 题目信息 -->
          <div class="question-meta">
            {{ currentQ.year ? `${currentQ.year}年` : '年份未注明' }}
            /
            {{ currentQ.course }}
            /
            {{ currentQ.knowledgePoint }}
            /
            {{ currentQ.score }}分
          </div>

          <!-- 题干 -->
          <p class="detail-title">
            {{ currentQ.title }}
          </p>
          <QuestionImages :images="currentQ?.images || []" />

          <!-- 题目选项 -->
          <div v-if="currentQ.options?.length" class="options-list">
            <div v-for="(opt, index) in currentQ.options" :key="index" class="option-item">
              {{
                ['单选', '多选'].includes(currentQ.type) && !/^[A-Z][.．、:：\s]/.test(opt)
                  ? String.fromCharCode(65 + index) + '. '
                  : ''
              }}{{ opt }}
            </div>
          </div>

          <!-- 查看答案与解析 -->
          <button class="collapse-btn" @click="showAnswer = !showAnswer">
            {{ showAnswer ? '收起答案与解析' : '查看答案与解析' }}
          </button>

          <div v-if="showAnswer" class="collapse-content">
            <p>
              <strong>参考答案：</strong>

              {{ Array.isArray(currentQ.answer) ? currentQ.answer.join('、') : currentQ.answer }}
            </p>

            <p>
              <strong>解析：</strong>

              {{ currentQ.explanation || '暂无解析' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面整体 */
.bank-page {
  width: 100%;
  min-height: 100%;
  padding: 24px 28px;
  background: #fff8ee;
  border: 1px solid #e9e4d9;
  border-radius: 14px;
  box-sizing: border-box;
  color: #24251f;
}

/* 筛选区域 */
.filter-area {
  margin-top: 20px;
  margin-bottom: 20px;
}

/* 搜索框 */
.search-row {
  display: flex;
  width: 55%;
  margin-bottom: 12px;
}

.filter-input {
  width: 100%;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #b8c5ae;
  border-radius: 13px;
  background: #fff;
  color: #333;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.filter-input:focus {
  border-color: #597347;
  box-shadow: 0 0 0 2px rgba(89, 115, 71, 0.1);
}

.filter-input::placeholder {
  color: #687263;
}

/* 四个筛选框 */
.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

/* 来源条件 */
.source-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
  color: #526b3f;
  font-size: 14px;
}

.text-btn {
  border: none;
  background: transparent;
  color: #526b3f;
  cursor: pointer;
  padding: 3px 0;
}

.text-btn:hover {
  text-decoration: underline;
}

/* 题目列表 */
.question-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 单个题目卡片 */
.question-card {
  min-height: 105px;
  padding: 13px 15px;
  background: #fff;
  border: 1px solid #b9c7b1;
  border-radius: 13px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.question-card:hover {
  box-shadow: 0 4px 14px rgba(70, 90, 55, 0.08);
  transform: translateY(-1px);
}

/* 题干 */
.question-title {
  font-size: 16px;
  line-height: 1.6;
  font-weight: 500;
  color: #25251f;
  word-break: break-word;
}

.type-label {
  font-weight: 600;
}

/* 题目元信息 */
.question-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
  font-size: 13px;
  color: #5c6858;
}

.question-meta span {
  color: #9aa494;
}

/* 按钮 */
.btn {
  padding: 7px 15px;
  border: 1px solid #b9c8b1;
  border-radius: 20px;
  background: #fff;
  color: #33412e;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #edf3e9;
}

.btn.primary {
  background: #e93d12;
  border-color: #e93d12;
  color: #fff;
}

.btn.primary:hover {
  background: #cf310d;
}

.btn.outline {
  padding: 3px 12px;
  font-size: 13px;
  border-radius: 18px;
}

.btn.small {
  margin-top: 16px;
}

/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
  padding-bottom: 12px;
}

.page-btn {
  border: none;
  background: transparent;
  color: #526b3f;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 0;
}

.page-btn:hover:not(:disabled) {
  color: #e7471c;
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-info {
  color: #526b3f;
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #526b3f;
  text-align: center;
}

.muted {
  color: #8a9183;
  font-size: 13px;
}

/* 加载骨架 */
.skeleton {
  justify-content: center;
  gap: 15px;
}

.skeleton-line {
  width: 75%;
  height: 14px;
  border-radius: 8px;
  background: #edf0e8;
}

.skeleton-line.short {
  width: 35%;
}

/* 题目详情弹窗 */
.dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(35, 42, 30, 0.4);
}

.dialog {
  width: min(600px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  background: #fffdf9;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 22px;
  border-bottom: 1px solid #e9eee5;
}

.dialog-header h3 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 26px;
  cursor: pointer;
  color: #687263;
}

.dialog-body {
  padding: 22px;
}

.detail-title {
  font-size: 17px;
  line-height: 1.8;
  font-weight: 600;
  margin: 16px 0;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
}

.option-item {
  padding: 10px 13px;
  border-radius: 9px;
  background: #f5f7f1;
  font-size: 14px;
}

.collapse-btn {
  width: 100%;
  padding: 11px;
  margin-top: 12px;
  border: 1px solid #bdcbb5;
  border-radius: 9px;
  background: #f3f6ef;
  color: #526b3f;
  cursor: pointer;
}

.collapse-content {
  margin-top: 12px;
  padding: 15px;
  border-radius: 9px;
  background: #f8f5ed;
  line-height: 1.8;
  font-size: 14px;
}

/* 手机适配 */
@media (max-width: 768px) {
  .bank-page {
    padding: 16px 12px 90px;
    border-radius: 0;
    border: none;
  }

  .filter-area {
    margin-top: 16px;
  }

  .search-row {
    width: 100%;
  }

  .filter-grid {
    grid-template-columns: 1fr;
    gap: 9px;
  }

  .filter-input {
    height: 39px;
  }

  .question-list {
    gap: 14px;
  }

  .question-card {
    min-height: 148px;
    padding: 14px;
  }

  .question-title {
    font-size: 16px;
  }

  .question-meta {
    font-size: 13px;
  }

  .pagination {
    justify-content: center;
    gap: 18px;
    margin-top: 24px;
  }

  .dialog {
    width: 100%;
  }
}
</style>
