/**
 * 掌握程度三档
 *
 * 与页面设计说明一致：新笔记默认「未掌握」。
 * value 用于存储，label 用于显示，tagClass 对应 style.css 里的 .tag--xxx。
 */
export const MASTERY = [
  { value: 'none', label: '未掌握', tagClass: 'tag--none' },
  { value: 'familiar', label: '熟悉', tagClass: 'tag--familiar' },
  { value: 'skilled', label: '熟练', tagClass: 'tag--skilled' },
]

export const DEFAULT_MASTERY = 'none'

export const MASTERY_VALUES = MASTERY.map((item) => item.value)

/**
 * 取显示文字；未知值原样返回，避免界面出现空白
 * @param {string} value 掌握程度
 * @returns {string}
 */
export function masteryLabel(value) {
  const found = MASTERY.find((item) => item.value === value)
  return found ? found.label : ''
}

/**
 * 取标签样式类
 * @param {string} value 掌握程度
 * @returns {string}
 */
export function masteryTagClass(value) {
  const found = MASTERY.find((item) => item.value === value)
  return found ? found.tagClass : ''
}

/**
 * 是否为合法掌握程度
 * @param {string} value 掌握程度
 * @returns {boolean}
 */
export function isValidMastery(value) {
  return MASTERY_VALUES.includes(value)
}
