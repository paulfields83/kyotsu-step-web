import { validateQuestionCatalog } from '../domain/questionSchema'

const text = (id: string, value: string) => ({ id, type: 'text' as const, text: value })
const dialogue = (id: string, speaker: string, value: string) => ({ id, type: 'text' as const, text: value, speaker })
const latex = (id: string, value: string, display: 'inline' | 'block' = 'block') => ({ id, type: 'latex' as const, latex: value, display })
const image = (id: string, assetId: string, alt: string, caption?: string) => ({ id, type: 'image' as const, assetId, alt, caption })
const table = (id: string, columns: string[], rows: string[][], caption?: string) => ({ id, type: 'table' as const, columns, rows, caption })
const option = (id: string, label: string, wrongReason = '') => ({
  id,
  content: [text(\`\${id}-content\`, label)],
  misconceptionTags: wrongReason ? ['misconception'] : [],
  wrongReason: wrongReason ? [text(\`\${id}-reason\`, wrongReason)] : [],
})
const simOption = (id: string, label: string) => ({ id, content: [text(\`\${id}-content\`, label)] })

const rawQuestionsZh = [
  {
    schemaVersion: '1.0', questionId: 'math-quadratic-01', revision: 2, status: 'published', subject: 'math-1a', unitType: 'major-question',
    title: '通过对话理解二次函数最大值',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '采用共通测试式对话与填空结构' },
    taxonomy: { majorUnit: 'functions', minorUnit: 'quadratic', knowledgeTags: ['completing-square', 'maximum'], skillTags: ['condition-reading', 'equation-building', 'conclusion'] },
    difficulty: 'standard', examLevel: 'common-test', estimatedSeconds: 420,
    assets: [],
    stem: [
      text('mq-stem-1', '文化祭展示中，学生想研究小型喷泉喷出的水的高度。设喷水后 x 秒时水的高度为 y m，并在 0 ≦ x ≦ 4 的范围内用下式近似。'),
      latex('mq-stem-2', 'y=-x^2+4x+1'),
      text('mq-stem-3', '请选择“水达到最大高度的时刻”和“该最大高度”的正确组合。'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'math-narrative',
      finalBlankId: 'mq-final-choice',
      solutionFlow: [
        { id: 'mq-flow-1', type: 'content', content: [dialogue('mq-flow-text-1', '太郎', '要判断最大值，可以先配方，再看抛物线的顶点。')] },
        { id: 'mq-flow-b1', type: 'blank', blankId: 'mq-blank-sign' },
        { id: 'mq-flow-2', type: 'content', content: [latex('mq-flow-latex-1', 'y=-(x-2)^2+5'), dialogue('mq-flow-text-2', '花子', '这样一来，当平方部分等于 0 时，y 最大。')] },
        { id: 'mq-flow-b2', type: 'blank', blankId: 'mq-blank-vertex' },
        { id: 'mq-flow-3', type: 'content', content: [dialogue('mq-flow-text-3', '太郎', '而且 x=2 在 0≦x≦4 的范围内，所以再计算此时的 y。')] },
        { id: 'mq-flow-b3', type: 'blank', blankId: 'mq-blank-max' },
        { id: 'mq-flow-4', type: 'content', content: [dialogue('mq-flow-text-4', '花子', '现在时刻和高度都求出来了，最后回到原来的选项选择对应组合。')] },
      ],
      blanks: {
        'mq-blank-sign': {
          id: 'mq-blank-sign', answerType: 'single-choice', prompt: '配方后平方项前面的符号是什么？',
          options: [option('mq-sign-minus', '负号（−）'), option('mq-sign-plus', '正号（＋）', '原式中 x² 的系数是 −1，因此配方后平方项前仍为负号。')],
          correctOptionIds: ['mq-sign-minus'], knowledgeTags: ['completing-square'], skillTag: 'equation-building',
          explanation: [text('mq-exp-sign', '先写成 −x²+4x = −(x²−4x)，再进行配方。')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-blank-vertex': {
          id: 'mq-blank-vertex', answerType: 'single-choice', prompt: '使平方部分为 0 的 x 是多少？',
          options: [option('mq-vertex-two', '2'), option('mq-vertex-minus-two', '−2', '(x−2)²=0 时 x=2。'), option('mq-vertex-four', '4', '4 是定义域端点，不是顶点横坐标。')],
          correctOptionIds: ['mq-vertex-two'], knowledgeTags: ['maximum'], skillTag: 'conclusion',
          explanation: [latex('mq-exp-vertex', '(x-2)^2=0\\quad\\Rightarrow\\quad x=2')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-blank-max': {
          id: 'mq-blank-max', answerType: 'single-choice', prompt: 'x=2 时 y 的值是多少？',
          options: [option('mq-max-five', '5'), option('mq-max-one', '1', '这是 x=0 时的值。'), option('mq-max-nine', '9', '请检查配方后的常数项。')],
          correctOptionIds: ['mq-max-five'], knowledgeTags: ['maximum'], skillTag: 'calculation',
          explanation: [latex('mq-exp-max', 'y=-(2-2)^2+5=5')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-final-choice': {
          id: 'mq-final-choice', answerType: 'single-choice', prompt: '回到原题选项，选择最合适的一项。',
          options: [
            option('mq-final-a', 'x=2 秒时，高度最大为 5 m'),
            option('mq-final-b', 'x=0 秒时，高度最大为 1 m', '顶点位于定义域内部，不能只看端点。'),
            option('mq-final-c', 'x=4 秒时，高度最大为 1 m', 'x=4 是端点，不是顶点。'),
            option('mq-final-d', 'x=2 秒时，高度最大为 9 m', '配方后的常数项是 5。'),
          ],
          correctOptionIds: ['mq-final-a'], knowledgeTags: ['maximum'], skillTag: 'conclusion',
          explanation: [text('mq-final-exp', '配方后顶点是 (2,5)，且 x=2 位于定义域内。')], shortPracticeQuestionId: 'math-statistics-01',
        },
      },
      variants: {
        detailed: ['mq-blank-sign', 'mq-blank-vertex', 'mq-blank-max', 'mq-final-choice'],
        standard: ['mq-blank-vertex', 'mq-blank-max', 'mq-final-choice'],
        selfCheck: ['mq-blank-max', 'mq-final-choice'],
      },
    },
    simulation: {
      material: [text('mq-sim-material-1', '在 0≦x≦4 中考虑 y=−x²+4x+1。')],
      items: [
        { id: 'mq-sim-item-1', label: '问题 1', prompt: [text('mq-sim-prompt-1', '选择取得最大值时的 x。')], answerType: 'single-choice', options: [simOption('mq-sim-x-zero', '0'), simOption('mq-sim-x-two', '2'), simOption('mq-sim-x-four', '4')], correctOptionIds: ['mq-sim-x-two'], score: 3, estimatedSeconds: 90, knowledgeTags: ['maximum'], skillTags: ['conclusion'] },
        { id: 'mq-sim-item-2', label: '问题 2', prompt: [text('mq-sim-prompt-2', '输入最大值。')], answerType: 'number', correctValue: 5, tolerance: 0, score: 3, estimatedSeconds: 90, knowledgeTags: ['maximum'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('mq-full-1', '配方得 y=−(x−2)²+5。顶点 x=2 位于定义域内，所以最大值是 5。')],
    relatedQuestions: { sameKnowledge: ['math-statistics-01'], sameMethod: ['math-statistics-01'], reinforcement: ['math-statistics-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'math-statistics-01', revision: 2, status: 'published', subject: 'math-1a', unitType: 'major-question',
    title: '通过对话读取频数分布表与平均数',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '采用共通测试式资料与对话结构' },
    taxonomy: { majorUnit: 'data-analysis', minorUnit: 'frequency-table', knowledgeTags: ['weighted-mean', 'frequency'], skillTags: ['reading', 'calculation', 'conclusion'] },
    difficulty: 'basic', examLevel: 'common-test', estimatedSeconds: 360,
    assets: [],
    stem: [
      text('ms-stem-1', '某班调查了 20 名学生的通学时间，并整理为下表。太郎和花子准备使用各组的组中值估计平均通学时间。'),
      table('ms-stem-table', ['通学时间（分）', '组中值', '频数'], [['0以上10未满', '5', '4'], ['10以上20未满', '15', '8'], ['20以上30未满', '25', '6'], ['30以上40未满', '35', '2']], '通学时间频数分布'),
      text('ms-stem-2', '关于使用组中值求得的平均通学时间，请选择最合适的说明。'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'math-narrative',
      finalBlankId: 'ms-final-choice',
      solutionFlow: [
        { id: 'ms-flow-1', type: 'content', content: [dialogue('ms-flow-text-1', '太郎', '要算平均数，可以先计算每一组的“组中值×频数”，再把它们加起来。先看第一组。')] },
        { id: 'ms-flow-b1', type: 'blank', blankId: 'ms-blank-first-product' },
        { id: 'ms-flow-2', type: 'content', content: [dialogue('ms-flow-text-2', '花子', '对所有组做同样的计算，就能得到乘积总和。')] },
        { id: 'ms-flow-b2', type: 'blank', blankId: 'ms-blank-total' },
        { id: 'ms-flow-3', type: 'content', content: [latex('ms-flow-latex-1', '\\bar{x}=\\frac{\\sum (\\text{组中值}\\times\\text{频数})}{\\sum \\text{频数}}'), dialogue('ms-flow-text-3', '太郎', '分母不是组数，而是数据个数，也就是频数总和。')] },
        { id: 'ms-flow-b3', type: 'blank', blankId: 'ms-blank-divisor' },
        { id: 'ms-flow-b4', type: 'blank', blankId: 'ms-blank-mean' },
        { id: 'ms-flow-4', type: 'content', content: [dialogue('ms-flow-text-4', '花子', '计算结果已经得到，最后回到原来的说明选项确认。')] },
      ],
      blanks: {
        'ms-blank-first-product': { id: 'ms-blank-first-product', answerType: 'single-choice', prompt: '第一组的“组中值×频数”是多少？', options: [option('ms-first-twenty', '20'), option('ms-first-nine', '9', '组中值和频数应该相乘，不是相加。'), option('ms-first-forty', '40', '应使用组中值 5，而不是组上界 10。')], correctOptionIds: ['ms-first-twenty'], knowledgeTags: ['weighted-mean'], skillTag: 'calculation', explanation: [latex('ms-exp-first', '5\\times4=20')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-total': { id: 'ms-blank-total', answerType: 'single-choice', prompt: '所有“组中值×频数”的总和是多少？', options: [option('ms-total-360', '360'), option('ms-total-320', '320', '请不要漏掉最后一组 35×2。'), option('ms-total-400', '400', '请重新检查各组乘积。')], correctOptionIds: ['ms-total-360'], knowledgeTags: ['weighted-mean'], skillTag: 'calculation', explanation: [latex('ms-exp-total', '5\\times4+15\\times8+25\\times6+35\\times2=360')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-divisor': { id: 'ms-blank-divisor', answerType: 'single-choice', prompt: '求平均数时分母是多少？', options: [option('ms-divisor-twenty', '20'), option('ms-divisor-four', '4', '4 是组数，平均数应除以数据个数。'), option('ms-divisor-forty', '40', '应除以人数，而不是最大组界。')], correctOptionIds: ['ms-divisor-twenty'], knowledgeTags: ['frequency'], skillTag: 'reading', explanation: [text('ms-exp-divisor', '频数总和 4+8+6+2=20，就是数据个数。')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-mean': { id: 'ms-blank-mean', answerType: 'single-choice', prompt: '使用组中值求得的平均通学时间是多少？', options: [option('ms-mean-eighteen', '18 分钟'), option('ms-mean-twenty', '20 分钟', '请检查是否把 360 除以了错误的数。'), option('ms-mean-sixteen', '16 分钟', '请检查乘积总和与频数总和。')], correctOptionIds: ['ms-mean-eighteen'], knowledgeTags: ['weighted-mean'], skillTag: 'conclusion', explanation: [latex('ms-exp-mean', '360\\div20=18')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-final-choice': {
          id: 'ms-final-choice', answerType: 'single-choice', prompt: '回到原题选项，选择最合适的一项。',
          options: [
            option('ms-final-a', '使用组中值求得的平均通学时间是 18 分钟'),
            option('ms-final-b', '使用组中值求得的平均通学时间是 20 分钟', '分母应为人数 20，而不是组数。'),
            option('ms-final-c', '使用组中值求得的平均通学时间是 16 分钟', '乘积总和应为 360。'),
            option('ms-final-d', '频数总和是 40', '频数总和是 4+8+6+2=20。'),
          ],
          correctOptionIds: ['ms-final-a'], knowledgeTags: ['weighted-mean'], skillTag: 'conclusion',
          explanation: [text('ms-final-exp', '360 除以 20 得 18 分钟。')], shortPracticeQuestionId: 'math-quadratic-01',
        },
      },
      variants: {
        detailed: ['ms-blank-first-product', 'ms-blank-total', 'ms-blank-divisor', 'ms-blank-mean', 'ms-final-choice'],
        standard: ['ms-blank-total', 'ms-blank-mean', 'ms-final-choice'],
        selfCheck: ['ms-blank-mean', 'ms-final-choice'],
      },
    },
    simulation: {
      material: [table('ms-sim-table', ['组中值', '频数'], [['5', '4'], ['15', '8'], ['25', '6'], ['35', '2']], '通学时间的组中值与频数')],
      items: [
        { id: 'ms-sim-item-1', label: '问题 1', prompt: [text('ms-sim-prompt-1', '选择所有正确说法。')], answerType: 'multi-choice', options: [simOption('ms-sim-opt-a', '频数总和是 20'), simOption('ms-sim-opt-b', '乘积总和是 360'), simOption('ms-sim-opt-c', '平均数是 20 分钟')], correctOptionIds: ['ms-sim-opt-a', 'ms-sim-opt-b'], score: 4, estimatedSeconds: 120, knowledgeTags: ['weighted-mean'], skillTags: ['reading', 'calculation'] },
        { id: 'ms-sim-item-2', label: '问题 2', prompt: [text('ms-sim-prompt-2', '输入平均通学时间。')], answerType: 'number', correctValue: 18, tolerance: 0, score: 3, estimatedSeconds: 90, knowledgeTags: ['weighted-mean'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('ms-full-1', '组中值×频数的总和是 360，频数总和是 20，因此平均通学时间为 18 分钟。')],
    relatedQuestions: { sameKnowledge: ['math-quadratic-01'], sameMethod: ['math-quadratic-01'], reinforcement: ['math-quadratic-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-motion-01', revision: 2, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '计算推导型｜速度–时间图像',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '计算推导型 SVG 学习题' },
    taxonomy: { majorUnit: 'mechanics', minorUnit: 'motion-graph', knowledgeTags: ['velocity-time', 'displacement'], skillTags: ['graph-reading', 'equation-building', 'calculation'] },
    difficulty: 'standard', examLevel: 'common-test', estimatedSeconds: 480,
    assets: [{ id: 'pm-velocity-asset', type: 'image', src: '/assets/velocity-graph.svg', alt: '0到4秒速度从0线性增加到8 m/s，之后到6秒保持不变的速度–时间图像' }],
    stem: [
      text('pm-stem-1', '物体沿直线运动。下图表示时刻 t 与速度 v 的关系。请选择“0～4 秒的加速度”和“0～6 秒的移动距离”的正确组合。'),
      image('pm-stem-image', 'pm-velocity-asset', '速度–时间图像：0–4秒从0线性增加到8 m/s，4–6秒保持8 m/s。', '图1　物体的速度–时间图像'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'calculation-derivation',
      finalBlankId: 'pm-final-choice',
      solutionFlow: [
        { id: 'pm-flow-1', type: 'content', content: [dialogue('pm-flow-text-1', '老师', '先求 0～4 秒的加速度。速度–时间图像的斜率表示什么？')] },
        { id: 'pm-flow-b1', type: 'blank', blankId: 'pm-blank-acceleration' },
        { id: 'pm-flow-2', type: 'content', content: [latex('pm-flow-latex-1', 'a=\\frac{8-0}{4-0}=2\\ \\mathrm{m/s^2}'), dialogue('pm-flow-text-2', '老师', '接着求移动距离。速度–时间图像与时间轴围成的面积，就是对应时间内的移动距离。')] },
        { id: 'pm-flow-b2', type: 'blank', blankId: 'pm-blank-triangle' },
        { id: 'pm-flow-b3', type: 'blank', blankId: 'pm-blank-rectangle' },
        { id: 'pm-flow-3', type: 'content', content: [dialogue('pm-flow-text-3', '老师', '最后把两个区间的面积相加，得到 0～6 秒的移动距离。')] },
        { id: 'pm-flow-b4', type: 'blank', blankId: 'pm-blank-distance' },
        { id: 'pm-flow-4', type: 'content', content: [dialogue('pm-flow-text-4', '老师', '两个所求量都已经得到，现在回到原来的组合选项。')] },
      ],
      blanks: {
        'pm-blank-acceleration': { id: 'pm-blank-acceleration', answerType: 'single-choice', prompt: '0～4 秒的加速度是多少？', options: [option('pm-acc-two', '2 m/s²'), option('pm-acc-four', '4 m/s²', '速度变化量 8 应除以时间 4。'), option('pm-acc-eight', '8 m/s²', '8 是速度变化量，不是加速度。')], correctOptionIds: ['pm-acc-two'], knowledgeTags: ['velocity-time'], skillTag: 'graph-reading', explanation: [latex('pm-exp-acc', 'a=\\frac{8-0}{4-0}=2\\ \\mathrm{m/s^2}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-triangle': { id: 'pm-blank-triangle', answerType: 'single-choice', prompt: '0～4 秒对应三角形的面积是多少？', options: [option('pm-triangle-sixteen', '16 m'), option('pm-triangle-thirtytwo', '32 m', '三角形面积还要乘 1/2。'), option('pm-triangle-eight', '8 m', '还要乘底边 4 秒。')], correctOptionIds: ['pm-triangle-sixteen'], knowledgeTags: ['displacement'], skillTag: 'calculation', explanation: [latex('pm-exp-triangle', '\\frac12\\times4\\times8=16\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-rectangle': { id: 'pm-blank-rectangle', answerType: 'single-choice', prompt: '4～6 秒对应长方形的面积是多少？', options: [option('pm-rectangle-sixteen', '16 m'), option('pm-rectangle-eight', '8 m', '8 m/s 持续了 2 秒。'), option('pm-rectangle-fortyeight', '48 m', '不能把 0～6 秒全部看成匀速 8 m/s。')], correctOptionIds: ['pm-rectangle-sixteen'], knowledgeTags: ['displacement'], skillTag: 'calculation', explanation: [latex('pm-exp-rectangle', '(6-4)\\times8=16\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-distance': { id: 'pm-blank-distance', answerType: 'single-choice', prompt: '0～6 秒的移动距离是多少？', options: [option('pm-distance-thirtytwo', '32 m'), option('pm-distance-twentyfour', '24 m', '请把两个区间的面积都加上。'), option('pm-distance-fortyeight', '48 m', '全程并不是 8 m/s 匀速。')], correctOptionIds: ['pm-distance-thirtytwo'], knowledgeTags: ['displacement'], skillTag: 'conclusion', explanation: [latex('pm-exp-distance', '16+16=32\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-final-choice': {
          id: 'pm-final-choice', answerType: 'single-choice', prompt: '回到原题选项，选择最合适的组合。',
          options: [
            option('pm-final-a', '加速度 2 m/s²，移动距离 32 m'),
            option('pm-final-b', '加速度 2 m/s²，移动距离 48 m', '移动距离是图像下方面积，应为 32 m。'),
            option('pm-final-c', '加速度 4 m/s²，移动距离 32 m', '加速度应为 8÷4=2 m/s²。'),
            option('pm-final-d', '加速度 8 m/s²，移动距离 48 m', '8 是速度变化量，并且全程也不是匀速。'),
          ],
          correctOptionIds: ['pm-final-a'], knowledgeTags: ['velocity-time', 'displacement'], skillTag: 'conclusion',
          explanation: [text('pm-final-exp', '加速度是 2 m/s²，图像下方面积为 16+16=32 m。')], shortPracticeQuestionId: 'physics-circuit-01',
        },
      },
      variants: {
        detailed: ['pm-blank-acceleration', 'pm-blank-triangle', 'pm-blank-rectangle', 'pm-blank-distance', 'pm-final-choice'],
        standard: ['pm-blank-acceleration', 'pm-blank-distance', 'pm-final-choice'],
        selfCheck: ['pm-blank-distance', 'pm-final-choice'],
      },
    },
    simulation: {
      material: [image('pm-sim-image', 'pm-velocity-asset', '0～4秒速度增至8 m/s，4～6秒保持不变的速度–时间图像')],
      items: [
        { id: 'pm-sim-item-1', label: '问题 1', prompt: [text('pm-sim-prompt-1', '输入 0～4 秒的加速度（m/s²）。')], answerType: 'number', correctValue: 2, tolerance: 0.01, score: 3, estimatedSeconds: 90, knowledgeTags: ['velocity-time'], skillTags: ['graph-reading'] },
        { id: 'pm-sim-item-2', label: '问题 2', prompt: [text('pm-sim-prompt-2', '输入 0～6 秒的移动距离（m）。')], answerType: 'number', correctValue: 32, tolerance: 0.01, score: 4, estimatedSeconds: 120, knowledgeTags: ['displacement'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('pm-full-1', '0～4 秒加速度由斜率得 2 m/s²。移动距离等于图像下方面积，三角形 16 m 加长方形 16 m，共 32 m。')],
    relatedQuestions: { sameKnowledge: ['physics-circuit-01'], sameMethod: ['physics-circuit-01'], reinforcement: ['physics-circuit-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-circuit-01', revision: 2, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '现象分析型｜串联与并联电路候选比较',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '现象分析型候选比较题' },
    taxonomy: { majorUnit: 'electricity', minorUnit: 'dc-circuit', knowledgeTags: ['ohms-law', 'series-parallel', 'electric-power'], skillTags: ['condition-reading', 'case-classification', 'law-selection'] },
    difficulty: 'advanced', examLevel: 'common-test', estimatedSeconds: 600,
    assets: [],
    stem: [
      text('pc-stem-1', '两个电阻的阻值都为 R，分别以串联和并联方式接在相同电压 V 的电源上。比较两种情况下的等效电阻、总电流和总功率。'),
      text('pc-stem-2', '请选择“串联等效电阻”“并联等效电阻”“并联总电流÷串联总电流”的正确组合。'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'phenomenon-analysis',
      finalBlankId: 'pc-final-choice',
      solutionFlow: [
        { id: 'pc-flow-1', type: 'content', content: [dialogue('pc-flow-text-1', '太郎', '把候选逐项整理。先看串联，两个电阻直接相加。')] },
        { id: 'pc-flow-b1', type: 'blank', blankId: 'pc-blank-series' },
        { id: 'pc-flow-2', type: 'content', content: [dialogue('pc-flow-text-2', '花子', '再看并联。两个相同电阻，可以由倒数相加求等效电阻。')] },
        { id: 'pc-flow-b2', type: 'blank', blankId: 'pc-blank-parallel' },
        { id: 'pc-flow-3', type: 'content', content: [dialogue('pc-flow-text-3', '太郎', '两种情况下电源电压 V 相同，所以可以用 I=V/R_eq 比较总电流。')] },
        { id: 'pc-flow-b3', type: 'blank', blankId: 'pc-blank-current-ratio' },
        { id: 'pc-flow-4', type: 'content', content: [dialogue('pc-flow-text-4', '花子', '再用 P=VI。电压相同，因此总功率之比与总电流之比相同。')] },
        { id: 'pc-flow-b4', type: 'blank', blankId: 'pc-blank-power-ratio' },
        { id: 'pc-flow-5', type: 'content', content: [dialogue('pc-flow-text-5', '太郎', '各个候选都判断完了，最后回到原来的组合选项。')] },
      ],
      blanks: {
        'pc-blank-series': { id: 'pc-blank-series', answerType: 'single-choice', prompt: '串联时的等效电阻是多少？', options: [option('pc-series-two-r', '2R'), option('pc-series-half-r', 'R/2', 'R/2 是并联时的结果。'), option('pc-series-r', 'R', '串联时电阻相加。')], correctOptionIds: ['pc-series-two-r'], knowledgeTags: ['series-parallel'], skillTag: 'case-classification', explanation: [latex('pc-exp-series', 'R_{\\mathrm{series}}=R+R=2R')], shortPracticeQuestionId: 'physics-magnetic-01' },
        'pc-blank-parallel': { id: 'pc-blank-parallel', answerType: 'single-choice', prompt: '并联时的等效电阻是多少？', options: [option('pc-parallel-half-r', 'R/2'), option('pc-parallel-two-r', '2R', '2R 是串联时的结果。'), option('pc-parallel-r', 'R', '两个相同电阻并联后等效电阻减半。')], correctOptionIds: ['pc-parallel-half-r'], knowledgeTags: ['series-parallel'], skillTag: 'case-classification', explanation: [latex('pc-exp-parallel', '\\frac1{R_{\\mathrm{parallel}}}=\\frac1R+\\frac1R=\\frac2R')], shortPracticeQuestionId: 'physics-magnetic-01' },
        'pc-blank-current-ratio': { id: 'pc-blank-current-ratio', answerType: 'single-choice', prompt: '并联总电流÷串联总电流是多少？', options: [option('pc-current-four', '4'), option('pc-current-two', '2', '等效电阻分别是 2R 和 R/2，所以电流比为 4。'), option('pc-current-half', '1/2', '电流与等效电阻成反比。')], correctOptionIds: ['pc-current-four'], knowledgeTags: ['ohms-law'], skillTag: 'law-selection', explanation: [latex('pc-exp-current', '\\frac{V/(R/2)}{V/(2R)}=4')], shortPracticeQuestionId: 'physics-magnetic-01' },
        'pc-blank-power-ratio': { id: 'pc-blank-power-ratio', answerType: 'single-choice', prompt: '并联总功率÷串联总功率是多少？', options: [option('pc-power-four', '4'), option('pc-power-sixteen', '16', '电压相同且 P=VI，所以功率比与电流比相同。'), option('pc-power-one', '1', '等效电阻不同，总电流和总功率也不同。')], correctOptionIds: ['pc-power-four'], knowledgeTags: ['electric-power'], skillTag: 'law-selection', explanation: [latex('pc-exp-power', 'P=VI\\quad\\Rightarrow\\quad \\frac{P_p}{P_s}=\\frac{I_p}{I_s}=4')], shortPracticeQuestionId: 'physics-magnetic-01' },
        'pc-final-choice': {
          id: 'pc-final-choice', answerType: 'single-choice', prompt: '回到原题选项，选择最合适的组合。',
          options: [
            option('pc-final-a', '串联 2R，并联 R/2，电流比 4'),
            option('pc-final-b', '串联 2R，并联 R/2，电流比 2', '由等效电阻可得电流比为 4。'),
            option('pc-final-c', '串联 R/2，并联 2R，电流比 4', '串联和并联的等效电阻写反了。'),
            option('pc-final-d', '串联 R，并联 R，电流比 1', '连接方式不同，等效电阻会改变。'),
          ],
          correctOptionIds: ['pc-final-a'], knowledgeTags: ['series-parallel', 'ohms-law'], skillTag: 'conclusion',
          explanation: [text('pc-final-exp', '串联为 2R，并联为 R/2；电压相同，所以总电流比为 4。')], shortPracticeQuestionId: 'physics-magnetic-01',
        },
      },
      variants: {
        detailed: ['pc-blank-series', 'pc-blank-parallel', 'pc-blank-current-ratio', 'pc-blank-power-ratio', 'pc-final-choice'],
        standard: ['pc-blank-series', 'pc-blank-parallel', 'pc-blank-current-ratio', 'pc-final-choice'],
        selfCheck: ['pc-blank-current-ratio', 'pc-final-choice'],
      },
    },
    simulation: {
      material: [text('pc-sim-material-1', '使用两个相同电阻 R，在电压 V 不变时比较串联与并联。')],
      items: [
        { id: 'pc-sim-item-1', label: '问题 1', prompt: [text('pc-sim-prompt-1', '选择所有正确关系。')], answerType: 'multi-choice', options: [simOption('pc-sim-opt-a', '串联等效电阻为 2R'), simOption('pc-sim-opt-b', '并联等效电阻为 R/2'), simOption('pc-sim-opt-c', '并联总电流是串联的 2 倍')], correctOptionIds: ['pc-sim-opt-a', 'pc-sim-opt-b'], score: 4, estimatedSeconds: 150, knowledgeTags: ['series-parallel'], skillTags: ['law-selection'] },
        { id: 'pc-sim-item-2', label: '问题 2', prompt: [text('pc-sim-prompt-2', '并联总功率是串联的多少倍？')], answerType: 'number', correctValue: 4, tolerance: 0, score: 4, estimatedSeconds: 120, knowledgeTags: ['electric-power'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('pc-full-1', '串联等效电阻为 2R，并联为 R/2。电压相同，因此总电流与总功率都与等效电阻成反比，并联均为串联的 4 倍。')],
    relatedQuestions: { sameKnowledge: ['physics-magnetic-01'], sameMethod: ['physics-magnetic-01'], reinforcement: ['physics-magnetic-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-magnetic-01', revision: 1, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '关系式分析型｜负电荷与磁场',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '关系式分析型方向与符号题' },
    taxonomy: { majorUnit: 'electromagnetism', minorUnit: 'magnetic-force', knowledgeTags: ['lorentz-force', 'circular-motion'], skillTags: ['condition-reading', 'law-selection', 'conclusion'] },
    difficulty: 'advanced', examLevel: 'common-test', estimatedSeconds: 540,
    assets: [],
    stem: [
      text('mg-stem-1', '一个带负电的粒子以速度 v 向纸面右方运动，匀强磁场 B 指向纸面内。忽略重力。请选择粒子刚进入磁场时所受磁力方向，以及之后运动状态的正确组合。'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'relation-analysis',
      finalBlankId: 'mg-final-choice',
      solutionFlow: [
        { id: 'mg-flow-1', type: 'content', content: [dialogue('mg-flow-text-1', '太郎', '先用一般关系 F=qv×B。先假设是正电荷，判断 v×B 的方向。')] },
        { id: 'mg-flow-b1', type: 'blank', blankId: 'mg-blank-positive-direction' },
        { id: 'mg-flow-2', type: 'content', content: [dialogue('mg-flow-text-2', '花子', '但实际粒子带负电，所以磁力方向与 v×B 相反。')] },
        { id: 'mg-flow-b2', type: 'blank', blankId: 'mg-blank-negative-direction' },
        { id: 'mg-flow-3', type: 'content', content: [dialogue('mg-flow-text-3', '太郎', '磁力始终与速度垂直，因此不做功，速率不变，只改变运动方向。')] },
        { id: 'mg-flow-b3', type: 'blank', blankId: 'mg-blank-speed' },
        { id: 'mg-flow-4', type: 'content', content: [dialogue('mg-flow-text-4', '花子', '粒子一开始受到向下的力，所以轨道圆心在运动方向下方。判断转动方向。')] },
        { id: 'mg-flow-b4', type: 'blank', blankId: 'mg-blank-rotation' },
        { id: 'mg-flow-5', type: 'content', content: [dialogue('mg-flow-text-5', '太郎', '磁力方向、速率与转动方向都确定了，现在回到原选项。')] },
      ],
      blanks: {
        'mg-blank-positive-direction': {
          id: 'mg-blank-positive-direction', answerType: 'single-choice', prompt: '若假设为正电荷，v×B 指向哪里？',
          options: [option('mg-positive-up', '纸面上方'), option('mg-positive-down', '纸面下方', '右方向量叉乘指向纸面内的向量，结果向上。'), option('mg-positive-right', '纸面右方', '磁力方向与速度垂直。')],
          correctOptionIds: ['mg-positive-up'], knowledgeTags: ['lorentz-force'], skillTag: 'law-selection',
          explanation: [text('mg-exp-positive', '用右手定则，向右的 v 与指向纸面内的 B 得到 v×B 向上。')], shortPracticeQuestionId: 'physics-motion-01',
        },
        'mg-blank-negative-direction': {
          id: 'mg-blank-negative-direction', answerType: 'single-choice', prompt: '负电荷实际受到的磁力指向哪里？',
          options: [option('mg-negative-down', '纸面下方'), option('mg-negative-up', '纸面上方', '负电荷的力方向与 v×B 相反。'), option('mg-negative-left', '纸面左方', '磁力方向与速度垂直。')],
          correctOptionIds: ['mg-negative-down'], knowledgeTags: ['lorentz-force'], skillTag: 'condition-reading',
          explanation: [text('mg-exp-negative', '因为 q<0，所以 F=qv×B 与 v×B 方向相反，即向下。')], shortPracticeQuestionId: 'physics-motion-01',
        },
        'mg-blank-speed': {
          id: 'mg-blank-speed', answerType: 'single-choice', prompt: '粒子在磁场中的速率如何变化？',
          options: [option('mg-speed-same', '保持不变'), option('mg-speed-increase', '增大', '磁力与速度垂直，不做功。'), option('mg-speed-decrease', '减小', '磁力不改变动能。')],
          correctOptionIds: ['mg-speed-same'], knowledgeTags: ['circular-motion'], skillTag: 'law-selection',
          explanation: [text('mg-exp-speed', '因为 F⊥v，磁力不做功，速率保持不变。')], shortPracticeQuestionId: 'physics-motion-01',
        },
        'mg-blank-rotation': {
          id: 'mg-blank-rotation', answerType: 'single-choice', prompt: '粒子的轨道最初向哪一侧弯曲？',
          options: [option('mg-rotation-clockwise', '顺时针'), option('mg-rotation-counter', '逆时针', '向右运动并受到向下的力，因此轨道向顺时针方向弯曲。'), option('mg-rotation-straight', '继续直线运动', '存在与速度垂直的磁力，方向会改变。')],
          correctOptionIds: ['mg-rotation-clockwise'], knowledgeTags: ['circular-motion'], skillTag: 'conclusion',
          explanation: [text('mg-exp-rotation', '初速度向右、磁力向下，因此轨道向顺时针方向弯曲。')], shortPracticeQuestionId: 'physics-motion-01',
        },
        'mg-final-choice': {
          id: 'mg-final-choice', answerType: 'single-choice', prompt: '回到原题选项，选择最合适的组合。',
          options: [
            option('mg-final-a', '磁力向下，速率不变，轨道顺时针'),
            option('mg-final-b', '磁力向上，速率不变，轨道逆时针', '负电荷使磁力方向与 v×B 相反。'),
            option('mg-final-c', '磁力向下，速率增大，轨道顺时针', '磁力与速度垂直，不改变速率。'),
            option('mg-final-d', '磁力向左，速率不变，继续直线运动', '磁力与速度垂直，会改变运动方向。'),
          ],
          correctOptionIds: ['mg-final-a'], knowledgeTags: ['lorentz-force', 'circular-motion'], skillTag: 'conclusion',
          explanation: [text('mg-final-exp', '负电荷所受磁力向下，磁力不做功，所以速率不变，轨道顺时针弯曲。')], shortPracticeQuestionId: 'physics-motion-01',
        },
      },
      variants: {
        detailed: ['mg-blank-positive-direction', 'mg-blank-negative-direction', 'mg-blank-speed', 'mg-blank-rotation', 'mg-final-choice'],
        standard: ['mg-blank-negative-direction', 'mg-blank-speed', 'mg-blank-rotation', 'mg-final-choice'],
        selfCheck: ['mg-blank-rotation', 'mg-final-choice'],
      },
    },
    simulation: {
      material: [text('mg-sim-material-1', '负电荷向右运动，磁场指向纸面内。')],
      items: [
        { id: 'mg-sim-item-1', label: '问题 1', prompt: [text('mg-sim-prompt-1', '选择磁力方向。')], answerType: 'single-choice', options: [simOption('mg-sim-up', '向上'), simOption('mg-sim-down', '向下'), simOption('mg-sim-left', '向左')], correctOptionIds: ['mg-sim-down'], score: 3, estimatedSeconds: 90, knowledgeTags: ['lorentz-force'], skillTags: ['law-selection'] },
        { id: 'mg-sim-item-2', label: '问题 2', prompt: [text('mg-sim-prompt-2', '粒子在磁场中的速率如何变化？')], answerType: 'single-choice', options: [simOption('mg-sim-same', '保持不变'), simOption('mg-sim-faster', '增大'), simOption('mg-sim-slower', '减小')], correctOptionIds: ['mg-sim-same'], score: 3, estimatedSeconds: 90, knowledgeTags: ['circular-motion'], skillTags: ['conclusion'] },
      ],
    },
    fullExplanation: [text('mg-full-1', '向右的 v 与指向纸面内的 B 得到 v×B 向上；负电荷使磁力反向，所以实际磁力向下。磁力与速度垂直，不改变速率，轨道顺时针弯曲。')],
    relatedQuestions: { sameKnowledge: ['physics-motion-01'], sameMethod: ['physics-motion-01'], reinforcement: ['physics-motion-01'] },
  },
]

export const builtInQuestionsZh = validateQuestionCatalog(rawQuestionsZh)
