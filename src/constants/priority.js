/**
 * 任务优先级
 *
 * 与页面设计说明一致：新建任务默认「中」。
 */
export const PRIORITIES = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export const DEFAULT_PRIORITY = 'medium'

export const PRIORITY_VALUES = PRIORITIES.map((item) => item.value)

/**
 * @param {string} value 优先级
 * @returns {string}
 */
export function priorityLabel(value) {
  const found = PRIORITIES.find((item) => item.value === value)
  return found ? found.label : ''
}

/**
 * @param {string} value 优先级
 * @returns {boolean}
 */
export function isValidPriority(value) {
  return PRIORITY_VALUES.includes(value)
}
