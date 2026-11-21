# AGENTS.md

个人学习平台（前端课程期末项目）。本文件是给协作开发的 AI 助手和组员共同遵守的约定，改动项目前先读一遍。

## 项目定位

- 单页应用：Vue 3 + Vite，桌面顶部胶囊导航 / 手机底部 Tab，浏览器直接访问，不打包成 App。
- 9 个业务页面 + 404，页面划分与字段规则来自项目根目录外的「页面设计说明」与「课程要求清单」。

## 成员分工

按业务闭环分成两条线，各自独立跑通一条完整流程。

| 线 | 成员 | 分支 | 页面 | store | 组件 / 工具 |
| --- | --- | --- | --- | --- | --- |
| A · 日常学习线 | A | `feat/a-daily` | P01 首页、P02 计划、P03 笔记列表、P04 笔记编辑、P05 专注 | `task.js` `note.js` `focus.js` | `TaskCard` `NoteCard` `MasteryTag` · `utils/date.js` |
| B · 自测备考线 | B | `feat/b-selftest` | P06 题库、P07 组卷、P08 作答、P09 记录错题 | `question.js` `paper.js` `record.js` | `QuestionCard` `AnswerSheet` · `utils/paper.js` |

**A 线逐页范围**

| 页面 | 要做的事 |
| --- | --- |
| P02 `/plan` | 任务表单（新建 + 编辑共用）、校验、搜索 / 状态筛选 / 日期排序、任务卡（完成·编辑·延期·删除）、关联笔记 |
| P01 `/` | 今日与逾期任务、完成进度、本周专注时长、最近笔记、复盘知识点 |
| P03 `/note` | 笔记卡片列表、搜索、课程 / 标签筛选、按更新时间排序 |
| P04 `/note/:id` | 标题 / 课程 / 正文 / 知识点 / 掌握程度、照片上传（≤6 张）、未保存离开提示 |
| P05 `/focus` | 学习与休息时长设置、倒计时、切换页面不丢、完成记一条记录 |

**B 线逐页范围**

| 页面 | 要做的事 |
| --- | --- |
| P06 `/bank` | 题目列表、按课程 / 年份 / 题型 / 知识点筛选、搜索、分页、题目详情看答案解析 |
| P07 `/paper/create` | 选课程 / 年份 / 知识点 + 各题型题数、题量不足提示、生成试卷 |
| P08 `/paper/:id` | 答题卡、翻题、作答、交卷确认、客观题自动判分、逐题对错与解析 |
| P09 `/record` | 记录 / 错题两个标签、按课程与知识点筛选、错题展开解析、一键生成复习任务 |

**受保护文件（只由一个人统一改）**

以下 5 个文件谁都会想改，必然冲突。负责人由小组指定；在指定之前，改动这 5 个文件必须双方都知情：

| 文件 | 为什么保护 |
| --- | --- |
| `src/router/index.js` | 每人都会想加路由 |
| `src/App.vue` | 导航栏，每人都会想加菜单 |
| `src/style.css` | 全局样式，改一处影响全站 |
| `src/stores/index.js` | store 入口与持久化插件 |
| `vite.config.js` | 构建配置，改错全组跑不起来 |

其他人需要加路由、加 store 入口、改全局样式时，**先告知负责人，由他统一改**。

**其它协作规则**

- `src/components/` 下公共组件的**接口**（props / emits / slots）一旦定下就冻结，改接口要先与对方确认。
- `src/constants/` 下的枚举白名单（课程、知识点、掌握程度、题型）**全组共用，新增值必须一致**，不能各自在页面里写中文字面量判断。
- 每个 `src/views/*.vue` 只有一个负责人，另一个人发现问题先说一声，不要直接改。

**协作节奏**

1. 先各自把自己负责页面的 store 和最小可用界面做出来，能点通。
2. 再打通两条闭环：`任务 → 专注 → 记笔记 → 首页复盘`、`题库 → 组卷 → 作答 → 错题 → 复习任务`。
3. 最后统一处理四态、离开拦截、手机端细节。

## 路由表（已固定，不要随意改名）

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 学习首页 | 今日任务、本周专注、最近笔记、学习复盘 |
| `/plan` | 学习计划与待办 | 任务增删改查、筛选、排序 |
| `/note` | 课程笔记列表 | 搜索、课程/标签筛选、排序 |
| `/note/new`、`/note/:id` | 笔记编辑详情 | 新建与编辑共用；**`new` 必须排在 `:id` 之前** |
| `/focus` | 专注学习 | 计时、暂停、结束、记录 |
| `/bank` | 真题题库 | 搜索、筛选、分页、查看详情 |
| `/paper/create` | 规则组卷 | 条件校验、题量统计、生成试卷 |
| `/paper/:id` | 作答与反馈 | 未提交/已提交两种状态，答题时隐藏底部 Tab |
| `/record` | 练习记录与错题 | 两个页内标签 |
| `/:pathMatch(.*)*` | 404 | 无效地址兜底 |

- 页面切换**必须**走 Vue Router，禁止用 `v-if` 在一个组件里模拟多页。
- 导航高亮由 `meta.group` 驱动；手机端隐藏底栏用 `meta.hideTabBar`。
- 新增页面只改 `src/constants/nav.js`，桌面导航与手机底栏自动同步，不要在组件里另写一份导航数组。
- 跳转一律用 `router.push({ name })` 或 `:to="{ name }"`，禁止手写路径字符串拼查询参数。

## 跨页传参约定（query）

页面之间要传「来源条件 / 预填字段」时，**只用 query，不用全局变量**，刷新后仍能还原。

| 目标页 | query 参数 | 由谁跳转 |
| --- | --- | --- |
| `/plan` | `action=new`（打开新建表单）、`title`、`course`、`knowledgePoint`、`deadline` | 首页「新建任务」、首页复盘「加入复习任务」、结果页「创建复习任务」、错题页「创建复习任务」 |
| `/focus` | `taskId`（带任务开始，任务课程进入记录） | 任务卡「开始专注」 |
| `/note/new` | `taskId`、`course`、`knowledgePoint`（从任务新建笔记时带入） | 任务卡「关联笔记」→ 新建 |
| `/note` | `course`、`knowledgePoint`、`sourceTaskId`（来自任务的来源条）、`pick=1`（选择模式，多选后返回原任务） | 首页复盘、任务卡关联笔记、结果页「打开相关笔记」 |
| `/bank` | `course`、`knowledgePoint`、`from=note`、`noteId`（来源笔记） | 笔记页「去自测」 |
| `/paper/create` | `course`、`yearStart`、`yearEnd`、`knowledgePoint`、`from=bank` | 题库「按当前条件组卷」 |
| `/record` | `tab=mistakes`（直接打开错题标签） | 结果页「查看错题记录」 |

- 目标页在 `onMounted` / `watch(route.query)` 里读取一次 query 并转成自己的表单状态，**读完不保留在地址栏不影响功能**。
- 「清除来源条件」要把 query 一起清掉，否则刷新后又回来了。

## 技术栈（已定，不要改）

- Vue 3（`<script setup>` 组合式 API）、Vite、Vue Router、Pinia
- 纯 JavaScript，**不引入 TypeScript**，也不写 `// @ts-check`、`@typedef`、泛型这类 TS 味语法
- 允许用 JSDoc 给函数标注参数与返回值（如 `@param {string} course`），但不要为此引入类型系统，也不必每个函数都标
- 样式为原生 CSS + CSS 变量，不引入 UI 框架（Element Plus、Tailwind 等）
- ESLint + Prettier 已配置，必须保持通过

## 常用命令

```bash
npm install      # 装依赖，仅首次或 package.json 变更后
npm run dev      # 本地开发，http://localhost:5173
npm run build    # 生产构建，合码前必须无报错通过
npm run lint     # ESLint 检查
npm run format   # Prettier 格式化
```

## 环境与开工流程

**环境要求**

- Node.js 18 以上（本项目实测 Node 26 可用），`node -v` / `npm -v` 都能输出才算装好。
- 终端统一用 **Git Bash**，不要用 CMD（路径与命令兼容性差，出问题难排查）。
- 路径写在 Git Bash 里是 `/d/xxx` 不是 `D:\xxx`；路径含空格要加双引号。
- 国内直连 GitHub 常被重置，需要给 Git 配代理（见下方「网络」）。

**首次上手（七步，顺序不能颠倒）**

```bash
cd /d/你的目录                                  # 1. 进入存放项目的目录
git clone https://github.com/1xia163/study-platform.git   # 2. 克隆（必须用 clone，不能下 ZIP）
cd study-platform                               # 3. 进入项目
git checkout -b feat/03-plan-note               # 4. 先建分支
npm install                                     # 5. 装依赖
npm run dev                                     # 6. 跑起来，浏览器开 localhost:5173
git status                                      # 7. 确认在 On branch feat/xxx 上再写代码
```

> **先建分支，再装依赖**，不要反过来；也不要直接在 `main` 上写代码。

**每天开工（三条命令）**

```bash
git checkout feat/03-plan-note                  # 切到自己的分支
git checkout main && git pull && git checkout feat/03-plan-note && git merge main
npm run dev
```

每天同步一次，冲突通常只有几行；攒一周再合可能撞上几十处冲突。

**网络**

```bash
# 配代理（端口换成自己软件的）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 不用了就取消
git config --global --unset http.proxy
git config --global --unset https.proxy
```

常见端口：Clash 7890、Clash Verge 新版 7897、v2rayN 10809、Shadowsocks 1080。配了代理后**代理软件必须开着**，否则报 `Failed to connect to 127.0.0.1 port 7890`。

## 目录职责

```
src/
├── components/   公共组件（AppHeader / AppTabBar / BaseModal / EmptyState / PageHeader / SearchFilterBar）
├── constants/    枚举与白名单（nav.js 已有；courses / mastery / questionTypes / priority 待建）
├── mock/         只读种子数据（questions.js 题库）
├── router/       路由表
├── stores/       Pinia store（index.js 注册持久化插件；业务 store 按页面分工）
├── styles/       设计 token（variables.css）
├── utils/        纯函数（date.js 归 A、paper.js 归 B）
├── views/        9 个页面视图 + NotFoundPage
├── App.vue       布局外壳（AppHeader + RouterView + AppTabBar）
├── main.js       入口
└── style.css     全局重置、布局、按钮/卡片/标签/表单样式
```

- **受保护文件**（只由负责人统一改）：`router/index.js`、`App.vue`、`style.css`、`stores/index.js`、`vite.config.js`。
- **页面层**：`views/` 下每个页面归属明确，只改自己负责的页面和它的专属组件。
- **纯逻辑放 `utils/`**：组卷抽题、判分、日期区间这类可测逻辑不要埋在组件里，组件只负责取值和渲染。
- 一个页面文件超过 300 行就该拆组件，不要把查数据和画 UI 塞在同一处。

## 数据与持久化约定

- 全部数据来自本地 Mock + localStorage，不请求后端。
- 持久化统一用 `pinia-plugin-persistedstate`（已在 `src/stores/index.js` 注册），store 里写 `{ persist: true }` 即可，key 自动为 `zhike:<storeId>`。
- **不要在组件里直接读写 `localStorage`**，一律通过 store。
- 题库是只读 Mock 数据（`src/mock/questions.js`），学生端不提供录题入口。
- 笔记照片的二进制文件放 **IndexedDB**，localStorage 只存 `photoId / fileName / sortOrder`；两者都成功才算保存成功。
- 试卷与作答记录保存**题目快照**，不只存 `questionId`，否则题库改动后历史结果会失真。

## 数据模型契约（字段名冻结，所有人照抄）

新增字段可以，**改名或改类型必须双方确认**，否则跨页数据对不上。

```js
// 任务 —— stores/task.js
{
  taskId, title, course, deadline: 'YYYY-MM-DD',
  priority: 'high' | 'medium' | 'low',
  knowledgePoint, description,
  isCompleted: false, completedAt: null,
  linkedNoteIds: [], createdAt, updatedAt
}
```

```js
// 笔记 —— stores/note.js
{
  noteId, title, course, knowledgePoint, tags: [],
  content,
  photos: [{ photoId, fileName, sortOrder }],   // 二进制在 IndexedDB
  mastery: 'none' | 'familiar' | 'skilled',
  linkedTaskIds: [], sourceTaskId: null,
  createdAt, updatedAt
}
```

```js
// 专注记录 —— stores/focus.js
{ sessionId, taskId: null, course, durationMinutes, startedAt, endedAt }
```

```js
// 题目（只读 Mock）—— src/mock/questions.js
{
  questionId, course, year, knowledgePoint,
  type: 'single' | 'multiple' | 'judge' | 'subjective',
  score, stem,
  options: [{ key: 'A', text: '...' }],   // 判断题固定「对 / 错」
  answer, explanation
}
// answer 格式按题型固定：单选 'A'｜多选 ['A','C']｜判断 true/false｜主观为参考答案文本
```

```js
// 试卷 —— stores/paper.js
{ paperId, createdAt, totalScore, rules: { course, yearStart, yearEnd, knowledgePoints, typeCounts }, questions: [题目快照] }
```

```js
// 作答记录 —— stores/record.js
{
  attemptId, paperId,
  answers: { [questionId]: 'A' | ['A','C'] | true },
  subjectiveAnswers: { [questionId]: '文本' },
  objectiveScore, objectiveMaxScore, totalScore,
  submittedAt, questions: [题目快照], wrongQuestionIds: []
}
```

```js
// 错题（按 questionId 归档，同一题重复答错只更新最后一条）—— stores/record.js
{ questionId, course, knowledgePoint, stem, answer, explanation, lastAnswer, lastWrongAt }
```

## 常量与白名单

枚举只在 `src/constants/` 定义一次，页面里禁止写死中文字面量做比较（`if (n.mastery === '未掌握')` 这种写法一律不允许）。

| 文件 | 内容 |
| --- | --- |
| `constants/nav.js`（已有） | `mainNav` / `selfTestNav` / `tabBarNav` |
| `constants/courses.js`（待建） | 课程 = 数据结构 / Python / 离散数学，每门课的 `knowledgePoints` 数组 |
| `constants/mastery.js`（待建） | `none` / `familiar` / `skilled` ↔ 未掌握 / 熟悉 / 熟练 |
| `constants/questionTypes.js`（待建） | `single` / `multiple` / `judge` / `subjective` ↔ 单选 / 多选 / 判断 / 主观 |
| `constants/priority.js`（待建） | `high` / `medium` / `low` ↔ 高 / 中 / 低 |

- 课程与知识点是**跨页最关键的公共值**：任务、笔记、题库、组卷、错题都用它做匹配，两边写法不一致（`数据结构` vs `数据结构与算法`）会导致筛选永远为空。
- 题库的 `course` / `knowledgePoint` 必须来自白名单；无法归类的题填 `未分类`，不要自创新标签。
- **题库 Mock 数据规模底线**：≥ 40 道，覆盖 4 种题型（单选 / 多选 / 判断 / 主观）、至少 2 门课。每个题型 ≥ 8 道，否则组卷页会一直提示题量不足，自测流程演示不出来。

## 工具函数（`src/utils/`，纯函数，不依赖组件）

| 文件 | 归属 | 内容 |
| --- | --- | --- |
| `date.js` | A | 今日 / 本周区间、日期格式化、`deadline` 是否逾期、排序比较 |
| `paper.js` | B | 按条件过滤题池、按题型抽题、判分（多选须选项集合完全一致）、算卷面总分 |

- 纯逻辑放这里，组件只负责取值和渲染，方便两人各自自测。
- 「今天 / 本周」这类边界只能从这里取，不要在页面里用 `new Date()` 自己算。

## 公共组件（已有，直接用，不要再造一套）

| 组件 | props | 事件 / 插槽 | 用途 |
| --- | --- | --- | --- |
| `PageHeader` | `title`(必填) `desc` `eyebrow` `art` | 插槽 `actions`（按钮区）、`art`（插画） | 每个业务页顶部标题区 |
| `EmptyState` | `title`(必填) `desc` `variant`(`empty`/`no-result`/`error`) `compact` | 默认插槽放操作按钮 | 空 / 无结果 / 加载失败三态 |
| `BaseModal` | `v-model` `title`(必填) `desc` `size`(`sm`/`md`/`lg`) `closeOnOverlay` | 插槽 `footer` | 表单、删除确认、交卷确认；手机自动变全屏 |
| `SearchFilterBar` | `v-model:keyword` `placeholder` `showReset` | 事件 `reset`；默认插槽放筛选项 | 计划、笔记、题库、记录四个列表页 |
| `AppHeader` / `AppTabBar` | 无（读 `meta.group` / `meta.hideTabBar`） | — | 桌面导航 / 手机底栏 |

**各条线专属组件（待建，只在自己的页面里用）**

| 组件 | 归属 | 用途 |
| --- | --- | --- |
| `TaskCard` | A | 任务卡片：标题、课程、日期、优先级、状态 + 操作（完成/编辑/延期/删除/关联笔记） |
| `NoteCard` | A | 笔记卡片：标题、知识点、掌握程度、更新时间、照片张数 |
| `MasteryTag` | A | 掌握程度标签（`未掌握/熟悉/熟练`），颜色取 `--c-mastery-*`，必须同时显示文字 |
| `QuestionCard` | B | 题干、年份、题型、课程、知识点、分值 |
| `AnswerSheet` | B | 答题卡：已答 / 未答 / 当前题 |

- 专属组件放 `src/components/`，文件名用大驼峰；A 的组件不导入 B 的，反之亦然。
- 需要跨线复用的组件（如通用列表卡片）再提升为公共组件，提升前先商量。

## 全局样式类（`src/style.css` 已有，优先复用）

`.page` `.page--narrow` `.stack` `.row` `.grid-cards` · `.card` `.card--flat` `.card--soft` · `.btn` `.btn--primary|green|ghost|danger|sm|block` · `.tag` `.tag--none|familiar|skilled|outline` · `.field` `.field__label` `.field__error` `.input` `.select` `.textarea`（+`--invalid`）· `.muted` `.small` `.section-title` `.sr-only`

- 按钮、卡片、标签、表单控件**一律用上面这些类**，不要自己写一套按钮样式。
- 颜色只取 `variables.css` 的变量，不写死 `#xxx`。
- 占位页里的 `.todo-list` / `.placeholder-note` 是骨架阶段的临时样式，页面实现后把清单和这两段样式一起删掉。

## 视觉与响应式

- 设计 token 只改 `styles/variables.css`，页面里不写死色值。现有变量：`--c-green #526C35`（深绿）、`--c-accent #E83A0A`（主操作）、`--c-bg #FFF7EC`（奶油底）、`--c-green-soft #DCEBD9`、`--c-danger #BB3025`，以及 `--fs-*` / `--sp-*` / `--r-*` / `--h-control` 等尺寸变量。
- 断点 768px：≥768 用桌面布局，<768 用单列 + 底部 Tab；CSS 里统一写 `@media (max-width: 767px)`，不要混用 `max-width: 768px`。
- 业务插画放 `public/illustrations/`，引用写 `/illustrations/xxx.png`，用 `object-fit: contain`；首页场景可用 `cover`。插画加载失败时保留标题与操作入口。
- **禁止任何绝对路径**（`C:\...`、`file:///`），`npm run build` 会直接失败。
- 图片要有 `alt`，纯图标按钮要有 `aria-label` 或可见文字。

## 交互与状态约定

每个列表页必须处理**四种状态**，缺一个就算没做完：

| 状态 | 判断依据 | 必须给什么 |
| --- | --- | --- |
| 有数据 | 列表非空 | 正常渲染 |
| 空 | 原始数据为空 | 用 `EmptyState` `variant="empty"`，给「下一步该点哪里」的入口（新建 / 去学习） |
| 无结果 | 有数据但筛选后为空 | `variant="no-result"` + 「清除筛选」按钮 |
| 加载 | 读取中 | 卡片骨架占位，不要白屏 |

表单约定：

- 保存前逐项校验，**错误文字显示在对应字段下方**，不要用 `alert`，也不要把错误集中堆在顶部。
- 必填项在 label 后加 `<span class="req">*</span>`，输入框加 `--invalid` 类。
- 保存中按钮显示「保存中」并 `disabled`，防止重复提交；失败时保留全部输入。
- 关闭/取消表单不写库；删除类操作必须二次确认，确认弹窗里写出对象名称。

离开拦截：

- 笔记有未保存修改（`isDirty`）时，路由离开要提示「保存后离开 / 放弃修改 / 继续编辑」。
- 试卷未交卷离开要提示「继续作答 / 保存进度后离开」。

其它：

- 所有图标按钮必须有 `aria-label`，`<img>` 必须有 `alt`。
- 不在页面里写死当前时间做「今日/本周」判断，统一走 `utils/` 里的日期函数，避免各处算出的边界不一致。
- 计时类功能用「开始时间戳 + 实际经过时间」推算剩余时间，不要靠 `setInterval` 累加（切标签页会变慢）。

## 临时文件约定

- 主动创建的临时脚本、中间产物、提取文本一律写到项目下的 `.tmp/`，不要散落在 `src/` 或项目根。
- `.tmp/` 已在 `.gitignore` 中，禁止提交；`vite.config.js` 已把 `.tmp` 排除出监听。
- 任务结束前删除本次创建的临时文件，并在回复中说明删了哪些。
- 工具输出超限时运行环境可能自动转储到系统临时目录，这不属于主动创建，不受本条约约束。

## Git 约定

**身份**（这一步不做，`git commit` 会直接报 `Please tell me who you are`）

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "GitHub 注册邮箱"
git config --global init.defaultBranch main
```

- 邮箱必须是 GitHub 账号里绑定的那个，否则提交不算进贡献记录、不显示头像。
- 不想公开真实邮箱：GitHub → Settings → Emails 勾选 *Keep my email addresses private*，用给出的 `12345678+用户名@users.noreply.github.com`。
- **多人共用一台电脑时必须用 `--local`**，否则后配的会覆盖前一个：
  ```bash
  git config user.name "张三"       # 不加 --global，只对本仓库生效
  git config user.email "zs@xx.com"
  ```

**分支**

- `main` 始终保持可运行（`npm run build` 能过）。**任何一次提交都必须能跑。**
- 每人一条自己的分支，命名 `feat/<模块>-<简述>`，例如 `feat/03-plan-note`、`feat/01-skeleton`。
  - 不要只叫 `03` / `04`：纯数字会和 Git 的提交编号冲突，弹 `refname '03' is ambiguous` 警告，过两周也记不住是谁。
- 每天开工先同步 `main`（见「每日开工」）。
- 多人同时改到同一个文件时，由该文件的**归属人**解决冲突。

**提交**

- 提交信息格式：`类型(模块): 做了什么`，例如：
  - `feat(plan): 完成学习计划列表与状态切换`
  - `fix(focus): 计时器暂停后无法继续`
  - `style(home): 调整首页卡片间距`
- 类型只有六个：`feat` 新功能 / `fix` 修 bug / `style` 只改样式 / `refactor` 重构 / `docs` 文档 / `chore` 配置依赖。
- **不要写** `update`、`修改`、`111`、`做完了一点` 这种——课程明确把 Git 记录算进评分。
- 小步提交、频繁推送：做完一个能跑的小功能就提交推送一次，不要攒一周再推。
- 提交前必须：`npm run lint`（0 error）→ `npm run build`（通过）→ `git status` 确认分支对、没有 `node_modules/`、没有误改别人的文件。
- 不提交 `node_modules/`、`dist/`、`.env`、`.tmp/`。

**推送与 PR**

```bash
git push -u origin feat/03-plan-note    # 第一次
git push                                # 之后
```

- 推送后在 GitHub 点 **Compare & pull request**，base 选 `main`，填写「做了什么 / 还没做 / 需要谁配合」。
- 合并后点 **Delete branch** 删掉自己的分支。
- **禁止 `git push -f`**：会永久覆盖远端别人的提交，是唯一「一按就可能丢别人代码」的命令。推送被拒时正确做法是 `git pull --rebase && git push`。

**冲突**

出现 `CONFLICT` 时，新手用 `git merge --abort` 回到合并前状态，然后截图找对方商量；复杂冲突不要硬解，容易删掉别人的代码。

## 提交前自查

**提交前必须（硬指标）**

- [ ] `npm run lint` 无 error
- [ ] `npm run build` 无报错（跑之前先 `Ctrl+C` 停掉 dev 服务）
- [ ] `git status` 第一行是 `On branch feat/xxx`，不是 `main`
- [ ] 改动列表里没有 `node_modules/`，也没有别人负责的文件
- [ ] 提交信息是 `类型(模块): 说明` 格式

**功能自查**

- [ ] 控制台无红色报错、无 Vue warning
- [ ] 9 个页面都能从导航点进去，刷新不白屏
- [ ] `/note/:id`、`/paper/:id` 直接输 URL 或刷新正常
- [ ] 表单空提交被拦下，并在字段下方给出提示文字
- [ ] 列表四种状态都不崩
- [ ] 窗口缩到 375px 无横向滚动条，按钮可点
- [ ] 没有绝对路径、没有残留 `console.log`
- [ ] `README.md` 已按课程要求写明：项目背景、目标用户、功能列表、页面结构、技术栈、数据来源、运行步骤、构建步骤、已知问题、小组分工
