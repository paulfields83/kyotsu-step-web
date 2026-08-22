# DEPLOYMENT

项目为纯静态 Vite SPA。构建产物在 `dist/`，托管方需把未知路径回退到 `index.html`。本地构建使用 Node 24 与 pnpm 11；执行 `pnpm install --frozen-lockfile && pnpm check:all` 后部署 `dist/`。发布任务必须保存完整门禁日志，不能只运行 `vite build`。

不需要服务端环境变量。首版数据保存在浏览器 localStorage；清理站点数据会删除本地进度，跨设备不会同步。

生产检查：

- 所有应用路由回退到 `/index.html`，静态资源路径不回退；
- 强制 HTTPS，`index.html` 短缓存，带哈希的 `assets/*` 使用长期 immutable 缓存；
- CSP 至少限制 `default-src 'self'`，图片允许同源/必要 data URI，字体允许同源；题库导出使用临时 blob URL，因此 `default-src`/导航策略需要实际验证；
- 设置 `X-Content-Type-Options: nosniff`、合适的 Referrer-Policy 和 frame-ancestors；
- 发布后直接访问 `/learning/setup`、`/analysis`、`/admin` 验证 SPA 回退；
- 在新浏览器配置中完成一次学习、刷新恢复、模拟交卷和 JSON 导出。

若未来加入后端、账号或联网排名，必须重新设计鉴权、数据迁移、隐私告知、保留周期和服务端判分；当前静态部署说明不再适用。
