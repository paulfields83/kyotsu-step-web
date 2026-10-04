# ARCHITECTURE

## 分层

```text
pages/components → Zustand actions + repository interfaces
                         ↓
                 domain pure functions
                         ↓
              localStorage / local catalog
```

- `domain/`：题目 Schema、学习状态变换、判分、分析、推荐，保持纯函数；
- `data/`：经过 Zod 校验的内置题库；
- `i18n/`：语言类型、运行时选择和科目/难度/标签显示名；
- `repositories/`：Question/Attempt 数据接口与本地实现；
- `store/`：Zustand persist 会话、Attempt、自定义题目和设置；
- `pages/`：路由级编排；`components/`：跨页复用与内容渲染；
- `e2e/`：以手机 Chromium 验证真实旅程。

## 关键决策

- 题目内容与作答记录分离；Attempt 保存 revision 和必要答案快照；
- 学习与模拟共用 stem/material、内容块和标签，但会话状态机独立；
- 进行中会话持久化；倒计时由 `startedAt + duration` 推导，避免刷新重置；
- 分析、错题与排名通过 selector/纯函数从 Attempt 计算，不保存易失真的汇总；
- 自定义题目先 Zod 校验再进入本地 catalog；内置题目不可由 UI 删除。
- 日文与中文内置题库是两份独立内容数据，共用相同 `questionId`、内容/选项/空格/设问 ID、revision 和判分字段；界面切换只更换显示 catalog，不重建 session 或 Attempt；
- `settings.language` 由 Zustand persist 保存；旧版持久化数据通过深合并自动补入默认 `ja`，页面根节点同步 `lang=ja/zh-CN`；
- 本地导入的自定义题按原始编写语言显示，不做运行时机器翻译。

## 路由与进入/退出规则

| 路由 | 用途 | 主要入口 | 退出/恢复 |
|---|---|---|---|
| `/problems` | 学习入口与近期状态 | 底部“问题” | 开始学习或进入模拟设置 |
| `/learning/setup` | 学习设置 | 问题页 | 返回问题页 |
| `/learning/session/:sessionId` | 逐空学习 | 学习设置/恢复条 | 刷新恢复；完成进结果 |
| `/learning/result/:sessionId` | 学习总结 | 会话完成 | 类题、错题、问题页 |
| `/simulation/setup` | 模拟设置 | 问题页 | 返回问题页 |
| `/simulation/session/:sessionId` | 无反馈考试 | 模拟设置/恢复条 | 刷新恢复；确认交卷 |
| `/simulation/result/:sessionId` | 统一判分结果 | 交卷/超时 | 巩固、分析、问题页 |
| `/analysis` | 动态总览 | 底部“分析” | 进入标签详情/错题/历史 |
| `/analysis/:dimension/:tagId` | 知识或行为详情 | 分析页 | 浏览器返回保持总览 |
| `/mistakes` | 错题状态 | 分析页 | 开始复习或返回分析 |
| `/history` | Attempt 历史 | 分析/个人 | 打开当次结果 |
| `/ranking` | 本地演示排名 | 底部“排名” | 切换科目/周期 |
| `/profile` | 设置与本地数据 | 底部“我的” | 设置即时持久化 |
| `/admin` | 本地内容管理 | 个人页开发者入口 | 预览/导入后返回 |

未知路由进入可解释 404，不静默显示空白。进行中会话离开前保持 store；重新进入或刷新恢复。空数据页使用 EmptyState；非法 ID 使用 ErrorState 并提供安全返回路径。

## 数据迁移

持久化 store 带 `version` 并对 `settings` 深合并默认值。未来破坏性修改通过 Zustand `migrate`；题目以 `questionId + revision` 识别，历史保留必要标题/答案快照，显示时优先从当前语言 catalog 读取题名。
