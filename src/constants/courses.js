/**
 * 课程与知识点白名单
 *
 * 任务、笔记、题库、组卷、错题都用这里的值做匹配，是跨页最关键的公共数据。
 * 新增课程或知识点只改这个文件；页面里不要写死 '数据结构' 这类中文字面量做判断。
 */
export const COURSES = [
  {
    name: '数据结构',
    knowledgePoints: ['线性表', '栈与队列', '树', '二叉树遍历', '图论', '排序', '查找'],
  },
  {
    name: 'Python',
    knowledgePoints: ['基础语法', '函数', '异常处理', '文件读写', '面向对象'],
  },
  {
    name: '离散数学',
    knowledgePoints: ['命题逻辑', '集合', '关系', '图论', '树'],
  },
]

/** 课程名数组，用于下拉框 */
export const COURSE_NAMES = COURSES.map((item) => item.name)

/** 无法归类时统一用这个值，不要自创标签 */
export const UNCATEGORIZED = '未分类'

/**
 * 取某门课程下的知识点；课程不存在时返回空数组
 * @param {string} course 课程名
 * @returns {string[]}
 */
export function knowledgePointsOf(course) {
  const found = COURSES.find((item) => item.name === course)
  return found ? found.knowledgePoints : []
}

/**
 * 课程是否在白名单内
 * @param {string} course 课程名
 * @returns {boolean}
 */
export function isValidCourse(course) {
  return COURSE_NAMES.includes(course)
}

/**
 * 知识点是否属于该课程
 * @param {string} course 课程名
 * @param {string} knowledgePoint 知识点
 * @returns {boolean}
 */
export function isValidKnowledgePoint(course, knowledgePoint) {
  if (!knowledgePoint) return true
  return knowledgePointsOf(course).includes(knowledgePoint)
}
