# Phase 00 Review — PASS

## 目标

建立独立工程、只读参考审计、控制文档、依赖和可运行质量基线，不开发正式业务功能。

## 已完成

- 新项目 `kyotsu-step-web/`，与只读 `sources/` 分离；
- Vite + React + TypeScript、Router、Zustand、Zod、KaTeX、Vitest、Playwright、ESLint；
- 统一 `dev/build/typecheck/lint/test/test:e2e/check/check:all` scripts；
- Workflow、PRD、矩阵、架构、设计、Schema、测试、内容、部署和工作日志；
- Playwright Chromium 与手机 smoke test。

## 未完成

无阶段 0 未完成项。原 ZIP/Word 未同步到本地，未能重新计算哈希；已用引用对话中的既有审计作为继承证据，列为 P2 风险，不影响工程门禁。

## 主要文件

`package.json`、`vite.config.ts`、`playwright.config.ts`、`src/app/App.tsx`、`WORKFLOW.md`、`docs/source-audit.md` 及全部控制文档。

## 检查证据

- `pnpm install`：PASS；
- `pnpm check`：typecheck PASS、lint PASS、1 unit PASS、production build PASS；
- `pnpm test:e2e`：1 mobile Chromium smoke PASS。

## 浏览器测试

`/health` 在 Pixel 7 项目中可打开，`APP READY` 与页面标题断言通过。

## 发现并修复

1. pnpm 11 默认阻止 esbuild 安装脚本：在 `pnpm-workspace.yaml` 精确批准 esbuild；
2. Vitest 误收集 Playwright spec：限制 include 到 `src/**/*.test.*`；
3. Vite 配置的 test 类型不被 `vite` defineConfig 接受：改用 `vitest/config`。

## 风险与结论

无 P0/P1。P2：参考附件未同步，未来收到文件时补哈希/清单/差异复核。阶段结论：**PASS**，允许进入阶段 1。
