# REQUIREMENTS MATRIX

状态只使用 `Not Started`、`In Progress`、`Blocked`、`Implemented`、`Verified`。只有实现且测试通过才能标记 Verified。

| ID | 需求 | 来源 | 优先级 | 实现位置 | 测试证据 | 状态 |
|---|---|---|---|---|---|---|
| ENG-01 | 独立 Vite/React/TS 工程和统一 scripts | Workflow | P0 | `package.json`, `src/app` | `App.test.ts`, `smoke.spec.ts` | Verified |
| IA-01 | 四栏导航与完整可达路由 | Workflow/方案 | P0 | `src/app`, `src/components` | `navigation.spec.ts` | Verified |
| UI-01 | LOGIKA 视觉系统与响应式外壳 | ZIP 审计 | P0 | `src/styles`, `src/components` | `responsive.spec.ts` | Verified |
| DATA-01 | 版本化数学/物理题目 Schema | 方案 | P0 | `src/domain/questionSchema.ts` | `questionSchema.test.ts` | Verified |
| DATA-02 | 4 道覆盖公式/图片/表格/长文/多空样例 | 方案 | P0 | `src/data/questions.ts` | `questionCatalog.test.ts` | Verified |
| LEARN-01 | 首次答案不可覆盖，错后回填正确答案 | 方案 | P0 | `src/domain/learning.ts`, 学习页 | `learning.test.ts`, `learning-flow.spec.ts` | Verified |
| LEARN-02 | 局部解析、自动下一空、三诱导程度 | 方案 | P0 | 学习页与 store | `learning-flow.spec.ts` | Verified |
| LEARN-03 | 学习会话刷新恢复与完成页真实统计 | 方案 | P0 | store, 结果页 | `learning-flow.spec.ts` | Verified |
| SIM-01 | 模拟作答中无反馈，题号/标记/自动保存 | 方案 | P0 | 模拟页与 store | `simulation-flow.spec.ts` | Verified |
| SIM-02 | 计时、超时自动交卷、多选/数值判分 | 方案 | P0 | `src/domain/scoring.ts`, 模拟页 | `scoring.test.ts`, E2E | Verified |
| RESULT-01 | 模拟结果与规则型真实巩固题 | 方案 | P0 | 结果页, `recommendation.ts` | `recommendation.test.ts` | Verified |
| ANALYTICS-01 | Attempt 动态分析知识/行为指标 | 方案 | P0 | `analytics.ts`, 分析页 | `analytics.test.ts` | Verified |
| MISTAKE-01 | 错题状态由后续表现推进 | 方案 | P1 | store, 错题页 | `analytics.test.ts`, `analytics-history.spec.ts` | Verified |
| HISTORY-01 | 保存 session/revision/首次选择/用时 | 方案 | P0 | store, 历史页 | `analytics-history.spec.ts` | Verified |
| RANK-01 | 随真实 Attempt 更新的本地演示排名 | Workflow | P1 | 排名页, `ranking.ts` | `ranking.test.ts`, `profile.spec.ts` | Verified |
| PROFILE-01 | 持久化设置与本地数据说明 | Workflow | P1 | 个人页, store | `profile.spec.ts` | Verified |
| ADMIN-01 | JSON 导入/导出、校验定位与共用预览 | 方案 | P1 | 管理页, store | `admin.spec.ts`, `questionSchema.test.ts` | Verified |
| A11Y-01 | 48px、键盘、焦点、语义、非纯颜色状态 | Workflow | P0 | 全局 | `a11y.spec.ts`, `responsive.spec.ts` | Verified |
| QA-01 | 全量类型/lint/unit/E2E/build 门禁 | Workflow | P0 | 配置/checkpoints | `pnpm check:all` | Verified |
| I18N-01 | 全局日文/中文切换与语言偏好持久化 | 用户追加需求 | P0 | `src/i18n`, `AppShell.tsx`, store | `language-switching.spec.ts` | Verified |
| I18N-02 | 所有页面、状态和无障碍名称随语言切换 | 用户追加需求 | P0 | `src/pages`, `src/components` | `language-switching.spec.ts`, `a11y.spec.ts` | Verified |
| I18N-03 | 4 道内置题有独立编写的中文题干、选项、解析、表格和图片说明 | 用户追加需求 | P0 | `src/data/questions.zh.ts` | `questionCatalog.zh.test.ts`, `language-switching.spec.ts` | Verified |
| I18N-04 | 两种语言共享稳定 ID 和判分逻辑，答题中切换不丢状态 | 用户追加需求 | P0 | 双题库、store、学习/模拟页 | `questionCatalog.zh.test.ts`, `language-switching.spec.ts` | Verified |
