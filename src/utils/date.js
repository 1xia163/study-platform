/**
 * 日期工具（纯函数，不依赖组件）
 *
 * 约定：
 * - 日期只存 'YYYY-MM-DD' 字符串，按本地时区处理，避免 new Date('2026-11-25') 被当成 UTC 而差一天。
 * - 「今天 / 本周」这类边界只能从这里取，页面里不要自己 new Date() 算。
 */

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六']

function pad(value) {
  return String(value).padStart(2, '0')
}

/**
 * 把 Date 或可解析值转成 'YYYY-MM-DD'
 * @param {Date|number|string} [date] 默认为当前时间
 * @returns {string}
 */
export function toDateString(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(value.getTime())) return ''
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

/**
 * 今天的 'YYYY-MM-DD'
 * @returns {string}
 */
export function todayString() {
  return toDateString(new Date())
}

/**
 * 严格解析 'YYYY-MM-DD'，非法日期（如 2026-02-31）返回 null
 * @param {string} dateString 日期字符串
 * @returns {Date|null}
 */
export function parseDate(dateString) {
  if (typeof dateString !== 'string') return null
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  const [year, month, day] = parts.map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }
  return date
}

/**
 * @param {string} dateString 日期字符串
 * @returns {boolean}
 */
export function isValidDateString(dateString) {
  return parseDate(dateString) !== null
}

/**
 * 在 'YYYY-MM-DD' 上加减天数，用于生成相对今天的演示数据、计算延期日期
 * @param {string} dateString 'YYYY-MM-DD'
 * @param {number} days 正数往后、负数往前
 * @returns {string} 'YYYY-MM-DD'；非法输入返回 ''
 */
export function addDays(dateString, days) {
  const date = parseDate(dateString)
  if (!date) return ''
  date.setDate(date.getDate() + Number(days || 0))
  return toDateString(date)
}

/**
 * 是否早于今天（昨天以前）
 * @param {string} dateString 'YYYY-MM-DD'
 * @returns {boolean}
 */
export function isBeforeToday(dateString) {
  if (!isValidDateString(dateString)) return false
  return dateString < todayString()
}

/**
 * 是否就是今天
 * @param {string} dateString 'YYYY-MM-DD'
 * @returns {boolean}
 */
export function isToday(dateString) {
  return dateString === todayString()
}

/**
 * 任务是否逾期：未完成且截止日期早于今天
 * @param {string} deadline 'YYYY-MM-DD'
 * @param {boolean} [isCompleted] 是否已完成
 * @returns {boolean}
 */
export function isOverdue(deadline, isCompleted = false) {
  if (isCompleted) return false
  return isBeforeToday(deadline)
}

/**
 * 本周一 00:00（周一为一周开始）
 * @param {Date} [date] 基准日期，默认今天
 * @returns {Date}
 */
export function startOfWeek(date = new Date()) {
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = value.getDay()
  value.setDate(value.getDate() - (day === 0 ? 6 : day - 1))
  return value
}

/**
 * 时间戳是否落在本周（含今天）
 * @param {number|string} timestamp 时间戳或可解析时间
 * @returns {boolean}
 */
export function isThisWeek(timestamp) {
  const value = new Date(timestamp)
  if (Number.isNaN(value.getTime())) return false
  const start = startOfWeek()
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  return value >= start && value < end
}

/**
 * 日期字符串排序比较，空值排最后
 * @param {string} left 日期
 * @param {string} right 日期
 * @param {'asc'|'desc'} [order] 排序方向
 * @returns {number}
 */
export function compareDateString(left, right, order = 'asc') {
  if (!left && !right) return 0
  if (!left) return 1
  if (!right) return -1
  const result = left < right ? -1 : left > right ? 1 : 0
  return order === 'desc' ? -result : result
}

/**
 * 'YYYY-MM-DD' → '11月25日'
 * @param {string} dateString 日期字符串
 * @returns {string}
 */
export function formatMonthDay(dateString) {
  const date = parseDate(dateString)
  if (!date) return dateString || ''
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * 时间戳 → '11月18日 14:30'
 * @param {number|string} timestamp 时间戳或可解析时间
 * @returns {string}
 */
export function formatDateTime(timestamp) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getMonth() + 1}月${date.getDate()}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * 时间戳 → '14:30'，用于专注记录这类只关心时刻的场景
 * @param {number|string} timestamp 时间戳或可解析时间
 * @returns {string}
 */
export function formatHourMinute(timestamp) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return ''
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * 秒数 → 'mm:ss'，超过一小时显示 'H:mm:ss'
 * @param {number} seconds 剩余或已用秒数
 * @returns {string}
 */
export function formatClock(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(rest)}`
  return `${pad(minutes)}:${pad(rest)}`
}

/**
 * 取星期几的中文简称，用于首页日期条
 * @param {Date} [date] 默认今天
 * @returns {string}
 */
export function weekdayLabel(date = new Date()) {
  return `星期${WEEK_LABELS[date.getDay()]}`
}
