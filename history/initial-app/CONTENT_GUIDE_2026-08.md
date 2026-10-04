# CONTENT GUIDE

## ID 与版本

1. 为题目、内容块、资源、空格、选项和模拟设问分配稳定、可读、仅含小写英数字和连字符的 ID；
2. 不要因为显示顺序变化而改 ID；Attempt、分析和历史都依赖稳定 ID；
3. 修改答案、判分、题意或教学路径时必须递增 `revision`；仅修正文案时也建议递增；
4. `questionId` 代表同一题，结构变化用 revision 表达；新题或明显变式应使用新 questionId。

## 内容块

- 日文正文使用 `text`；公式使用 `latex` 并指定 inline/block；内置题的中文版本在 `questions.zh.ts` 独立撰写，不由运行时机器翻译；
- 图片必须先声明 asset，内容块用 `assetId` 引用，并写出有信息量的 alt；
- 表格必须有列名，所有数据行列数一致；手机端允许表格自身横向滚动；
- 不把题干、正确答案或解析写成不可访问的截图；
- 来源必须写明 original/licensed/reference、label 与必要 rightsNote。

## 学习与模拟

- 每个错误选项填写 `misconceptionTags` 与 `wrongReason`；每个空栏填写知识标签、单一行为标签和局部解析；
- 三种引导程度只调整 blankId 列表，不复制 `solutionFlow`；
- `selfCheck` 至少包含一个可独立判断的关键空栏；
- 模拟单选/多选必须提供存在的正确 option，数值题必须提供 finite `correctValue` 和非负 tolerance；
- 分数、预计秒数必须为正整数；多选采用全有或全无；
- relatedQuestions 和 shortPracticeQuestionId 必须指向同一导入 catalog 中真实存在的其他题。

## 双语内容同步

- 日文是 `questions.ts`，中文是 `questions.zh.ts`；两边的题目顺序和文字可以独立编辑，但稳定 ID、revision、状态、分类、难度、资源路径、正确答案、容差、分值、预计时间和关联题必须完全一致；
- 修改题目逻辑时必须同时更新两份 catalog，并让 `questionCatalog.zh.test.ts` 通过；
- 中文题意以数学/物理语义准确和自然表达为准，不要求逐字对应日文；公式中的 `\\text{...}`、表头、图片 alt/caption、错误原因和完整解析也必须中文化；
- 自定义 JSON 当前不自动翻译；需要双语发布时，应分别维护经过审核的内容版本，再按未来 Schema 扩展流程导入。

## 发布流程

1. 在管理页选择一题复制到编辑栏，先修改 `questionId`；
2. 完成内容、分类、学习 flow、模拟 items、解析和关系；
3. 点击“検証して追加題庫を保存”；按错误路径逐项修复；
4. 在共用预览检查文字、KaTeX、图片 alt 与表格；
5. 进入学习和模拟各完成一次真实流程；
6. 下载追加题库 JSON 作为备份；正式纳入内置题时补 `questionCatalog.test.ts` 回归。

非法题目不得通过绕过 store 或直接修改 localStorage 的方式加入可用 catalog。
