# QUESTION SCHEMA

题目必须包含 `schemaVersion`、`questionId`、`revision`、`status`、`subject`、`taxonomy`、`difficulty`、`estimatedSeconds`、`source`、`assets`、`stem`、`learning`、`simulation`、`fullExplanation`、`relatedQuestions`。

内容块支持 text/latex/image/table；学习定义包含连续 solutionFlow、以 ID 索引的 blanks 和 detailed/standard/selfCheck 三种 blankId 列表；模拟定义包含共享 material 与单选/多选/数值 items。所有永久引用均使用稳定字符串 ID，禁止数组下标答案。

Zod 除形状校验外必须检查选项、答案、资源、flow、variant、类题与分数交叉引用。具体规范随阶段 3 的可执行 Schema 同步更新。

## 可执行实现

`src/domain/questionSchema.ts` 是规范来源，`QuestionCatalogSchema` 在模块加载、管理页导入和测试中共用。除字段形状外，它验证：

- question/asset/content/blank/option ID 的重复与引用；
- 正确选项真实存在，数值题有 correctValue；
- 每个 blank 被 solutionFlow 引用且 variant 只含已有 blank；
- image block 只引用已有 asset；表格各行列数一致；
- short practice 与三类 related question 在 catalog 中存在且不指向自己；
- 每个模拟 item 分数为正、选择题有选项和至少一个正确答案。

校验错误由 `formatQuestionIssues` 输出 `path: message`，内容人员可以定位到具体数组/record 字段。
