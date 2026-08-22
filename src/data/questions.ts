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

const rawQuestions = [
  {
    schemaVersion: '1.0', questionId: 'math-quadratic-01', revision: 1, status: 'published', subject: 'math-1a', unitType: 'major-question',
    title: '二次関数の最大値',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '学習用に作成' },
    taxonomy: { majorUnit: 'functions', minorUnit: 'quadratic', knowledgeTags: ['completing-square', 'maximum'], skillTags: ['equation-building', 'calculation'] },
    difficulty: 'standard', examLevel: 'common-test', estimatedSeconds: 360,
    assets: [],
    stem: [
      text('mq-stem-1', '実数 x が 0 ≦ x ≦ 4 の範囲を動くとき、次の二次関数の最大値と、そのときの x の値を求めよ。'),
      latex('mq-stem-2', 'y=-x^2+4x+1'),
    ],
    learning: {
      solutionFlow: [
        { id: 'mq-flow-1', type: 'content', content: [text('mq-flow-text-1', 'まず、x に関する式を平方完成する。')] },
        { id: 'mq-flow-b1', type: 'blank', blankId: 'mq-blank-sign' },
        { id: 'mq-flow-2', type: 'content', content: [latex('mq-flow-latex-1', 'y=-(x-2)^2+5')] },
        { id: 'mq-flow-b2', type: 'blank', blankId: 'mq-blank-vertex' },
        { id: 'mq-flow-3', type: 'content', content: [text('mq-flow-text-2', '頂点は定義域 0 ≦ x ≦ 4 の中にある。')] },
        { id: 'mq-flow-b3', type: 'blank', blankId: 'mq-blank-max' },
        { id: 'mq-flow-4', type: 'content', content: [text('mq-flow-text-3', 'したがって、x = 2 のとき最大値は 5 である。')] },
      ],
      blanks: {
        'mq-blank-sign': {
          id: 'mq-blank-sign', answerType: 'single-choice', prompt: '平方完成後の二乗項の符号は？',
          options: [option('mq-sign-minus', '負（−）'), option('mq-sign-plus', '正（＋）', '元の x² の係数は −1 なので、平方完成後も二乗項の前は負です。')],
          correctOptionIds: ['mq-sign-minus'], knowledgeTags: ['completing-square'], skillTag: 'equation-building',
          explanation: [text('mq-exp-sign', '−x²+4x = −(x²−4x) と、まず負号を外に出すことが要点です。')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-blank-vertex': {
          id: 'mq-blank-vertex', answerType: 'single-choice', prompt: '放物線の頂点の x 座標は？',
          options: [option('mq-vertex-two', '2'), option('mq-vertex-minus-two', '−2', '(x−2)² = 0 となるのは x = 2 です。'), option('mq-vertex-four', '4', '4 は定義域の端点で、頂点ではありません。')],
          correctOptionIds: ['mq-vertex-two'], knowledgeTags: ['maximum'], skillTag: 'conclusion',
          explanation: [latex('mq-exp-vertex', '(x-2)^2\\ge 0\\quad\\Rightarrow\\quad x=2\\text{ で最小}'), text('mq-exp-vertex-2', '二乗項に負号があるため、二乗部分が最小のとき y は最大になります。')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-blank-max': {
          id: 'mq-blank-max', answerType: 'single-choice', prompt: 'y の最大値は？',
          options: [option('mq-max-five', '5'), option('mq-max-one', '1', 'x = 0 の端点の値だけを見ています。'), option('mq-max-nine', '9', '平方完成の定数項を誤っています。')],
          correctOptionIds: ['mq-max-five'], knowledgeTags: ['maximum'], skillTag: 'calculation',
          explanation: [text('mq-exp-max', 'x = 2 を代入すると、二乗項が 0 になり y = 5 です。')], shortPracticeQuestionId: 'math-statistics-01',
        },
      },
      variants: { detailed: ['mq-blank-sign', 'mq-blank-vertex', 'mq-blank-max'], standard: ['mq-blank-vertex', 'mq-blank-max'], selfCheck: ['mq-blank-max'] },
    },
    simulation: {
      material: [text('mq-sim-material-1', '0 ≦ x ≦ 4 において y = −x² + 4x + 1 を考える。')],
      items: [
        { id: 'mq-sim-item-1', label: '問1', prompt: [text('mq-sim-prompt-1', '最大値をとる x を選べ。')], answerType: 'single-choice', options: [simOption('mq-sim-x-zero', '0'), simOption('mq-sim-x-two', '2'), simOption('mq-sim-x-four', '4')], correctOptionIds: ['mq-sim-x-two'], score: 3, estimatedSeconds: 90, knowledgeTags: ['maximum'], skillTags: ['conclusion'] },
        { id: 'mq-sim-item-2', label: '問2', prompt: [text('mq-sim-prompt-2', '最大値を数値で入力せよ。')], answerType: 'number', correctValue: 5, tolerance: 0, score: 3, estimatedSeconds: 90, knowledgeTags: ['maximum'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('mq-full-1', '平方完成すると y = −(x−2)² + 5。頂点 x = 2 は定義域内なので最大値は 5。')],
    relatedQuestions: { sameKnowledge: ['math-statistics-01'], sameMethod: ['math-statistics-01'], reinforcement: ['math-statistics-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'math-statistics-01', revision: 1, status: 'published', subject: 'math-1a', unitType: 'small-question',
    title: '度数分布表と平均値',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '学習用に作成' },
    taxonomy: { majorUnit: 'data-analysis', minorUnit: 'frequency-table', knowledgeTags: ['weighted-mean', 'frequency'], skillTags: ['reading', 'calculation'] },
    difficulty: 'basic', examLevel: 'foundation', estimatedSeconds: 300,
    assets: [],
    stem: [
      text('ms-stem-1', 'あるクラス 20 人の通学時間を階級ごとに整理した。各階級の階級値を用いて平均通学時間を求める。'),
      table('ms-stem-table', ['通学時間（分）', '階級値', '度数'], [['0以上10未満', '5', '4'], ['10以上20未満', '15', '8'], ['20以上30未満', '25', '6'], ['30以上40未満', '35', '2']], '通学時間の度数分布'),
    ],
    learning: {
      solutionFlow: [
        { id: 'ms-flow-1', type: 'content', content: [text('ms-flow-text-1', '階級値と度数の積を各行で求める。')] },
        { id: 'ms-flow-b1', type: 'blank', blankId: 'ms-blank-first-product' },
        { id: 'ms-flow-b2', type: 'blank', blankId: 'ms-blank-total' },
        { id: 'ms-flow-2', type: 'content', content: [latex('ms-flow-latex-1', '\\bar{x}=\\frac{\\sum (\\text{階級値}\\times\\text{度数})}{\\sum \\text{度数}}')] },
        { id: 'ms-flow-b3', type: 'blank', blankId: 'ms-blank-divisor' },
        { id: 'ms-flow-b4', type: 'blank', blankId: 'ms-blank-mean' },
        { id: 'ms-flow-3', type: 'content', content: [text('ms-flow-text-2', 'したがって、階級値による平均通学時間は 18 分である。')] },
      ],
      blanks: {
        'ms-blank-first-product': { id: 'ms-blank-first-product', answerType: 'single-choice', prompt: '最初の階級の「階級値×度数」は？', options: [option('ms-first-twenty', '20'), option('ms-first-nine', '9', '階級値と度数は足すのではなく掛けます。'), option('ms-first-forty', '40', '階級の上端 10 を使わず、階級値 5 を使います。')], correctOptionIds: ['ms-first-twenty'], knowledgeTags: ['weighted-mean'], skillTag: 'calculation', explanation: [latex('ms-exp-first', '5\\times4=20')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-total': { id: 'ms-blank-total', answerType: 'single-choice', prompt: '積の合計は？', options: [option('ms-total-360', '360'), option('ms-total-320', '320', '最後の階級 35×2 を加え忘れています。'), option('ms-total-400', '400', '度数ではなく階級幅を掛けていないか確認してください。')], correctOptionIds: ['ms-total-360'], knowledgeTags: ['weighted-mean'], skillTag: 'calculation', explanation: [latex('ms-exp-total', '5\\times4+15\\times8+25\\times6+35\\times2=360')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-divisor': { id: 'ms-blank-divisor', answerType: 'single-choice', prompt: '平均を求めるときの分母は？', options: [option('ms-divisor-twenty', '20'), option('ms-divisor-four', '4', '4 は階級の個数です。平均ではデータ数で割ります。'), option('ms-divisor-forty', '40', '階級の最大端ではなく人数で割ります。')], correctOptionIds: ['ms-divisor-twenty'], knowledgeTags: ['frequency'], skillTag: 'reading', explanation: [text('ms-exp-divisor', '度数の合計 4+8+6+2 = 20 がデータ数です。')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-mean': { id: 'ms-blank-mean', answerType: 'single-choice', prompt: '平均通学時間は？', options: [option('ms-mean-eighteen', '18 分'), option('ms-mean-twenty', '20 分', '360 を階級数や別の値で割っています。'), option('ms-mean-sixteen', '16 分', '積の合計または度数合計を再確認してください。')], correctOptionIds: ['ms-mean-eighteen'], knowledgeTags: ['weighted-mean'], skillTag: 'conclusion', explanation: [latex('ms-exp-mean', '360\\div20=18')], shortPracticeQuestionId: 'math-quadratic-01' },
      },
      variants: { detailed: ['ms-blank-first-product', 'ms-blank-total', 'ms-blank-divisor', 'ms-blank-mean'], standard: ['ms-blank-total', 'ms-blank-mean'], selfCheck: ['ms-blank-mean'] },
    },
    simulation: {
      material: [table('ms-sim-table', ['階級値', '度数'], [['5', '4'], ['15', '8'], ['25', '6'], ['35', '2']], '通学時間の階級値と度数')],
      items: [
        { id: 'ms-sim-item-1', label: '問1', prompt: [text('ms-sim-prompt-1', '正しい説明をすべて選べ。')], answerType: 'multi-choice', options: [simOption('ms-sim-opt-a', '度数の合計は 20'), simOption('ms-sim-opt-b', '積の合計は 360'), simOption('ms-sim-opt-c', '平均は 20 分')], correctOptionIds: ['ms-sim-opt-a', 'ms-sim-opt-b'], score: 4, estimatedSeconds: 120, knowledgeTags: ['weighted-mean'], skillTags: ['reading', 'calculation'] },
        { id: 'ms-sim-item-2', label: '問2', prompt: [text('ms-sim-prompt-2', '平均を数値で入力せよ。')], answerType: 'number', correctValue: 18, tolerance: 0, score: 3, estimatedSeconds: 90, knowledgeTags: ['weighted-mean'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('ms-full-1', '階級値×度数の総和 360 を、度数の総和 20 で割る。階級幅や階級数では割らない。')],
    relatedQuestions: { sameKnowledge: ['math-quadratic-01'], sameMethod: ['math-quadratic-01'], reinforcement: ['math-quadratic-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-motion-01', revision: 1, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '速度–時間グラフの読み取り',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '学習用 SVG を含む' },
    taxonomy: { majorUnit: 'mechanics', minorUnit: 'motion-graph', knowledgeTags: ['velocity-time', 'displacement'], skillTags: ['graph-reading', 'calculation'] },
    difficulty: 'standard', examLevel: 'common-test', estimatedSeconds: 420,
    assets: [{ id: 'pm-velocity-asset', type: 'image', src: '/assets/velocity-graph.svg', alt: '0秒から4秒まで速度が直線的に8 m/sへ増加し、その後6秒まで一定の速度–時間グラフ' }],
    stem: [
      text('pm-stem-1', '物体が一直線上を運動する。下図は、時刻 t と速度 v の関係を表す。0 秒から 6 秒までの加速度と移動距離を考える。'),
      image('pm-stem-image', 'pm-velocity-asset', '速度–時間グラフ。0–4秒は0から8 m/sまで直線増加、4–6秒は8 m/s一定。', '図1　物体の速度–時間グラフ'),
    ],
    learning: {
      solutionFlow: [
        { id: 'pm-flow-1', type: 'content', content: [text('pm-flow-text-1', '0〜4 秒ではグラフの傾きが加速度を表す。')] },
        { id: 'pm-flow-b1', type: 'blank', blankId: 'pm-blank-acceleration' },
        { id: 'pm-flow-2', type: 'content', content: [text('pm-flow-text-2', '移動距離は速度–時間グラフと時間軸に囲まれた面積である。')] },
        { id: 'pm-flow-b2', type: 'blank', blankId: 'pm-blank-triangle' },
        { id: 'pm-flow-b3', type: 'blank', blankId: 'pm-blank-rectangle' },
        { id: 'pm-flow-b4', type: 'blank', blankId: 'pm-blank-distance' },
        { id: 'pm-flow-3', type: 'content', content: [text('pm-flow-text-3', '三角形と長方形の面積を合計して、移動距離は 32 m となる。')] },
      ],
      blanks: {
        'pm-blank-acceleration': { id: 'pm-blank-acceleration', answerType: 'single-choice', prompt: '0〜4 秒の加速度は？', options: [option('pm-acc-two', '2 m/s²'), option('pm-acc-four', '4 m/s²', '速度変化 8 を時間 4 で割ります。'), option('pm-acc-eight', '8 m/s²', '8 は速度の変化量です。時間で割ってください。')], correctOptionIds: ['pm-acc-two'], knowledgeTags: ['velocity-time'], skillTag: 'graph-reading', explanation: [latex('pm-exp-acc', 'a=\\frac{8-0}{4-0}=2\\ \\mathrm{m/s^2}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-triangle': { id: 'pm-blank-triangle', answerType: 'single-choice', prompt: '0〜4 秒の移動距離は？', options: [option('pm-triangle-sixteen', '16 m'), option('pm-triangle-thirtytwo', '32 m', '三角形の面積なので 1/2 を掛けます。'), option('pm-triangle-eight', '8 m', '高さだけでなく底辺 4 秒も掛けます。')], correctOptionIds: ['pm-triangle-sixteen'], knowledgeTags: ['displacement'], skillTag: 'calculation', explanation: [latex('pm-exp-triangle', '\\frac12\\times4\\times8=16\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-rectangle': { id: 'pm-blank-rectangle', answerType: 'single-choice', prompt: '4〜6 秒の移動距離は？', options: [option('pm-rectangle-sixteen', '16 m'), option('pm-rectangle-eight', '8 m', '一定速度 8 m/s が 2 秒続きます。'), option('pm-rectangle-fortyeight', '48 m', '0 秒から 6 秒まで一定速度ではありません。')], correctOptionIds: ['pm-rectangle-sixteen'], knowledgeTags: ['displacement'], skillTag: 'graph-reading', explanation: [latex('pm-exp-rectangle', '(6-4)\\times8=16\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-distance': { id: 'pm-blank-distance', answerType: 'single-choice', prompt: '0〜6 秒の移動距離は？', options: [option('pm-distance-thirtytwo', '32 m'), option('pm-distance-twentyfour', '24 m', '三角形または長方形の面積が不足しています。'), option('pm-distance-fortyeight', '48 m', '全時間を速度 8 m/s として計算しています。')], correctOptionIds: ['pm-distance-thirtytwo'], knowledgeTags: ['displacement'], skillTag: 'conclusion', explanation: [latex('pm-exp-distance', '16+16=32\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
      },
      variants: { detailed: ['pm-blank-acceleration', 'pm-blank-triangle', 'pm-blank-rectangle', 'pm-blank-distance'], standard: ['pm-blank-acceleration', 'pm-blank-distance'], selfCheck: ['pm-blank-distance'] },
    },
    simulation: {
      material: [image('pm-sim-image', 'pm-velocity-asset', '0〜4秒で8 m/sまで増加し4〜6秒は一定の速度–時間グラフ')],
      items: [
        { id: 'pm-sim-item-1', label: '問1', prompt: [text('pm-sim-prompt-1', '0〜4 秒の加速度を入力せよ（m/s²）。')], answerType: 'number', correctValue: 2, tolerance: 0.01, score: 3, estimatedSeconds: 90, knowledgeTags: ['velocity-time'], skillTags: ['graph-reading'] },
        { id: 'pm-sim-item-2', label: '問2', prompt: [text('pm-sim-prompt-2', '0〜6 秒の移動距離を入力せよ（m）。')], answerType: 'number', correctValue: 32, tolerance: 0.01, score: 4, estimatedSeconds: 120, knowledgeTags: ['displacement'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('pm-full-1', '加速度はグラフの傾き、移動距離は面積。0〜4 秒は三角形 16 m、4〜6 秒は長方形 16 m。')],
    relatedQuestions: { sameKnowledge: ['physics-circuit-01'], sameMethod: ['physics-circuit-01'], reinforcement: ['physics-circuit-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-circuit-01', revision: 1, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '長文：直列・並列回路の測定計画',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '共通テスト形式を意識した長文' },
    taxonomy: { majorUnit: 'electricity', minorUnit: 'dc-circuit', knowledgeTags: ['ohms-law', 'series-parallel', 'electric-power'], skillTags: ['condition-reading', 'law-selection', 'unit'] },
    difficulty: 'advanced', examLevel: 'challenge', estimatedSeconds: 600,
    assets: [],
    stem: [
      text('pc-stem-1', '生徒 A と生徒 B は、同じ抵抗値 R をもつ二つの抵抗器と、内部抵抗を無視できる電源を用いて実験した。はじめに二つの抵抗器を直列につなぎ、次に並列につなぎ替えた。どちらの場合も電源電圧 V は一定に保った。電流計の内部抵抗は十分小さく、電圧計の内部抵抗は十分大きいものとする。'),
      text('pc-stem-2', 'A は「回路全体を流れる電流だけを比べればよい」と考えた。B は、各抵抗器にかかる電圧と消費電力も比較しなければ、測定値の違いを説明できないと指摘した。以下では、計器の接続位置、合成抵抗、電流、電力の順に整理する。'),
      latex('pc-stem-3', 'I=\\frac{V}{R_{\\mathrm{eq}}},\\qquad P=VI=I^2R'),
    ],
    learning: {
      solutionFlow: [
        { id: 'pc-flow-1', type: 'content', content: [text('pc-flow-text-1', '電流計は測りたい枝に直列、電圧計は測りたい部分に並列に接続する。')] },
        { id: 'pc-flow-b1', type: 'blank', blankId: 'pc-blank-ammeter' },
        { id: 'pc-flow-2', type: 'content', content: [text('pc-flow-text-2', '同じ抵抗 R が二つあるので、直列と並列の合成抵抗を比較する。')] },
        { id: 'pc-flow-b2', type: 'blank', blankId: 'pc-blank-series' },
        { id: 'pc-flow-b3', type: 'blank', blankId: 'pc-blank-parallel' },
        { id: 'pc-flow-b4', type: 'blank', blankId: 'pc-blank-current-ratio' },
        { id: 'pc-flow-3', type: 'content', content: [text('pc-flow-text-3', '電源電圧が同じなら、回路全体の消費電力は P = V²/R_eq で比べられる。')] },
        { id: 'pc-flow-b5', type: 'blank', blankId: 'pc-blank-power-ratio' },
        { id: 'pc-flow-b6', type: 'blank', blankId: 'pc-blank-unit' },
        { id: 'pc-flow-4', type: 'content', content: [text('pc-flow-text-4', 'よって、並列回路では直列回路の 4 倍の全電流と全消費電力になり、電力の単位は W である。')] },
      ],
      blanks: {
        'pc-blank-ammeter': { id: 'pc-blank-ammeter', answerType: 'single-choice', prompt: '電流計の正しい接続は？', options: [option('pc-ammeter-series', '測定する枝に直列'), option('pc-ammeter-parallel', '抵抗器に並列', '電流計を並列につなぐと、内部抵抗が小さいため大電流が流れる危険があります。')], correctOptionIds: ['pc-ammeter-series'], knowledgeTags: ['series-parallel'], skillTag: 'condition-reading', explanation: [text('pc-exp-ammeter', '電流計には測りたい電流そのものを通すため、回路へ直列に挿入します。')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-series': { id: 'pc-blank-series', answerType: 'single-choice', prompt: '直列の合成抵抗は？', options: [option('pc-series-two-r', '2R'), option('pc-series-half-r', 'R/2', 'R/2 は同じ抵抗二つの並列合成です。'), option('pc-series-r', 'R', '直列では抵抗値を加えます。')], correctOptionIds: ['pc-series-two-r'], knowledgeTags: ['series-parallel'], skillTag: 'law-selection', explanation: [latex('pc-exp-series', 'R_{\\mathrm{series}}=R+R=2R')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-parallel': { id: 'pc-blank-parallel', answerType: 'single-choice', prompt: '並列の合成抵抗は？', options: [option('pc-parallel-half-r', 'R/2'), option('pc-parallel-two-r', '2R', '2R は直列合成です。'), option('pc-parallel-r', 'R', '同じ抵抗を並列にすると合成抵抗は小さくなります。')], correctOptionIds: ['pc-parallel-half-r'], knowledgeTags: ['series-parallel'], skillTag: 'equation-building', explanation: [latex('pc-exp-parallel', '\\frac1{R_{\\mathrm{parallel}}}=\\frac1R+\\frac1R=\\frac2R')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-current-ratio': { id: 'pc-blank-current-ratio', answerType: 'single-choice', prompt: '並列回路の全電流は直列回路の何倍？', options: [option('pc-current-four', '4 倍'), option('pc-current-two', '2 倍', '合成抵抗は 2R と R/2 なので比は 4 です。'), option('pc-current-half', '1/2 倍', '電流は合成抵抗に反比例します。')], correctOptionIds: ['pc-current-four'], knowledgeTags: ['ohms-law'], skillTag: 'calculation', explanation: [latex('pc-exp-current', '\\frac{V/(R/2)}{V/(2R)}=4')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-power-ratio': { id: 'pc-blank-power-ratio', answerType: 'single-choice', prompt: '全消費電力の比（並列÷直列）は？', options: [option('pc-power-four', '4'), option('pc-power-sixteen', '16', '電源電圧一定では P = VI。電流比と同じ 4 です。'), option('pc-power-one', '1', '合成抵抗が異なるため、全電流も電力も変わります。')], correctOptionIds: ['pc-power-four'], knowledgeTags: ['electric-power'], skillTag: 'law-selection', explanation: [latex('pc-exp-power', 'P=\\frac{V^2}{R_{\\mathrm{eq}}}\\quad\\Rightarrow\\quad \\frac{P_p}{P_s}=4')], shortPracticeQuestionId: 'physics-motion-01' },
        'pc-blank-unit': { id: 'pc-blank-unit', answerType: 'single-choice', prompt: '電力の SI 単位は？', options: [option('pc-unit-watt', 'W（ワット）'), option('pc-unit-joule', 'J（ジュール）', 'J はエネルギーの単位です。'), option('pc-unit-ampere', 'A（アンペア）', 'A は電流の単位です。')], correctOptionIds: ['pc-unit-watt'], knowledgeTags: ['electric-power'], skillTag: 'unit', explanation: [text('pc-exp-unit', '電力は単位時間あたりのエネルギーで、1 W = 1 J/s です。')], shortPracticeQuestionId: 'physics-motion-01' },
      },
      variants: { detailed: ['pc-blank-ammeter', 'pc-blank-series', 'pc-blank-parallel', 'pc-blank-current-ratio', 'pc-blank-power-ratio', 'pc-blank-unit'], standard: ['pc-blank-series', 'pc-blank-parallel', 'pc-blank-power-ratio'], selfCheck: ['pc-blank-current-ratio', 'pc-blank-power-ratio'] },
    },
    simulation: {
      material: [text('pc-sim-material-1', '同じ抵抗 R を二つ用い、電圧 V 一定で直列接続と並列接続を比較する。')],
      items: [
        { id: 'pc-sim-item-1', label: '問1', prompt: [text('pc-sim-prompt-1', '正しい関係をすべて選べ。')], answerType: 'multi-choice', options: [simOption('pc-sim-opt-a', '直列合成は 2R'), simOption('pc-sim-opt-b', '並列合成は R/2'), simOption('pc-sim-opt-c', '並列の全電流は直列の 2 倍')], correctOptionIds: ['pc-sim-opt-a', 'pc-sim-opt-b'], score: 4, estimatedSeconds: 150, knowledgeTags: ['series-parallel'], skillTags: ['law-selection'] },
        { id: 'pc-sim-item-2', label: '問2', prompt: [text('pc-sim-prompt-2', '並列回路の全消費電力は直列回路の何倍か。')], answerType: 'number', correctValue: 4, tolerance: 0, score: 4, estimatedSeconds: 120, knowledgeTags: ['electric-power'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('pc-full-1', '同じ電圧では合成抵抗が小さいほど全電流と全電力が大きい。直列 2R、並列 R/2 なので比は 4。')],
    relatedQuestions: { sameKnowledge: ['physics-motion-01'], sameMethod: ['physics-motion-01'], reinforcement: ['physics-motion-01'] },
  },
]

export const builtInQuestions = validateQuestionCatalog(rawQuestions)

export function getBuiltInQuestion(questionId: string) {
  return builtInQuestions.find((question) => question.questionId === questionId)
}
