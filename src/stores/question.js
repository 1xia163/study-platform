import { defineStore } from 'pinia'
import { questionList } from '@/utils/mockQuestion'
import {
  gradePaper,
  objectiveAnswer,
  readPaperGrading,
  summarizeGrading,
} from '@/utils/paperGrading'

export const useQuestionStore = defineStore('question', {
  state: () => ({
    // 题库数据
    questionList: questionList,
    // 筛选条件
    keyword: '',
    courseFilter: '',
    typeFilter: '',
    yearFilter: '',
    knowledgePointFilter: '',

    // 分页
    page: 1,
    pageSize: 2,
    total: 0,
    pageData: [],

    // 状态
    loading: false,
    error: '',

    // 当前生成的试卷
    currentPaper: null,
    // 答题历史记录
    recordList: [],
    // 错题列表
    wrongList: [],
  }),
  persist: { pick: ['currentPaper', 'recordList', 'wrongList'] }, //持久化配置
  actions: {
    // 从路由query回填筛选条件（组卷页传参用）
    setFilterFromQuery(query = {}) {
      this.keyword = String(query.keyword || '')
      this.courseFilter = String(query.courseFilter || query.course || '')
      this.typeFilter = String(query.typeFilter || '')
      this.yearFilter = String(query.yearFilter || '')
      this.knowledgePointFilter = String(query.knowledgePointFilter || query.knowledgePoint || '')

      this.page = 1
      this.search()
    },
    // 重置全部筛选
    resetFilter() {
      this.keyword = ''
      this.courseFilter = ''
      this.typeFilter = ''
      this.yearFilter = ''
      this.knowledgePointFilter = ''
      this.page = 1
      this.search()
    },
    // 设置页码
    setPage(p) {
      this.page = p
      this.search()
    },
    // 核心筛选+分页逻辑
    search() {
      this.loading = true
      this.error = ''
      // 过滤
      let res = [...this.questionList]
      if (this.keyword) {
        res = res.filter((item) => item.title.includes(this.keyword))
      }
      if (this.yearFilter) {
        res = res.filter((item) => (item.years || [item.year]).includes(Number(this.yearFilter)))
      }
      if (this.typeFilter) {
        res = res.filter((item) => item.type === this.typeFilter)
      }
      if (this.yearFilter) {
        res = res.filter((item) => item.year === Number(this.yearFilter))
      }
      if (this.knowledgePointFilter) {
        res = res.filter((item) => item.knowledgePoint === this.knowledgePointFilter)
      }
      this.total = res.length
      // 分页切片
      const start = (this.page - 1) * this.pageSize
      const end = start + this.pageSize
      this.pageData = res.slice(start, end)
      this.loading = false
    },
    // 随机抽题组卷
    createPaper(rule) {
      // rule：{单选:2,多选:1,判断:1} 每种题型数量
      let pool = [...questionList]
      let paperQuestions = []
      for (const [type, count] of Object.entries(rule)) {
        const typeList = pool.filter((q) => q.type === type)
        // 随机取count个
        for (let i = 0; i < count && typeList.length > 0; i++) {
          const randomIdx = Math.floor(Math.random() * typeList.length)
          paperQuestions.push(typeList.splice(randomIdx, 1)[0])
        }
      }
      this.currentPaper = {
        id: Date.now(),
        createTime: new Date().toLocaleString(),
        questions: paperQuestions,
        userAnswer: {},
      }
    },
    // 提交试卷，保存记录+收集错题
    submitPaper() {
      const paper = this.currentPaper
      if (!paper?.questions?.length) return null

      const existing = this.recordList.find(
        (record) => String(record.id ?? record.paperId) === String(paper.id)
      )
      if (existing) return existing

      const course = paper.course || paper.questions[0]?.course || '未分类'
      const record = {
        ...paper,
        course,
        paperName: paper.paperName || `${course}知识点自测`,
        submitTime: Date.now(),
        userAnswer: Object.fromEntries(
          Object.entries(paper.userAnswer ?? {}).map(([id, answer]) => [
            id,
            Array.isArray(answer) ? [...answer] : answer,
          ])
        ),
        ...gradePaper(paper),
      }

      const wrongList = [...this.wrongList]
      for (const question of record.questions) {
        if (record.grading[question.id].status !== 'wrong') continue

        const item = {
          questionId: question.id,
          title: question.title,
          course: question.course,
          knowledgePoint: question.knowledgePoint,
          userAnswer: record.userAnswer[question.id] ?? null,
          stdAnswer: objectiveAnswer(question),
          explanation: question.explanation,
          lastWrongTime: record.submitTime,
          noteId: question.noteId ?? null,
          images: question.images || [],
        }

        const index = wrongList.findIndex((wrong) => wrong.questionId === question.id)
        if (index === -1) wrongList.push(item)
        else wrongList[index] = item
      }

      this.$patch({
        currentPaper: null,
        recordList: [record, ...this.recordList],
        wrongList,
      })
      return this.recordList[0]
    },

    saveReview(paperId, questionId, { score, comment = '', source = 'manual' }) {
      const record = this.recordList.find(
        (item) => String(item.id ?? item.paperId) === String(paperId)
      )
      if (!record || !['manual', 'ai'].includes(source)) return false

      const { grading } = readPaperGrading(record)
      if (!Object.hasOwn(grading, questionId)) return false

      const result = grading[questionId]
      if (
        !['pending', 'reviewed'].includes(result.status) ||
        !Number.isFinite(score) ||
        score < 0 ||
        score > result.maxScore
      ) {
        return false
      }

      const summary = summarizeGrading({
        ...grading,
        [questionId]: {
          ...result,
          status: 'reviewed',
          score,
          comment: String(comment).trim(),
          source,
          reviewedAt: Date.now(),
        },
      })

      this.$patch((state) => {
        Object.assign(record, summary)
        if (String(state.currentPaper?.id) === String(paperId)) {
          Object.assign(state.currentPaper, summary)
        }
      })

      return true
    },
  },
})
