# 教科书重点标注 — 原文逐段核验记录（2026-10-27）

## 范围与规则

仅数学「集合と命題」四组 GOLDEN 连续教材，以及物理「物体の運動」改订版 1A–1G 的**知识学习（教科书）模式**。问题练习模式、模拟测试、旧版物理和其他数学章节不做这套标记。原始教材文字、公式、填空、选项、答题与反馈逻辑保持不变。

黑色粗体突出定义条件、性质、概念对比和判断依据；深蓝色粗体（#245B92）突出在当前段落明确解释的概念名称及对照项。没有重要教学意义的普通句子不强行加粗。

## 实际读取的原始文字

数学：backend/src/goldenMath/set/{setLesson,setOutsideSlice,setRealLineSlice}.ts 及 backend/src/goldenMath/proposition/{propositionReadingLesson,quantifierLesson,propositionProofLesson}.ts。后端 importGoldenMath.ts 按知识点分组，同时保留原始 readingFlow block ID。

物理：backend/src/zipPhysics/chapter1Source.ts；importRevisedPhysics.ts 将改订版 1A–1G 转换为独立 readingFlow 段落，保留段落 ID。

标记配置：src/domain/emphasis/mathSetsEmphasis.ts 与 src/domain/emphasis/physicsMotionEmphasis.ts。渲染：src/components/learning/KeyConceptText.tsx；按具体教材、block ID 和原文子串匹配，不再使用全教材全局关键词正则。数学的独立概念 term 片段也加蓝色。

## 覆盖清单

| 教材 | 标记的教学段落 | 精确标记短语 |
|---|---:|---:|
| 数学：集合（1.1–1.7） | 37 | 69 |
| 数学：命题、必要充分、否定 | 24 | 49 |
| 数学：量词「すべて」「ある」 | 14 | 19 |
| 数学：逆、裏、対偶、证明 | 17 | 31 |
| 物理 1A：变位与速度 | 19 | 31 |
| 物理 1B：速度的合成分解 | 12 | 20 |
| 物理 1C：相对速度 | 9 | 12 |
| 物理 1D：加速度 | 19 | 26 |
| 物理 1E：水平投射 | 15 | 25 |
| 物理 1F：斜方投射 | 19 | 27 |
| 物理 1G：重力加速度、空气阻力、终端速度 | 21 | 40 |
| **总计** | **206** | **357** |

并非强制给所有正文加粗。以上是从实际教材中筛选出有定义、重要解释、判断条件、性质或结论的段落与短语，纯推导公式、答题过渡等仍按原样显示。

## 可核对的典型例子

- math-sets / paragraph-finite-concept：黑色「有限個の要素からなる」「無限に多くの要素からなる」；蓝色「有限集合」「無限集合」。
- math-sets / paragraph-universal-concept：黑色「考える対象全体」；蓝色「全体集合」。
- math-sets / paragraph-complement-concept：黑色「全体集合Uの中でAに属さない要素全体」；蓝色「補集合」。
- math-propositions-reading / paragraph-implication-concept：黑色「真か偽かを判断できる文」；蓝色「命題」。
- math-propositions-proof / paragraph-contradiction-concept：黑色「結論を否定して仮定し」「矛盾を導いて」；蓝色「背理法」。
- physics-1a / paragraph-3：黑色「原点から物体の位置へ向かう」；蓝色「位置ベクトル」。
- physics-1c / paragraph-3：黑色「ある観測者から見た別の物体の速度」；蓝色「相対速度」。
- physics-1g / paragraph-25：黑色「ある一定値へ漸近的に近づく」；蓝色「終端速度」。

## 已完成的源文对照

1. **357 / 357** 标记短语可在对应教材的原文 block 中定位，没有引用不存在的原文字串。
2. 数学按原始 text / term 片段逐项核对：**168 / 168** 可直接在同一可渲染片段中定位。
3. 物理按当前行内数学拆分逻辑模拟校验，修正跨越公式 token 的标注之后：**189 / 189** 可在实际文字片段中定位。
4. 渲染器只改变原文字串的字体样式，不修改文字、数学、选择题或任何尚未揭示的答案。
5. 另有 KeyConceptText.test.tsx 回归测试代码。以上源文核对**已执行**，但 Vitest 实际执行结果与浏览器的视觉验收**不能仅凭 Render 构建成功来认定通过**。

后续修改原文时应同步核对相应 block 的标记；不要回退到全局单词出现即加粗的实现。
