# 个人学习平台

一个面向在校大学生的**个人学习管理单页应用**：把「定计划 → 专注执行 → 记笔记 → 复盘 → 真题自测」串成一条完整的学习闭环。纯前端实现，数据保存在浏览器本地，打开网页即可使用，不依赖后端服务。

> 前端课程期末项目 · Vue 3 + Vite · 桌面与手机双端适配

---

## 一、项目背景

大学生平时面临三类学习管理问题：

1. **计划散落**：作业、复习、实验的截止日期记在聊天记录、便签、脑子里，容易漏；
2. **过程无记录**：学了多久、学到哪、哪里没懂，事后无法回溯；
3. **复盘断裂**：笔记记完就放着，不知道哪些知识点还没掌握，也不会自动变成下一轮复习任务。

本项目把这三件事放进同一个页面体系：任务有截止日期和优先级，专注有真实计时和记录，笔记带知识点与掌握程度标记，首页把「今天要做什么、这周学了多久、哪些知识点还没掌握」聚合成一屏，并支持从待复盘知识点一键生成复习任务；另配一套真题题库，可从笔记直接带条件进入自测，错题再回流成复习任务。

## 二、目标用户

- **主要用户**：有课程作业与考试压力、需要自我管理的在校大学生（本项目按**单人使用**设计，不做账号体系与多人协作）。
- **使用场景**：自习室/宿舍里用笔记本规划当天任务，用手机在通勤路上查看今日待办与专注计时，考前用题库自测并回顾错题。
- **使用前提**：现代浏览器（Chrome / Edge / Safari / Firefox 近期版本），无需安装、无需登录。

## 三、功能列表

功能编号对应 `docs/个人学习平台功能清单.docx`（F01–F12）。

### 学习闭环（P01–P05）

| 编号 | 功能 | 实现情况 |
| --- | --- | --- |
| F01 | **学习首页**：今日/逾期任务、任务完成进度、本周专注时长、最近笔记、最近专注记录 | ✅ 已实现 |
| F02 | **学习计划与待办**：按课程建任务（标题 / 截止日期 / 优先级 / 知识点 / 说明），支持完成、编辑、延期、删除；关键词搜索 + 状态筛选 + 截止日期排序 | ✅ 已实现 |
| F03 | **课程笔记**：新建 / 查看 / 编辑 / 删除笔记，含课程、知识点、标签、正文、照片；标题搜索 + 课程与标签筛选 + 更新时间排序；可从任务关联笔记，也可从笔记列表多选后回写任务 | ✅ 已实现 |
| F04 | **专注学习**：可关联任务启动，也可独立专注；学习时长 / 休息时长 / 轮数可设，支持暂停、继续、提前结束（二次确认）；切换页面与刷新都不丢计时；每个完整学习阶段落一条记录 | ✅ 已实现 |
| F05 | **学习复盘**：首页汇总任务完成情况与专注记录；笔记可标记未掌握 / 熟悉 / 熟练，未掌握的知识点可一键加入复习任务 | ✅ 已实现 |

### 自测与错题（P06–P09，B 线）

| 编号 | 功能 | 实现情况 |
| --- | --- | --- |
| F06 | **真题检索**：题干搜索 + 课程 / 年份 / 题型 / 知识点筛选，分页；从笔记进入时带入课程与知识点 | 🚧 B 线开发中 |
| F07 | **规则组卷**：选课程、限定年份与知识点、设置各题型数量，去重抽题并汇总分值，题库不足时提示调整 | 🚧 B 线开发中 |
| F08 | **作答与反馈**：答题卡、翻题、修改答案、交卷确认；客观题自动判分，逐题查看答案与解析 | 🚧 B 线开发中 |
| F09 | **练习记录与错题**：保存练习历史，错题按题目归档（重复答错更新最后一条），可按课程 / 知识点查看，并生成复习任务 | 🚧 B 线开发中 |

### 通用要求

| 编号 | 功能 | 实现情况 |
| --- | --- | --- |
| F10 | **本地数据保存**：预置示例任务 / 笔记 / 专注记录，学习数据存浏览器本地，刷新后可继续查看 | ✅ 已实现 |
| F11 | **表单与操作反馈**：字段级校验（错误显示在对应输入框下方）、保存中禁用按钮、删除二次确认、加载 / 空 / 无结果三态 | ✅ 已实现 |
| F12 | **桌面与手机适配**：768px 断点，桌面顶部胶囊导航 + 手机底部 Tab，375px 无横向滚动 | ✅ 已实现 |

## 四、页面结构

### 路由表

| 路由 | 页面 | 功能编号 | 说明 |
| --- | --- | --- | --- |
| `/` | P01 学习首页 | F01 / F05 | 今日待办、进度、本周专注、最近笔记、复盘区 |
| `/plan` | P02 学习计划与待办 | F02 | 任务增删改查、延期、筛选排序 |
| `/note` | P03 课程笔记列表 | F03 / F05 | 搜索、课程与标签筛选、排序、pick 多选关联 |
| `/note/new` | P04 笔记编辑（新建） | F03 | 与编辑页共用组件 |
| `/note/:id` | P04 笔记编辑（详情） | F03 | 注意 `/note/new` 必须排在 `/note/:id` 之前 |
| `/focus` | P05 专注学习 | F04 | 计时、暂停、结束、记录与周累计 |
| `/bank` | P06 真题题库 | F06 | B 线 |
| `/paper/create` | P07 规则组卷 | F07 | B 线 |
| `/paper/:id` | P08 作答与反馈 | F08 | B 线，答题时隐藏手机底栏 |
| `/record` | P09 练习记录与错题 | F09 | B 线，页内两个标签 |
| `/:pathMatch(.*)*` | 404 | — | 无效地址兜底 |

页面切换全部走 Vue Router（无 `v-if` 模拟多页）；动态参数页刷新、直连 URL 均可正常渲染。

### 目录结构

```
study-platform/
├── public/
│   └── illustrations/        页面插画（p01–p09）
├── docs/                     开发计划、功能清单、页面设计说明
├── screenshots/              页面截图（桌面 / 375px）
├── src/
│   ├── components/           公共组件 + 各线专属组件
│   ├── constants/            课程、知识点、掌握程度、优先级、题型等枚举白名单
│   ├── mock/                 只读题库 Mock（B 线）
│   ├── router/               路由表
│   ├── stores/               Pinia store（task / note / focus / question / paper / record）
│   ├── styles/               设计 token（颜色、字号、间距、圆角）
│   ├── utils/                纯函数（date.js 日期区间、photoDb.js IndexedDB、paper.js 抽题判分）
│   ├── views/                9 个业务页面 + 404
│   ├── App.vue               布局外壳（顶部导航 + RouterView + 手机底栏）
│   ├── main.js               入口
│   └── style.css             全局重置、布局与通用类
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

**关键组件**（`src/components/`）：`AppHeader` `AppTabBar` `PageHeader` `SearchFilterBar` `BaseModal` `EmptyState`（公共）；`TaskCard` `TaskForm` `NoteCard` `MasteryTag`（A 线）；`QuestionCard` `AnswerSheet`（B 线）。

## 五、技术栈

| 类别 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 3（`<script setup>` 组合式 API） | 全组统一组合式写法 |
| 构建工具 | Vite | 不用 webpack / vue-cli |
| 路由 | Vue Router（`createWebHistory`） | 11 条路由，含两个动态参数路由与 404 兜底 |
| 状态管理 | Pinia + `pinia-plugin-persistedstate` | 多个业务 store 共享状态 |
| 语言 | JavaScript（ESM） | 不引入 TypeScript，仅少量 JSDoc 注释 |
| 样式 | 原生 CSS + CSS 变量 | 不引入 UI 框架 / 原子化 CSS |
| 代码规范 | ESLint + Prettier | 已配进项目，`npm run lint` 为提交前必跑项 |
| 数据存储 | localStorage + IndexedDB | localStorage 存结构化数据，IndexedDB 存笔记照片二进制 |

## 六、数据来源与持久化

本项目**不请求后端**，全部数据来自「预置示例数据 + 浏览器本地存储」：

| 数据 | 存放位置 | persist key / 库名 |
| --- | --- | --- |
| 学习任务 | Pinia store → localStorage | `zhike:task` |
| 课程笔记（含照片元数据） | Pinia store → localStorage | `zhike:note` |
| 专注计时状态与专注记录 | Pinia store → localStorage | `zhike:focus` |
| 笔记照片二进制 | IndexedDB | 库 `zhike-media`，表 `note-photos` |
| 真题题库 | 只读前端 Mock（B 线） | `src/mock/questions.js` |

约定：

- 示例数据**仅在本地无数据时**写入一次；用户清空后不会自动恢复（执行 `localStorage.clear()` 后刷新即可回到初始演示状态）。
- 任务与专注的演示数据以「今天 / 当前时间」为基准相对生成，避免放置几天后全部变成逾期。
- 组件不直接读写 `localStorage`，一律通过 store，便于统一维护。
- 笔记照片先写 IndexedDB 再写元数据，两处都成功才算保存成功。

## 七、运行步骤

环境要求：**Node.js 18 及以上**（实测 Node 20 / 22 / 26 可用）、npm。

```bash
# 1. 克隆仓库
git clone https://github.com/1xia163/study-platform.git
cd study-platform

# 2. 安装依赖（仅首次或 package.json 变更后）
npm install

# 3. 启动开发服务
npm run dev
```

打开 <http://localhost:5173> 即可访问。`vite.config.js` 开启了 `host: true`，同一 Wi-Fi 下可用终端输出的 Network 地址在手机上预览（手机与电脑需在同一网段）。

其他常用命令：

```bash
npm run lint     # ESLint 检查，提交前必须 0 error
npm run format   # Prettier 格式化
```

## 八、构建步骤

```bash
# 生产构建（跑之前先 Ctrl+C 停掉 dev 服务）
npm run build

# 本地预览构建产物
npm run preview
```

- 构建产物输出到 `dist/`，为纯静态文件，可直接部署到任意静态托管（GitHub Pages / Nginx / 对象存储等）。
- 项目使用 `createWebHistory`（History 模式路由），部署到静态服务器时需把未匹配的请求回退到 `index.html`（例如 Nginx 用 `try_files $uri $uri/ /index.html;`），否则刷新子路由会 404。
- `npm run build` 必须无报错通过，这是本项目合码前的硬指标。

## 九、已知问题

| 问题 | 影响 | 现状 / 计划 |
| --- | --- | --- |
| 首页主插画 `p01-home-campus.png` 约 1.7 MB | 首屏与首次加载偏慢 | 本地演示可接受，后续压缩为 WebP |
| 数据仅存于当前浏览器 | 换浏览器、清缓存或隐私模式会回到演示数据，无法多设备同步 | 课程要求为纯前端 Mock，属预期行为，README 已说明复位方式 |
| 笔记照片存 IndexedDB | 无法随 localStorage 一起导出迁移 | 仅本地演示使用，未做导出功能 |
| P04 笔记编辑页 731 行 | 单文件偏大，超出「一页超 300 行该拆组件」的自定约定 | 待把照片区、字段区拆成独立子组件 |
| 无自动化测试 | 回归依赖手工走查 | 验收清单见 `docs/开发计划.md`，按页面逐项手工验证 |
| P06–P09 仍为占位页 | 自测闭环暂不可演示 | 由 B 线并行开发，合码后可用 |
| 手机端真机验证有限 | 仅在 375px 视口与浏览器设备模拟下验证 | 交付前补真机走查 |

## 十、小组分工

| 线 | 成员 | 分支 | 负责页面 | store / 组件 / 工具 |
| --- | --- | --- | --- | --- |
| A · 日常学习线 | 魏可欣 | `feat/a-daily` | P01 首页、P02 计划、P03 笔记列表、P04 笔记编辑、P05 专注 | `task.js` `note.js` `focus.js`；`TaskCard` `TaskForm` `NoteCard` `MasteryTag`；`utils/date.js` `utils/photoDb.js` |
| B · 自测备考线 | 谢林诺 | `feat/b-selftest` | P06 题库、P07 组卷、P08 作答、P09 记录错题 | `question.js` `paper.js` `record.js`；`QuestionCard` `AnswerSheet`；`utils/paper.js` |

共同约定与协作方式见 [`AGENTS.md`](AGENTS.md)，分步施工与验收记录见 [`docs/开发计划.md`](docs/开发计划.md)。公共部分（项目骨架、路由表、`App.vue`、`style.css`、设计 token、公共组件）由 A 线先搭好、B 线沿用；`src/router/index.js`、`src/style.css`、`src/App.vue`、`src/stores/index.js`、`vite.config.js` 为受保护文件，需由负责人统一修改。

## 十一、页面截图

`screenshots/` 目录存放各页面截图（桌面宽屏与 375px 窄屏各一套），用于报告与演示。
