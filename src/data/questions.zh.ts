import { validateQuestionCatalog } from '../domain/questionSchema'

const text = (id: string, value: string) => ({ id, type: 'text' as const, text: value })
const latex = (id: string, value: string, display: 'inline' | 'block' = 'block') => ({ id, type: 'latex' as const, latex: value, display })
const image = (id: string, assetId: string, alt: string, caption?: string) => ({ id, type: 'image' as const, assetId, alt, caption })
const table = (id: string, columns: string[], rows: string[][], caption?: string) => ({ id, type: 'table' as const, columns, rows, caption })
const option = (id: string, label: string, wrongReason = '') => ({
  id,
  content: [text(`${id}-content`, label)],
  misconceptionTags: wrongReason ? ['misconception'] : [],
  wrongReason: wrongReason ? [text(`${id}-reason`, wrongReason)] : [],
})
const simOption = (id: string, label: string) => ({ id, content: [text(`${id}-content`, label)] })

const rawQuestionsZh = [
  {
    schemaVersion: '1.0', questionId: 'math-quadratic-01', revision: 1, status: 'published', subject: 'math-1a', unitType: 'major-question',
    title: '二次函数的最大值',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '为学习训练编写' },
    taxonomy: { majorUnit: 'functions', minorUnit: 'quadratic', knowledgeTags: ['completing-square', 'maximum'], skillTags: ['equation-building', 'calculation'] },
    difficulty: 'standard', examLevel: 'common-test', estimatedSeconds: 360,
    assets: [],
    stem: [
      text('mq-stem-1', '实数 x 在 0 ≤ x ≤ 4 的范围内取值时，求下列二次函数的最大值，以及取得最大值时 x 的值。'),
      latex('mq-stem-2', 'y=-x^2+4x+1'),
    ],
    learning: {
      solutionFlow: [
        { id: 'mq-flow-1', type: 'content', content: [text('mq-flow-text-1', '先对关于 x 的式子进行配方。')] },
        { id: 'mq-flow-b1', type: 'blank', blankId: 'mq-blank-sign' },
        { id: 'mq-flow-2', type: 'content', content: [latex('mq-flow-latex-1', 'y=-(x-2)^2+5')] },
        { id: 'mq-flow-b2', type: 'blank', blankId: 'mq-blank-vertex' },
        { id: 'mq-flow-3', type: 'content', content: [text('mq-flow-text-2', '抛物线的顶点位于定义域 0 ≤ x ≤ 4 内。')] },
        { id: 'mq-flow-b3', type: 'blank', blankId: 'mq-blank-max' },
        { id: 'mq-flow-4', type: 'content', content: [text('mq-flow-text-3', '因此，当 x = 2 时，函数取得最大值 5。')] },
      ],
      blanks: {
        'mq-blank-sign': {
          id: 'mq-blank-sign', answerType: 'single-choice', prompt: '配方后，平方项前面的符号是什么？',
          options: [option('mq-sign-minus', '负（−）'), option('mq-sign-plus', '正（＋）', '原式中 x² 的系数是 −1，所以配方后平方项前仍为负号。')],
          correctOptionIds: ['mq-sign-minus'], knowledgeTags: ['completing-square'], skillTag: 'equation-building',
          explanation: [text('mq-exp-sign', '关键是先把负号提出来：−x²+4x = −(x²−4x)。')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-blank-vertex': {
          id: 'mq-blank-vertex', answerType: 'single-choice', prompt: '抛物线顶点的 x 坐标是多少？',
          options: [option('mq-vertex-two', '2'), option('mq-vertex-minus-two', '−2', '使 (x−2)² = 0 的是 x = 2。'), option('mq-vertex-four', '4', '4 是定义域的端点，不是抛物线的顶点。')],
          correctOptionIds: ['mq-vertex-two'], knowledgeTags: ['maximum'], skillTag: 'conclusion',
          explanation: [latex('mq-exp-vertex', '(x-2)^2\\ge 0\\quad\\Rightarrow\\quad x=2\\text{ 时最小}'), text('mq-exp-vertex-2', '平方项前有负号，所以平方部分最小时，y 反而最大。')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-blank-max': {
          id: 'mq-blank-max', answerType: 'single-choice', prompt: 'y 的最大值是多少？',
          options: [option('mq-max-five', '5'), option('mq-max-one', '1', '这里只计算了端点 x = 0 的函数值。'), option('mq-max-nine', '9', '配方时的常数项计算有误。')],
          correctOptionIds: ['mq-max-five'], knowledgeTags: ['maximum'], skillTag: 'calculation',
          explanation: [text('mq-exp-max', '代入 x = 2 后，平方项为 0，因此 y = 5。')], shortPracticeQuestionId: 'math-statistics-01',
        },
      },
      variants: { detailed: ['mq-blank-sign', 'mq-blank-vertex', 'mq-blank-max'], standard: ['mq-blank-vertex', 'mq-blank-max'], selfCheck: ['mq-blank-max'] },
    },
    simulation: {
      material: [text('mq-sim-material-1', '在 0 ≤ x ≤ 4 的范围内，考虑函数 y = −x² + 4x + 1。')],
      items: [
        { id: 'mq-sim-item-1', label: '问题 1', prompt: [text('mq-sim-prompt-1', '选择函数取得最大值时的 x。')], answerType: 'single-choice', options: [simOption('mq-sim-x-zero', '0'), simOption('mq-sim-x-two', '2'), simOption('mq-sim-x-four', '4')], correctOptionIds: ['mq-sim-x-two'], score: 3, estimatedSeconds: 90, knowledgeTags: ['maximum'], skillTags: ['conclusion'] },
        { id: 'mq-sim-item-2', label: '问题 2', prompt: [text('mq-sim-prompt-2', '用数字填写函数的最大值。')], answerType: 'number', correctValue: 5, tolerance: 0, score: 3, estimatedSeconds: 90, knowledgeTags: ['maximum'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('mq-full-1', '配方得到 y = −(x−2)² + 5。顶点 x = 2 位于定义域内，所以最大值为 5。')],
    relatedQuestions: { sameKnowledge: ['math-statistics-01'], sameMethod: ['math-statistics-01'], reinforcement: ['math-statistics-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'math-statistics-01', revision: 1, status: 'published', subject: 'math-1a', unitType: 'small-question',
    title: '频数分布表与平均数',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '为学习训练编写' },
    taxonomy: { majorUnit: 'data-analysis', minorUnit: 'frequency-table', knowledgeTags: ['weighted-mean', 'frequency'], skillTags: ['reading', 'calculation'] },
    difficulty: 'basic', examLevel: 'foundation', estimatedSeconds: 300,
    assets: [],
    stem: [
      text('ms-stem-1', '把某班 20 名学生的通学时间按组整理如下。使用各组的组中值，估算平均通学时间。'),
      table('ms-stem-table', ['通学时间（分钟）', '组中值', '频数'], [['0 以上且小于 10', '5', '4'], ['10 以上且小于 20', '15', '8'], ['20 以上且小于 30', '25', '6'], ['30 以上且小于 40', '35', '2']], '通学时间的频数分布'),
    ],
    learning: {
      solutionFlow: [
        { id: 'ms-flow-1', type: 'content', content: [text('ms-flow-text-1', '先计算每一组的“组中值 × 频数”。')] },
        { id: 'ms-flow-b1', type: 'blank', blankId: 'ms-blank-first-product' },
        { id: 'ms-flow-b2', type: 'blank', blankId: 'ms-blank-total' },
        { id: 'ms-flow-2', type: 'content', content: [latex('ms-flow-latex-1', '\\bar{x}=\\frac{\\sum (\\text{组中值}\\times\\text{频数})}{\\sum \\text{频数}}')] },
        { id: 'ms-flow-b3', type: 'blank', blankId: 'ms-blank-divisor' },
        { id: 'ms-flow-b4', type: 'blank', blankId: 'ms-blank-mean' },
        { id: 'ms-flow-3', type: 'content', content: [text('ms-flow-text-2', '因此，用组中值估算出的平均通学时间是 18 分钟。')] },
      ],
      blanks: {
        'ms-blank-first-product': { id: 'ms-blank-first-product', answerType: 'single-choice', prompt: '第一组的“组中值 × 频数”是多少？', options: [option('ms-first-twenty', '20'), option('ms-first-nine', '9', '组中值和频数应相乘，不是相加。'), option('ms-first-forty', '40', '应使用组中值 5，而不是该组的上限 10。')], correctOptionIds: ['ms-first-twenty'], knowledgeTags: ['weighted-mean'], skillTag: 'calculation', explanation: [latex('ms-exp-first', '5\\times4=20')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-total': { id: 'ms-blank-total', answerType: 'single-choice', prompt: '各组乘积的总和是多少？', options: [option('ms-total-360', '360'), option('ms-total-320', '320', '漏加了最后一组的 35×2。'), option('ms-total-400', '400', '请确认相乘的是频数，而不是组距。')], correctOptionIds: ['ms-total-360'], knowledgeTags: ['weighted-mean'], skillTag: 'calculation', explanation: [latex('ms-exp-total', '5\\times4+15\\times8+25\\times6+35\\times2=360')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-divisor': { id: 'ms-blank-divisor', answerType: 'single-choice', prompt: '计算平均数时，分母应该是多少？', options: [option('ms-divisor-twenty', '20'), option('ms-divisor-four', '4', '4 是分组数；求平均数时应除以数据总数。'), option('ms-divisor-forty', '40', '应除以总人数，而不是最大组界。')], correctOptionIds: ['ms-divisor-twenty'], knowledgeTags: ['frequency'], skillTag: 'reading', explanation: [text('ms-exp-divisor', '频数之和 4+8+6+2 = 20，也就是数据总数。')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-mean': { id: 'ms-blank-mean', answerType: 'single-choice', prompt: '平均通学时间是多少？', options: [option('ms-mean-eighteen', '18 分钟'), option('ms-mean-twenty', '20 分钟', '这里把 360 除以了分组数或其他数值。'), option('ms-mean-sixteen', '16 分钟', '请重新检查乘积总和或频数总和。')], correctOptionIds: ['ms-mean-eighteen'], knowledgeTags: ['weighted-mean'], skillTag: 'conclusion', explanation: [latex('ms-exp-mean', '360\\div20=18')], shortPracticeQuestionId: 'math-quadratic-01' },
      },
      variants: { detailed: ['ms-blank-first-product', 'ms-blank-total', 'ms-blank-divisor', 'ms-blank-mean'], standard: ['ms-blank-total', 'ms-blank-mean'], selfCheck: ['ms-blank-mean'] },
    },
    simulation: {
      material: [table('ms-sim-table', ['组中值', '频数'], [['5', '4'], ['15', '8'], ['25', '6'], ['35', '2']], '通学时间的组中值与频数')],
      items: [
        { id: 'ms-sim-item-1', label: '问题 1', prompt: [text('ms-sim-prompt-1', '选择所有正确的说法。')], answerType: 'multi-choice', options: [simOption('ms-sim-opt-a', '频数总和是 20'), simOption('ms-sim-opt-b', '乘积总和是 360'), simOption('ms-sim-opt-c', '平均数是 20 分钟')], correctOptionIds: ['ms-sim-opt-a', 'ms-sim-opt-b'], score: 4, estimatedSeconds: 120, knowledgeTags: ['weighted-mean'], skillTags: ['reading', 'calculation'] },
        { id: 'ms-sim-item-2', label: '问题 2', prompt: [text('ms-sim-prompt-2', '用数字填写平均通学时间。')], answerType: 'number', correctValue: 18, tolerance: 0, score: 3, estimatedSeconds: 90, knowledgeTags: ['weighted-mean'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('ms-full-1', '用“组中值 × 频数”的总和 360 除以频数总和 20。不能除以组距或分组数。')],
    relatedQuestions: { sameKnowledge: ['math-quadratic-01'], sameMethod: ['math-quadratic-01'], reinforcement: ['math-quadratic-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-motion-01', revision: 1, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '速度–时间图像的读取',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '包含学习用 SVG 图像' },
    taxonomy: { majorUnit: 'mechanics', minorUnit: 'motion-graph', knowledgeTags: ['velocity-time', 'displacement'], skillTags: ['graph-reading', 'calculation'] },
    difficulty: 'standard', examLevel: 'common-test', estimatedSeconds: 420,
    assets: [{ id: 'pm-velocity-asset', type: 'image', src: '/assets/velocity-graph.svg', alt: '物体从 0 秒到 4 秒匀加速至 8 m/s，之后到 6 秒保持匀速的速度–时间图像' }],
    stem: [
      text('pm-stem-1', '物体沿直线运动。下图表示时刻 t 与速度 v 的关系。分析 0 秒到 6 秒内物体的加速度和移动距离。'),
      image('pm-stem-image', 'pm-velocity-asset', '速度–时间图像：0–4 秒从 0 线性增加到 8 m/s，4–6 秒保持 8 m/s。', '图 1　物体的速度–时间图像'),
    ],
    learning: {
      solutionFlow: [
        { id: 'pm-flow-1', type: 'content', content: [text('pm-flow-text-1', '在 0～4 秒内，图像的斜率表示加速度。')] },
        { id: 'pm-flow-b1', type: 'blank', blankId: 'pm-blank-acceleration' },
        { id: 'pm-flow-2', type: 'content', content: [text('pm-flow-text-2', '移动距离等于速度–时间图像与时间轴围成的面积。')] },
        { id: 'pm-flow-b2', type: 'blank', blankId: 'pm-blank-triangle' },
        { id: 'pm-flow-b3', type: 'blank', blankId: 'pm-blank-rectangle' },
        { id: 'pm-flow-b4', type: 'blank', blankId: 'pm-blank-distance' },
        { id: 'pm-flow-3', type: 'content', content: [text('pm-flow-text-3', '把三角形和长方形的面积相加，得到移动距离 32 m。')] },
      ],
      blanks: {
        'pm-blank-acceleration': { id: 'pm-blank-acceleration', answerType: 'single-choice', prompt: '0～4 秒内的加速度是多少？', options: [option('pm-acc-two', '2 m/s²'), option('pm-acc-four', '4 m/s²', '应将速度变化量 8 除以时间 4。'), option('pm-acc-eight', '8 m/s²', '8 是速度变化量，还需要除以所用时间。')], correctOptionIds: ['pm-acc-two'], knowledgeTags: ['velocity-time'], skillTag: 'graph-reading', explanation: [latex('pm-exp-acc', 'a=\\frac{8-0}{4-0}=2\\ \\mathrm{m/s^2}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-triangle': { id: 'pm-blank-triangle', answerType: 'single-choice', prompt: '0～4 秒内的移动距离是多少？', options: [option('pm-triangle-sixteen', '16 m'), option('pm-triangle-thirtytwo', '32 m', '这部分是三角形面积，需要乘以 1/2。'), option('pm-triangle-eight', '8 m', '不仅要看高度 8，还要乘以底边 4 秒。')], correctOptionIds: ['pm-triangle-sixteen'], knowledgeTags: ['displacement'], skillTag: 'calculation', explanation: [latex('pm-exp-triangle', '\\frac12\\times4\\times8=16\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-rectangle': { id: 'pm-blank-rectangle', answerType: 'single-choice', prompt: '4～6 秒内的移动距离是多少？', options: [option('pm-rectangle-sixteen', '16 m'), option('pm-rectangle-eight', '8 m', '速度 8 m/s 持续了 2 秒。'), option('pm-rectangle-fortyeight', '48 m', '从 0 秒到 6 秒并非始终保持匀速。')], correctOptionIds: ['pm-rectangle-sixteen'], knowledgeTags: ['displacement'], skillTag: 'graph-reading', explanation: [latex('pm-exp-rectangle', '(6-4)\\times8=16\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-distance': { id: 'pm-blank-distance', answerType: 'single-choice', prompt: '0～6 秒内的移动距离是多少？', options: [option('pm-distance-thirtytwo', '32 m'), option('pm-distance-twentyfour', '24 m', '三角形或长方形的面积少算了一部分。'), option('pm-distance-fortyeight', '48 m', '这里把全程都按 8 m/s 的速度计算了。')], correctOptionIds: ['pm-distance-thirtytwo'], knowledgeTags: ['displacement'], skillTag: 'conclusion', explanation: [latex('pm-exp-distance', '16+16=32\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
      },
      variants: { detailed: ['pm-blank-acceleration', 'pm-blank-triangle', 'pm-blank-rectangle', 'pm-blank-distance'], standard: ['pm-blank-acceleration', 'pm-blank-distance'], selfCheck: ['pm-blank-distance'] },
    },
    simulation: {
      material: [image('pm-sim-image', 'pm-velocity-asset', '速度在 0～4 秒内增加到 8 m/s，并在 4～6 秒内保持不变的速度–时间图像')],
      items: [
        { id: 'pm-sim-item-1', label: '问题 1', prompt: [text('pm-sim-prompt-1', '填写 0～4 秒内的加速度（m/s²）。')], answerType: 'number', correctValue: 2, tolerance: 0.01, score: 3, estimatedSeconds: 90, knowledgeTags: ['velocity-time'], skillTags: ['graph-reading'] },
        { id: 'pm-sim-item-2', label: '问题 2', prompt: [text('pm-sim-prompt-2', '填写 0～6 秒内的移动距离（m）。')], answerType: 'number', correctValue: 32, tolerance: 0.01, score: 4, estimatedSeconds: 120, knowledgeTags: ['displacement'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('pm-full-1', '加速度等于图像的斜率，移动距离等于图像下方的面积。0～4 秒对应三角形 16 m，4～6 秒对应长方形 16 m。')],
    relatedQuestions: { sameKnowledge: ['physics-circuit-01'], sameMethod: ['physics-circuit-01'], reinforcement: ['physics-circuit-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-circuit-01', revision: 1, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '长题：串联与并联电路的测量方案',
    source: { type: 'original', label: '共通 STEP 原创题', rightsNote: '按照共通测试的长题形式编写' },
    taxonomy: { majorUnit: 'electricity', minorUnit: 'dc-circuit', knowledgeTags: ['ohms-law', 'series-parallel', 'electric-power'], skillTags: ['condition-reading', 'law-selection', 'unit'] },
    difficulty: 'advanced', examLevel: 'challenge', estimatedSeconds: 600,
    assets: [],
    stem: [
      text('pc-stem-1', '学生 A 和学生 B 使用两个阻值均为 R 的电阻器，以及一个内阻可忽略的电源进行实验。先把两个电阻串联，再改为并联；两种情况下电源电压 V 均保持不变。假设电流表的内阻足够小，电压表的内阻足够大。'),
      text('pc-stem-2', 'A 认为“只比较通过整个电路的电流即可”。B 指出，如果不比较每个电阻两端的电压和消耗的功率，就无法完整解释测量结果的差异。下面按照仪表连接、等效电阻、电流和功率的顺序整理。'),
      latex('pc-stem-3', 'I=\\frac{V}{R_{\\mathrm{eq}}},\\qquad P=VI=I^2R'),
    ],
    learning: {
      solutionFlow: [
        { id: 'pc-flow-1', type: 'content', content: [text('pc-flow-text-1', '电流表应串联在待测支路中，电压表应并联在待测部分两端。')] },
        { id: 'pc-flow-b1', type: 'blank', blankId: 'pc-blank-ammeter' },
        { id: 'pc-flow-2', type: 'content', content: [text('pc-flow-text-2', '两个电阻的阻值相同，均为 R。比较串联和并联时的等效电阻。')] },
        { id: 'pc-flow-b2', type: 'blank', blankId: 'pc-blank-series' },
        { id: 'pc-flow-b3', type: 'blank', blankId: 'pc-blank-parallel' },
        { id: 'pc-flow-b4', type: 'blank', blankId: 'pc-blank-current-ratio' },
        { id: 'pc-flow-3', type: 'content', content: [text('pc-flow-text-3', '电源电压相同时，可用 P = V²/R_eq 比较整个电路消耗的功率。')] },
        { id: 'pc-flow-b5', type: 'blank', blankId: 'pc-blank-power-ratio' },
        { id: 'pc-flow-b6', type: 'blank', blankId: 'pc-blank-unit' },
        { id: 'pc-flow-4', type: 'content', content: [text('pc-flow-text-4', '因此，并联电路的总电流和总功率都是串联电路的 4 倍，功率的单位是 W。')] },
      ],
      blanks: {
        'pc-blank-ammeter': { id: 'pc-blank-ammeter', answerType: 'single-choice', prompt: '电流表的正确接法是什么？', options: [option('pc-ammeter-series', '串联在待测支路中'), option('pc-ammeter-parallel', '与电阻器并联', '电流表内阻很小，若直接并联可能产生危险的大电流。')], correctOptionIds: ['pc-ammeter-series'], knowledgeTags: ['series-parallel'], skillTag: 'condition-reading', explanation: [text('pc-exp-ammeter', '为了让待测电流本身通过电流表，应将电流表串联接入电路。')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-series': { id: 'pc-blank-series', answerType: 'single-choice', prompt: '串联时的等效电阻是多少？', options: [option('pc-series-two-r', '2R'), option('pc-series-half-r', 'R/2', 'R/2 是两个相同电阻并联时的等效电阻。'), option('pc-series-r', 'R', '串联时应把各电阻值相加。')], correctOptionIds: ['pc-series-two-r'], knowledgeTags: ['series-parallel'], skillTag: 'law-selection', explanation: [latex('pc-exp-series', 'R_{\\mathrm{series}}=R+R=2R')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-parallel': { id: 'pc-blank-parallel', answerType: 'single-choice', prompt: '并联时的等效电阻是多少？', options: [option('pc-parallel-half-r', 'R/2'), option('pc-parallel-two-r', '2R', '2R 是串联时的等效电阻。'), option('pc-parallel-r', 'R', '两个相同电阻并联后，等效电阻会变小。')], correctOptionIds: ['pc-parallel-half-r'], knowledgeTags: ['series-parallel'], skillTag: 'equation-building', explanation: [latex('pc-exp-parallel', '\\frac1{R_{\\mathrm{parallel}}}=\\frac1R+\\frac1R=\\frac2R')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-current-ratio': { id: 'pc-blank-current-ratio', answerType: 'single-choice', prompt: '并联电路的总电流是串联电路的多少倍？', options: [option('pc-current-four', '4 倍'), option('pc-current-two', '2 倍', '两种等效电阻分别是 2R 和 R/2，所以电流比是 4。'), option('pc-current-half', '1/2 倍', '总电流与等效电阻成反比。')], correctOptionIds: ['pc-current-four'], knowledgeTags: ['ohms-law'], skillTag: 'calculation', explanation: [latex('pc-exp-current', '\\frac{V/(R/2)}{V/(2R)}=4')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-power-ratio': { id: 'pc-blank-power-ratio', answerType: 'single-choice', prompt: '总功率之比（并联 ÷ 串联）是多少？', options: [option('pc-power-four', '4'), option('pc-power-sixteen', '16', '电源电压不变时 P = VI，所以功率比与电流比相同，都是 4。'), option('pc-power-one', '1', '等效电阻不同，总电流和总功率都会改变。')], correctOptionIds: ['pc-power-four'], knowledgeTags: ['electric-power'], skillTag: 'law-selection', explanation: [latex('pc-exp-power', 'P=\\frac{V^2}{R_{\\mathrm{eq}}}\\quad\\Rightarrow\\quad \\frac{P_p}{P_s}=4')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-unit': { id: 'pc-blank-unit', answerType: 'single-choice', prompt: '功率的 SI 单位是什么？', options: [option('pc-unit-watt', 'W（瓦特）'), option('pc-unit-joule', 'J（焦耳）', 'J 是能量的单位。'), option('pc-unit-ampere', 'A（安培）', 'A 是电流的单位。')], correctOptionIds: ['pc-unit-watt'], knowledgeTags: ['electric-power'], skillTag: 'unit', explanation: [text('pc-exp-unit', '功率表示单位时间内转化的能量，1 W = 1 J/s。')], shortPracticeQuestionId: 'physics-motion-01' },
      },
      variants: { detailed: ['pc-blank-ammeter', 'pc-blank-series', 'pc-blank-parallel', 'pc-blank-current-ratio', 'pc-blank-power-ratio', 'pc-blank-unit'], standard: ['pc-blank-series', 'pc-blank-parallel', 'pc-blank-power-ratio'], selfCheck: ['pc-blank-current-ratio', 'pc-blank-power-ratio'] },
    },
    simulation: {
      material: [text('pc-sim-material-1', '使用两个相同电阻 R，在电源电压 V 不变的条件下，比较串联和并联两种接法。')],
      items: [
        { id: 'pc-sim-item-1', label: '问题 1', prompt: [text('pc-sim-prompt-1', '选择所有正确的关系。')], answerType: 'multi-choice', options: [simOption('pc-sim-opt-a', '串联等效电阻为 2R'), simOption('pc-sim-opt-b', '并联等效电阻为 R/2'), simOption('pc-sim-opt-c', '并联总电流是串联总电流的 2 倍')], correctOptionIds: ['pc-sim-opt-a', 'pc-sim-opt-b'], score: 4, estimatedSeconds: 150, knowledgeTags: ['series-parallel'], skillTags: ['law-selection'] },
        { id: 'pc-sim-item-2', label: '问题 2', prompt: [text('pc-sim-prompt-2', '并联电路的总功率是串联电路的多少倍？')], answerType: 'number', correctValue: 4, tolerance: 0, score: 4, estimatedSeconds: 120, knowledgeTags: ['electric-power'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('pc-full-1', '电压相同时，等效电阻越小，总电流和总功率越大。串联为 2R，并联为 R/2，所以两者之比为 4。')],
    relatedQuestions: { sameKnowledge: ['physics-motion-01'], sameMethod: ['physics-motion-01'], reinforcement: ['physics-motion-01'] },
  },
]

export const builtInQuestionsZh = validateQuestionCatalog(rawQuestionsZh)
