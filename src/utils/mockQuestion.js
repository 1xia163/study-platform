// 各课程题库统一入口
import { discreteMathQuestions } from './questionBank/discreteMath.js'
import { dataStructureQuestions } from './questionBank/dataStructure.js'
import { chineseQuestions } from './questionBank/chinese.js'

export const questionList = [
  ...discreteMathQuestions,
  ...dataStructureQuestions,
  ...chineseQuestions,
]
