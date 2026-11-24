import { defineStore } from 'pinia'
import { questionList } from '@/utils/mockQuestion'

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
      let score = 0
      paper.questions.forEach((q) => {
        const userAns = paper.userAnswer[q.id]
        let isRight = false
        // 判断答案是否正确
        if (Array.isArray(q.answer)) {
          if (Array.isArray(userAns) && userAns.sort().join() === q.answer.sort().join()) {
            isRight = true
            score += q.score
          }
        } else {
          if (userAns === q.answer) {
            isRight = true
            score += q.score
          }
        }
        // 答错就加入错题，重复错题更新
        if (!isRight && q.type !== '主观') {
          const wrongItem = {
            questionId: q.id,
            title: q.title,
            course: q.course,
            knowledgePoint: q.knowledgePoint,
            userAnswer: userAns,
            stdAnswer: q.answer,
            explanation: q.explanation,
            lastWrongTime: Date.now(),
            noteId: q.noteId ?? null,
          }
          const existIndex = this.wrongList.findIndex((w) => w.questionId === q.id)
          if (existIndex >= 0) {
            this.wrongList[existIndex] = wrongItem
          } else {
            this.wrongList.push(wrongItem)
          }
        }
      })
      paper.score = score
      this.recordList.unshift(paper)
    },
  },
})
