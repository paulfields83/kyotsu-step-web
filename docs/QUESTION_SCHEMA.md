# QUESTION SCHEMA

题目必须包含 `schemaVersion`、`questionId`、`revision`、`status`、`subject`、`taxonomy`、`difficulty`、`estimatedSeconds`、`source`、`assets`、`stem`、`learning`、`simulation`、`fullExplanation`、`relatedQuestions`。

内容块支持 text/latex/image/table。text 可以附带 `speaker`，用于共通测试式太郎/花子/先生对话。

学习定义包含连续 `solutionFlow`、以 ID 索引的 `blanks` 和 detailed/standard/selfCheck 三种 blankId 列表。所有永久引用均使用稳定字符串 ID，禁止数组下标答案。

## 共通测试学习结构

`learning.presentation = "common-test"` 时，必须同时设置：

- `flowType`
  - `math-narrative`：数学会话・资料型
  - `phenomenon-analysis`：物理现象分析型
  - `calculation-derivation`：物理计算导出型
  - `relation-analysis`：物理关系式分析型
- `finalBlankId`：原题最终选项对应的 blank

界面固定按三屏运行：

1. **元の問題 / 原题**：显示完整 stem 和原始选项，但不可作答。
2. **推論ガイド / 推理引导**：只显示 `solutionFlow` 中的连续推理与穴埋め。
3. **元の選択肢 / 原选项**：再次显示原题与 `finalBlankId` 的原始选项，完成最终作答。

`finalBlankId` 不得出现在 `solutionFlow` 中，避免在推理阶段提前出现最终选择；但它必须存在于 detailed/standard/selfCheck 三个 variant 中，并作为每种学习流程的最后一个作答项。

学习中的错误答案不会直接跳过。系统保留 `firstSelectedOptionIds` 与 `isFirstCorrect` 作为首次作答分析，同时允许重试直到该 blank 被正确解决；因此可以同时满足“首次正确率统计”和“错误后重试/提示”的教学需求。

## 可执行实现

`src/domain/questionSchema.ts` 是规范来源，`QuestionCatalogSchema` 在模块加载、管理页导入和测试中共用。除字段形状外，它验证：

- question/asset/content/blank/option ID 的重复与引用；
- 正确选项真实存在，数值题有 correctValue；
- 普通 blank 被 solutionFlow 引用，共通测试 final blank 由 `finalBlankId` 单独引用；
- common-test 必须有 `flowType` 与 `finalBlankId`，且 final blank 不得混入推理 guide；
- 每个 variant 只含已有 blank，并必须包含 final blank；
- image block 只引用已有 asset；表格各行列数一致；
- short practice 与三类 related question 在 catalog 中存在且不指向自己；
- 每个模拟 item 分数为正、选择题有选项和至少一个正确答案。

当前内置 Golden Samples：

- 数学：2 道会话・资料型
- 物理：现象分析型 / 计算导出型 / 关系式分析型各 1 道

校验错误由 `formatQuestionIssues` 输出 `path: message`，内容人员可以定位到具体数组/record 字段。
