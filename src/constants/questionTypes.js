/**
 * 题型枚举
 *
 * value 用于存储与判分分支，label 用于完整显示，short 用于列表与答题卡等空间紧张处。
 */
export const QUESTION_TYPES = [
  { value: 'single', label: '单选题', short: '单选' },
  { value: 'multiple', label: '多选题', short: '多选' },
  { value: 'judge', label: '判断题', short: '判断' },
  { value: 'subjective', label: '主观题', short: '主观' },
]

export const QUESTION_TYPE_VALUES = QUESTION_TYPES.map((item) => item.value)

/** 客观题自动判分，主观题只对照参考答案 */
export const OBJECTIVE_TYPES = ['single', 'multiple', 'judge']

/** 判断题固定选项 */
export const JUDGE_OPTIONS = [
  { key: 'A', text: '对' },
  { key: 'B', text: '错' },
]

/**
 * @param {string} value 题型
 * @param {boolean} [short] 是否用简称
 * @returns {string}
 */
export function questionTypeLabel(value, short = false) {
  const found = QUESTION_TYPES.find((item) => item.value === value)
  if (!found) return ''
  return short ? found.short : found.label
}

/**
 * @param {string} value 题型
 * @returns {boolean}
 */
export function isObjectiveType(value) {
  return OBJECTIVE_TYPES.includes(value)
}
