# 共通 STEP 数学・物理刷题 Web App

面向日本大学入学共通测试的手机优先 Web App。产品把逐空学习、无即时反馈模拟测试、真实 Attempt 分析、错题复习和本地题库管理连成一个闭环。

## 已实现

- 学习模式：三种引导程度、逐空选择、首次答案不可覆盖、错后回填正确答案、局部解析、刷新恢复和真实完成统计；
- 模拟测试：科目/范围/难度/题数/时间设置，单选、多选、数值题，题号导航、稍后检查、自动保存、超时交卷和统一判分；
- 学习闭环：知识与解题行为分维度分析、错题状态自动推进、Attempt 历史、规则型真实巩固题；
- 本地功能：明确标识的演示排名、持久化设置、确认式清除、JSON 题库导入/导出/预览；
- 内容：2 道数学、2 道物理内置题，覆盖 KaTeX、图片、表格、长日文和 6 空长流程；
- 双语：顶部可随时切换 `日本語 / 中文`；语言偏好自动保存，4 道内置题各有独立编写的完整中文内容，答题中切换不会丢失进度；
- 工程：TypeScript、ESLint、Vitest、Playwright、生产构建、错误边界、键盘焦点和多视口回归。

## 快速开始

需要 Node.js 24 和 pnpm 11。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

打开 `http://127.0.0.1:4173`。

```bash
pnpm check       # typecheck + lint + unit + production build
pnpm test:e2e    # Playwright 手机流程
pnpm check:all   # 完整门禁
```

## 主要目录

```text
src/domain/       题目 Schema、学习/模拟状态、判分、分析、推荐
src/data/         通过 Zod 校验的日文/中文内置题库
src/i18n/         语言运行时与科目、难度、标签显示名
src/stores/       Zustand persist 会话、Attempt、题库和设置
src/components/   AppShell、内容 renderer、学习流程与通用状态
src/pages/        路由页面
e2e/              手机端真实用户流程
docs/             PRD、矩阵、架构、测试、内容、部署和阶段报告
```

更完整的技术决策见 [ARCHITECTURE.md](docs/ARCHITECTURE.md)，题目字段见 [QUESTION_SCHEMA.md](docs/QUESTION_SCHEMA.md)，完整执行门禁见 [WORKFLOW.md](WORKFLOW.md)。

## 本地数据与隐私

- 不需要登录，不连接正式后端，不上传答题数据；
- 会话、Attempt、自定义题和设置保存在浏览器 `localStorage` 的 `kyotsu-step-store`；
- `settings.language` 保存当前语言；已有本地记录升级后默认保持日文，可随时切换中文；
- 清理浏览器站点数据会删除本地记录，当前版本不支持跨设备同步；
- 排名页是固定演示数据与本机真实表现的比较，不是全国或联网排名；
- 时间戳以数值保存，界面历史按 `Asia/Tokyo` 显示。

## 题库管理

从“マイページ → 題庫を管理”进入 `/admin`：

1. 可把当前题复制到 JSON 编辑栏；
2. 修改 `questionId`、内容和关系后执行联合验证；
3. 验证通过才会替换本地追加题库；
4. 可分别下载追加题库或完整题库 JSON。

非法 ID、悬空空栏/选项/图片/关系、错误表格列数和不完整判分字段都会被拒绝。内置题只读。具体规则见 [CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)。

内置中文题库与日文题库共用稳定 ID 和判分逻辑，但题干、选项、解析、表格与图片说明分别撰写。用户自己导入的 JSON 按文件原始语言显示，应用不会自动机翻。

## 部署

`pnpm build` 生成纯静态 `dist/`。托管平台必须把未知 SPA 路径回退到 `index.html`。生产建议、缓存与 CSP 见 [DEPLOYMENT.md](docs/DEPLOYMENT.md)。

## 参考材料状态

新项目与同步参考目录完全分离，没有修改 `sources/`。本任务环境未同步用户提到的 ZIP 与 Word 原件，因此本地审计依据引用对话中已提取的审计和需求证据；该 P2 追溯风险记录在 [source-audit.md](docs/source-audit.md)。若原件后续可用，应补做文件哈希、清单和差异复核，不影响当前工程门禁结果。
