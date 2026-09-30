import { validateQuestionCatalog } from '../domain/questionSchema'

const text = (id: string, value: string) => ({ id, type: 'text' as const, text: value })
const dialogue = (id: string, speaker: string, value: string) => ({ id, type: 'text' as const, text: value, speaker })
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
    schemaVersion: '1.0', questionId: 'math-quadratic-01', revision: 2, status: 'published', subject: 'math-1a', unitType: 'major-question',
    title: '会話で考える二次関数の最大値',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '共通テスト型の会話・穴埋め構成で作成' },
    taxonomy: { majorUnit: 'functions', minorUnit: 'quadratic', knowledgeTags: ['completing-square', 'maximum'], skillTags: ['condition-reading', 'equation-building', 'conclusion'] },
    difficulty: 'standard', examLevel: 'common-test', estimatedSeconds: 420,
    assets: [],
    stem: [
      text('mq-stem-1', '文化祭の展示で、小型の噴水から出た水の高さを調べることにした。水を出してから x 秒後の高さ y m を、0 ≦ x ≦ 4 の範囲で次の式によって近似する。'),
      latex('mq-stem-2', 'y=-x^2+4x+1'),
      text('mq-stem-3', 'このモデルで、水の高さが最大になる時刻と、そのときの高さの組合せとして最も適切なものを選べ。'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'math-narrative',
      finalBlankId: 'mq-final-choice',
      solutionFlow: [
        { id: 'mq-flow-1', type: 'content', content: [dialogue('mq-flow-text-1', '太郎', '最大値を調べるなら、まず式を平方完成してグラフの頂点を見ればよさそうだね。')] },
        { id: 'mq-flow-b1', type: 'blank', blankId: 'mq-blank-sign' },
        { id: 'mq-flow-2', type: 'content', content: [latex('mq-flow-latex-1', 'y=-(x-2)^2+5'), dialogue('mq-flow-text-2', '花子', 'この形なら、二乗の部分が 0 になるときに y が最も大きくなるね。')] },
        { id: 'mq-flow-b2', type: 'blank', blankId: 'mq-blank-vertex' },
        { id: 'mq-flow-3', type: 'content', content: [dialogue('mq-flow-text-3', '太郎', 'しかも x=2 は条件 0≦x≦4 の中にある。だから、そのときの y を確認しよう。')] },
        { id: 'mq-flow-b3', type: 'blank', blankId: 'mq-blank-max' },
        { id: 'mq-flow-4', type: 'content', content: [dialogue('mq-flow-text-4', '花子', 'ここまでで時刻と高さが求まったね。最後に、最初の選択肢へ戻って対応する組を選ぼう。')] },
      ],
      blanks: {
        'mq-blank-sign': {
          id: 'mq-blank-sign', answerType: 'single-choice', prompt: '平方完成した式で、二乗項の前の符号はどれか。',
          options: [option('mq-sign-minus', '負（−）'), option('mq-sign-plus', '正（＋）', '元の x² の係数が −1 なので、平方完成後も二乗項の前は負です。')],
          correctOptionIds: ['mq-sign-minus'], knowledgeTags: ['completing-square'], skillTag: 'equation-building',
          explanation: [text('mq-exp-sign', '−x²+4x = −(x²−4x) としてから平方完成します。')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-blank-vertex': {
          id: 'mq-blank-vertex', answerType: 'single-choice', prompt: '二乗部分が 0 になる x の値はどれか。',
          options: [option('mq-vertex-two', '2'), option('mq-vertex-minus-two', '−2', '(x−2)²=0 となるのは x=2 です。'), option('mq-vertex-four', '4', '4 は定義域の端点で、頂点ではありません。')],
          correctOptionIds: ['mq-vertex-two'], knowledgeTags: ['maximum'], skillTag: 'conclusion',
          explanation: [latex('mq-exp-vertex', '(x-2)^2=0\\quad\\Rightarrow\\quad x=2')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-blank-max': {
          id: 'mq-blank-max', answerType: 'single-choice', prompt: 'x=2 のときの y の値はどれか。',
          options: [option('mq-max-five', '5'), option('mq-max-one', '1', 'x=0 の値だけを見ています。'), option('mq-max-nine', '9', '平方完成後の定数項を確認してください。')],
          correctOptionIds: ['mq-max-five'], knowledgeTags: ['maximum'], skillTag: 'calculation',
          explanation: [latex('mq-exp-max', 'y=-(2-2)^2+5=5')], shortPracticeQuestionId: 'math-statistics-01',
        },
        'mq-final-choice': {
          id: 'mq-final-choice', answerType: 'single-choice', prompt: '元の問題の選択肢から最も適切なものを選べ。',
          options: [
            option('mq-final-a', 'x=2 秒のとき、最大の高さは 5 m'),
            option('mq-final-b', 'x=0 秒のとき、最大の高さは 1 m', '頂点が定義域内にあるので、端点だけで最大値を判断できません。'),
            option('mq-final-c', 'x=4 秒のとき、最大の高さは 1 m', 'x=4 は端点で、頂点ではありません。'),
            option('mq-final-d', 'x=2 秒のとき、最大の高さは 9 m', '平方完成後の定数項は 5 です。'),
          ],
          correctOptionIds: ['mq-final-a'], knowledgeTags: ['maximum'], skillTag: 'conclusion',
          explanation: [text('mq-final-exp', '平方完成すると頂点は (2,5) で、x=2 は定義域内です。')], shortPracticeQuestionId: 'math-statistics-01',
        },
      },
      variants: {
        detailed: ['mq-blank-sign', 'mq-blank-vertex', 'mq-blank-max', 'mq-final-choice'],
        standard: ['mq-blank-vertex', 'mq-blank-max', 'mq-final-choice'],
        selfCheck: ['mq-blank-max', 'mq-final-choice'],
      },
    },
    simulation: {
      material: [text('mq-sim-material-1', '0≦x≦4 において y=−x²+4x+1 を考える。')],
      items: [
        { id: 'mq-sim-item-1', label: '問1', prompt: [text('mq-sim-prompt-1', '最大値をとる x を選べ。')], answerType: 'single-choice', options: [simOption('mq-sim-x-zero', '0'), simOption('mq-sim-x-two', '2'), simOption('mq-sim-x-four', '4')], correctOptionIds: ['mq-sim-x-two'], score: 3, estimatedSeconds: 90, knowledgeTags: ['maximum'], skillTags: ['conclusion'] },
        { id: 'mq-sim-item-2', label: '問2', prompt: [text('mq-sim-prompt-2', '最大値を数値で入力せよ。')], answerType: 'number', correctValue: 5, tolerance: 0, score: 3, estimatedSeconds: 90, knowledgeTags: ['maximum'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('mq-full-1', '平方完成すると y=−(x−2)²+5。頂点 x=2 は定義域内なので、最大値は 5 です。')],
    relatedQuestions: { sameKnowledge: ['math-statistics-01'], sameMethod: ['math-statistics-01'], reinforcement: ['math-statistics-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'math-statistics-01', revision: 2, status: 'published', subject: 'math-1a', unitType: 'major-question',
    title: '会話で読む度数分布表と平均値',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '共通テスト型の資料・会話構成で作成' },
    taxonomy: { majorUnit: 'data-analysis', minorUnit: 'frequency-table', knowledgeTags: ['weighted-mean', 'frequency'], skillTags: ['reading', 'calculation', 'conclusion'] },
    difficulty: 'basic', examLevel: 'common-test', estimatedSeconds: 360,
    assets: [],
    stem: [
      text('ms-stem-1', 'あるクラス 20 人の通学時間を調べ、次の度数分布表にまとめた。太郎と花子は、各階級の階級値を使って平均通学時間を推定することにした。'),
      table('ms-stem-table', ['通学時間（分）', '階級値', '度数'], [['0以上10未満', '5', '4'], ['10以上20未満', '15', '8'], ['20以上30未満', '25', '6'], ['30以上40未満', '35', '2']], '通学時間の度数分布'),
      text('ms-stem-2', '階級値を用いて求めた平均通学時間について、最も適切な説明を選べ。'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'math-narrative',
      finalBlankId: 'ms-final-choice',
      solutionFlow: [
        { id: 'ms-flow-1', type: 'content', content: [dialogue('ms-flow-text-1', '太郎', '平均を出すには、まず各階級の「階級値×度数」を足せばよいね。最初の階級から確認しよう。')] },
        { id: 'ms-flow-b1', type: 'blank', blankId: 'ms-blank-first-product' },
        { id: 'ms-flow-2', type: 'content', content: [dialogue('ms-flow-text-2', '花子', '同じ計算を全部の階級で行うと、積の合計が求められるね。')] },
        { id: 'ms-flow-b2', type: 'blank', blankId: 'ms-blank-total' },
        { id: 'ms-flow-3', type: 'content', content: [latex('ms-flow-latex-1', '\\bar{x}=\\frac{\\sum (\\text{階級値}\\times\\text{度数})}{\\sum \\text{度数}}'), dialogue('ms-flow-text-3', '太郎', '分母は階級の個数ではなく、データの個数、つまり度数の合計だ。')] },
        { id: 'ms-flow-b3', type: 'blank', blankId: 'ms-blank-divisor' },
        { id: 'ms-flow-b4', type: 'blank', blankId: 'ms-blank-mean' },
        { id: 'ms-flow-4', type: 'content', content: [dialogue('ms-flow-text-4', '花子', '計算結果が出たので、最初の説明の選択肢へ戻って確かめよう。')] },
      ],
      blanks: {
        'ms-blank-first-product': { id: 'ms-blank-first-product', answerType: 'single-choice', prompt: '最初の階級の「階級値×度数」はどれか。', options: [option('ms-first-twenty', '20'), option('ms-first-nine', '9', '階級値と度数は足さずに掛けます。'), option('ms-first-forty', '40', '上端 10 ではなく階級値 5 を使います。')], correctOptionIds: ['ms-first-twenty'], knowledgeTags: ['weighted-mean'], skillTag: 'calculation', explanation: [latex('ms-exp-first', '5\\times4=20')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-total': { id: 'ms-blank-total', answerType: 'single-choice', prompt: 'すべての「階級値×度数」の合計はどれか。', options: [option('ms-total-360', '360'), option('ms-total-320', '320', '最後の階級 35×2 を含めてください。'), option('ms-total-400', '400', '各行の積をもう一度確認してください。')], correctOptionIds: ['ms-total-360'], knowledgeTags: ['weighted-mean'], skillTag: 'calculation', explanation: [latex('ms-exp-total', '5\\times4+15\\times8+25\\times6+35\\times2=360')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-divisor': { id: 'ms-blank-divisor', answerType: 'single-choice', prompt: '平均を求めるときの分母はどれか。', options: [option('ms-divisor-twenty', '20'), option('ms-divisor-four', '4', '4 は階級数です。平均ではデータ数で割ります。'), option('ms-divisor-forty', '40', '階級の最大端ではなく人数で割ります。')], correctOptionIds: ['ms-divisor-twenty'], knowledgeTags: ['frequency'], skillTag: 'reading', explanation: [text('ms-exp-divisor', '度数の合計 4+8+6+2=20 がデータ数です。')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-blank-mean': { id: 'ms-blank-mean', answerType: 'single-choice', prompt: '階級値を用いた平均通学時間はどれか。', options: [option('ms-mean-eighteen', '18 分'), option('ms-mean-twenty', '20 分', '360 を階級数など別の値で割っていないか確認してください。'), option('ms-mean-sixteen', '16 分', '積の合計または度数合計を確認してください。')], correctOptionIds: ['ms-mean-eighteen'], knowledgeTags: ['weighted-mean'], skillTag: 'conclusion', explanation: [latex('ms-exp-mean', '360\\div20=18')], shortPracticeQuestionId: 'math-quadratic-01' },
        'ms-final-choice': {
          id: 'ms-final-choice', answerType: 'single-choice', prompt: '元の問題の選択肢から最も適切なものを選べ。',
          options: [
            option('ms-final-a', '階級値を用いた平均通学時間は 18 分である'),
            option('ms-final-b', '階級値を用いた平均通学時間は 20 分である', '分母は階級数ではなく人数 20 です。'),
            option('ms-final-c', '階級値を用いた平均通学時間は 16 分である', '積の合計は 360 です。'),
            option('ms-final-d', '度数の合計は 40 である', '度数の合計は 4+8+6+2=20 です。'),
          ],
          correctOptionIds: ['ms-final-a'], knowledgeTags: ['weighted-mean'], skillTag: 'conclusion',
          explanation: [text('ms-final-exp', '積の総和 360 を度数の総和 20 で割るので 18 分です。')], shortPracticeQuestionId: 'math-quadratic-01',
        },
      },
      variants: {
        detailed: ['ms-blank-first-product', 'ms-blank-total', 'ms-blank-divisor', 'ms-blank-mean', 'ms-final-choice'],
        standard: ['ms-blank-total', 'ms-blank-mean', 'ms-final-choice'],
        selfCheck: ['ms-blank-mean', 'ms-final-choice'],
      },
    },
    simulation: {
      material: [table('ms-sim-table', ['階級値', '度数'], [['5', '4'], ['15', '8'], ['25', '6'], ['35', '2']], '通学時間の階級値と度数')],
      items: [
        { id: 'ms-sim-item-1', label: '問1', prompt: [text('ms-sim-prompt-1', '正しい説明をすべて選べ。')], answerType: 'multi-choice', options: [simOption('ms-sim-opt-a', '度数の合計は 20'), simOption('ms-sim-opt-b', '積の合計は 360'), simOption('ms-sim-opt-c', '平均は 20 分')], correctOptionIds: ['ms-sim-opt-a', 'ms-sim-opt-b'], score: 4, estimatedSeconds: 120, knowledgeTags: ['weighted-mean'], skillTags: ['reading', 'calculation'] },
        { id: 'ms-sim-item-2', label: '問2', prompt: [text('ms-sim-prompt-2', '平均を数値で入力せよ。')], answerType: 'number', correctValue: 18, tolerance: 0, score: 3, estimatedSeconds: 90, knowledgeTags: ['weighted-mean'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('ms-full-1', '階級値×度数の総和 360 を度数の総和 20 で割るので、平均通学時間は 18 分です。')],
    relatedQuestions: { sameKnowledge: ['math-quadratic-01'], sameMethod: ['math-quadratic-01'], reinforcement: ['math-quadratic-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-motion-01', revision: 2, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '計算導出型｜速度–時間グラフ',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '計算導出型の学習用 SVG 問題' },
    taxonomy: { majorUnit: 'mechanics', minorUnit: 'motion-graph', knowledgeTags: ['velocity-time', 'displacement'], skillTags: ['graph-reading', 'equation-building', 'calculation'] },
    difficulty: 'standard', examLevel: 'common-test', estimatedSeconds: 480,
    assets: [{ id: 'pm-velocity-asset', type: 'image', src: '/assets/velocity-graph.svg', alt: '0秒から4秒まで速度が直線的に8 m/sへ増加し、その後6秒まで一定の速度–時間グラフ' }],
    stem: [
      text('pm-stem-1', '物体が一直線上を運動する。下図は、時刻 t と速度 v の関係を表す。0 秒から 6 秒までの運動について、0〜4 秒の加速度と 0〜6 秒の移動距離の組合せとして最も適切なものを選べ。'),
      image('pm-stem-image', 'pm-velocity-asset', '速度–時間グラフ。0–4秒は0から8 m/sまで直線増加、4–6秒は8 m/s一定。', '図1　物体の速度–時間グラフ'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'calculation-derivation',
      finalBlankId: 'pm-final-choice',
      solutionFlow: [
        { id: 'pm-flow-1', type: 'content', content: [dialogue('pm-flow-text-1', '先生', 'まず 0〜4 秒の加速度を求める。速度–時間グラフでは、傾きが何を表すかを確認しよう。')] },
        { id: 'pm-flow-b1', type: 'blank', blankId: 'pm-blank-acceleration' },
        { id: 'pm-flow-2', type: 'content', content: [latex('pm-flow-latex-1', 'a=\\frac{8-0}{4-0}=2\\ \\mathrm{m/s^2}'), dialogue('pm-flow-text-2', '先生', '次に移動距離を求める。速度–時間グラフでは、グラフと時間軸に囲まれた面積を区間ごとに計算する。')] },
        { id: 'pm-flow-b2', type: 'blank', blankId: 'pm-blank-triangle' },
        { id: 'pm-flow-b3', type: 'blank', blankId: 'pm-blank-rectangle' },
        { id: 'pm-flow-3', type: 'content', content: [dialogue('pm-flow-text-3', '先生', '最後に二つの面積を足して、0〜6 秒の移動距離を求めよう。')] },
        { id: 'pm-flow-b4', type: 'blank', blankId: 'pm-blank-distance' },
        { id: 'pm-flow-4', type: 'content', content: [dialogue('pm-flow-text-4', '先生', '必要な二つの量が求まった。元の選択肢へ戻って組合せを選ぼう。')] },
      ],
      blanks: {
        'pm-blank-acceleration': { id: 'pm-blank-acceleration', answerType: 'single-choice', prompt: '0〜4 秒の加速度はどれか。', options: [option('pm-acc-two', '2 m/s²'), option('pm-acc-four', '4 m/s²', '速度変化 8 を時間 4 で割ります。'), option('pm-acc-eight', '8 m/s²', '8 は速度変化量であり、加速度ではありません。')], correctOptionIds: ['pm-acc-two'], knowledgeTags: ['velocity-time'], skillTag: 'graph-reading', explanation: [latex('pm-exp-acc', 'a=\\frac{8-0}{4-0}=2\\ \\mathrm{m/s^2}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-triangle': { id: 'pm-blank-triangle', answerType: 'single-choice', prompt: '0〜4 秒に対応する三角形の面積はどれか。', options: [option('pm-triangle-sixteen', '16 m'), option('pm-triangle-thirtytwo', '32 m', '三角形なので 1/2 を掛けます。'), option('pm-triangle-eight', '8 m', '底辺 4 秒も掛けます。')], correctOptionIds: ['pm-triangle-sixteen'], knowledgeTags: ['displacement'], skillTag: 'calculation', explanation: [latex('pm-exp-triangle', '\\frac12\\times4\\times8=16\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-rectangle': { id: 'pm-blank-rectangle', answerType: 'single-choice', prompt: '4〜6 秒に対応する長方形の面積はどれか。', options: [option('pm-rectangle-sixteen', '16 m'), option('pm-rectangle-eight', '8 m', '8 m/s が 2 秒続きます。'), option('pm-rectangle-fortyeight', '48 m', '0〜6 秒をすべて一定速度として扱わないでください。')], correctOptionIds: ['pm-rectangle-sixteen'], knowledgeTags: ['displacement'], skillTag: 'calculation', explanation: [latex('pm-exp-rectangle', '(6-4)\\times8=16\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-blank-distance': { id: 'pm-blank-distance', answerType: 'single-choice', prompt: '0〜6 秒の移動距離はどれか。', options: [option('pm-distance-thirtytwo', '32 m'), option('pm-distance-twentyfour', '24 m', '二つの区間の面積を両方足してください。'), option('pm-distance-fortyeight', '48 m', '全区間が 8 m/s 一定ではありません。')], correctOptionIds: ['pm-distance-thirtytwo'], knowledgeTags: ['displacement'], skillTag: 'conclusion', explanation: [latex('pm-exp-distance', '16+16=32\\ \\mathrm{m}')], shortPracticeQuestionId: 'physics-circuit-01' },
        'pm-final-choice': {
          id: 'pm-final-choice', answerType: 'single-choice', prompt: '元の問題の選択肢から最も適切な組合せを選べ。',
          options: [
            option('pm-final-a', '加速度 2 m/s²、移動距離 32 m'),
            option('pm-final-b', '加速度 2 m/s²、移動距離 48 m', '移動距離はグラフ下の面積で、32 m です。'),
            option('pm-final-c', '加速度 4 m/s²、移動距離 32 m', '加速度は速度変化 8 を 4 秒で割ります。'),
            option('pm-final-d', '加速度 8 m/s²、移動距離 48 m', '8 は速度変化量であり、移動距離も全区間一定速度ではありません。'),
          ],
          correctOptionIds: ['pm-final-a'], knowledgeTags: ['velocity-time', 'displacement'], skillTag: 'conclusion',
          explanation: [text('pm-final-exp', '加速度は 2 m/s²、グラフ下の面積は 16+16=32 m です。')], shortPracticeQuestionId: 'physics-circuit-01',
        },
      },
      variants: {
        detailed: ['pm-blank-acceleration', 'pm-blank-triangle', 'pm-blank-rectangle', 'pm-blank-distance', 'pm-final-choice'],
        standard: ['pm-blank-acceleration', 'pm-blank-distance', 'pm-final-choice'],
        selfCheck: ['pm-blank-distance', 'pm-final-choice'],
      },
    },
    simulation: {
      material: [image('pm-sim-image', 'pm-velocity-asset', '0〜4秒で8 m/sまで増加し4〜6秒は一定の速度–時間グラフ')],
      items: [
        { id: 'pm-sim-item-1', label: '問1', prompt: [text('pm-sim-prompt-1', '0〜4 秒の加速度を入力せよ（m/s²）。')], answerType: 'number', correctValue: 2, tolerance: 0.01, score: 3, estimatedSeconds: 90, knowledgeTags: ['velocity-time'], skillTags: ['graph-reading'] },
        { id: 'pm-sim-item-2', label: '問2', prompt: [text('pm-sim-prompt-2', '0〜6 秒の移動距離を入力せよ（m）。')], answerType: 'number', correctValue: 32, tolerance: 0.01, score: 4, estimatedSeconds: 120, knowledgeTags: ['displacement'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('pm-full-1', '0〜4 秒の加速度はグラフの傾きから 2 m/s²。移動距離はグラフ下の面積で、三角形 16 m と長方形 16 m の合計 32 m です。')],
    relatedQuestions: { sameKnowledge: ['physics-circuit-01'], sameMethod: ['physics-circuit-01'], reinforcement: ['physics-circuit-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-circuit-01', revision: 2, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '現象分析型｜直列・並列回路の候補比較',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '現象分析型の候補比較問題' },
    taxonomy: { majorUnit: 'electricity', minorUnit: 'dc-circuit', knowledgeTags: ['ohms-law', 'series-parallel', 'electric-power'], skillTags: ['condition-reading', 'case-classification', 'law-selection'] },
    difficulty: 'advanced', examLevel: 'common-test', estimatedSeconds: 600,
    assets: [],
    stem: [
      text('pc-stem-1', '同じ抵抗値 R をもつ二つの抵抗器を、同じ電圧 V の電源につなぐ。二つを直列につないだ場合と並列につないだ場合について、合成抵抗、回路全体の電流、回路全体の消費電力を比較する。'),
      text('pc-stem-2', '「直列の合成抵抗」「並列の合成抵抗」「並列の全電流÷直列の全電流」の組合せとして最も適切なものを選べ。'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'phenomenon-analysis',
      finalBlankId: 'pc-final-choice',
      solutionFlow: [
        { id: 'pc-flow-1', type: 'content', content: [dialogue('pc-flow-text-1', '太郎', '候補を一つずつ整理しよう。まず直列では、二つの抵抗をそのまま足せばよい。')] },
        { id: 'pc-flow-b1', type: 'blank', blankId: 'pc-blank-series' },
        { id: 'pc-flow-2', type: 'content', content: [dialogue('pc-flow-text-2', '花子', '次は並列。二つの同じ抵抗だから、逆数の和から合成抵抗を出せるね。')] },
        { id: 'pc-flow-b2', type: 'blank', blankId: 'pc-blank-parallel' },
        { id: 'pc-flow-3', type: 'content', content: [dialogue('pc-flow-text-3', '太郎', '電源電圧 V はどちらも同じだから、I=V/R_eq を使えば全電流を比較できる。')] },
        { id: 'pc-flow-b3', type: 'blank', blankId: 'pc-blank-current-ratio' },
        { id: 'pc-flow-4', type: 'content', content: [dialogue('pc-flow-text-4', '花子', 'さらに P=VI を使うと、電圧が同じとき消費電力の比は全電流の比と同じになる。')] },
        { id: 'pc-flow-b4', type: 'blank', blankId: 'pc-blank-power-ratio' },
        { id: 'pc-flow-5', type: 'content', content: [dialogue('pc-flow-text-5', '太郎', '必要な候補を全部分類できた。最後に最初の組合せへ戻ろう。')] },
      ],
      blanks: {
        'pc-blank-series': { id: 'pc-blank-series', answerType: 'single-choice', prompt: '直列の合成抵抗はどれか。', options: [option('pc-series-two-r', '2R'), option('pc-series-half-r', 'R/2', 'R/2 は並列の場合です。'), option('pc-series-r', 'R', '直列では抵抗値を足します。')], correctOptionIds: ['pc-series-two-r'], knowledgeTags: ['series-parallel'], skillTag: 'case-classification', explanation: [latex('pc-exp-series', 'R_{\\mathrm{series}}=R+R=2R')], shortPracticeQuestionId: 'physics-magnetic-01' },
        'pc-blank-parallel': { id: 'pc-blank-parallel', answerType: 'single-choice', prompt: '並列の合成抵抗はどれか。', options: [option('pc-parallel-half-r', 'R/2'), option('pc-parallel-two-r', '2R', '2R は直列の場合です。'), option('pc-parallel-r', 'R', '同じ抵抗二つの並列では合成抵抗は半分になります。')], correctOptionIds: ['pc-parallel-half-r'], knowledgeTags: ['series-parallel'], skillTag: 'case-classification', explanation: [latex('pc-exp-parallel', '\\frac1{R_{\\mathrm{parallel}}}=\\frac1R+\\frac1R=\\frac2R')], shortPracticeQuestionId: 'physics-magnetic-01' },
        'pc-blank-current-ratio': { id: 'pc-blank-current-ratio', answerType: 'single-choice', prompt: '並列の全電流÷直列の全電流はどれか。', options: [option('pc-current-four', '4'), option('pc-current-two', '2', '合成抵抗が 2R と R/2 なので電流比は 4 です。'), option('pc-current-half', '1/2', '電流は合成抵抗に反比例します。')], correctOptionIds: ['pc-current-four'], knowledgeTags: ['ohms-law'], skillTag: 'law-selection', explanation: [latex('pc-exp-current', '\\frac{V/(R/2)}{V/(2R)}=4')], shortPracticeQuestionId: 'physics-magnetic-01' },
        'pc-blank-power-ratio': { id: 'pc-blank-power-ratio', answerType: 'single-choice', prompt: '並列の全消費電力÷直列の全消費電力はどれか。', options: [option('pc-power-four', '4'), option('pc-power-sixteen', '16', '電圧一定なら P=VI なので電流比と同じです。'), option('pc-power-one', '1', '合成抵抗が異なるため電流も電力も変わります。')], correctOptionIds: ['pc-power-four'], knowledgeTags: ['electric-power'], skillTag: 'law-selection', explanation: [latex('pc-exp-power', 'P=VI\\quad\\Rightarrow\\quad \\frac{P_p}{P_s}=\\frac{I_p}{I_s}=4')], shortPracticeQuestionId: 'physics-magnetic-01' },
        'pc-final-choice': {
          id: 'pc-final-choice', answerType: 'single-choice', prompt: '元の問題の選択肢から最も適切な組合せを選べ。',
          options: [
            option('pc-final-a', '直列 2R、並列 R/2、電流比 4'),
            option('pc-final-b', '直列 2R、並列 R/2、電流比 2', '合成抵抗の比から電流比は 4 です。'),
            option('pc-final-c', '直列 R/2、並列 2R、電流比 4', '直列と並列の合成抵抗が逆です。'),
            option('pc-final-d', '直列 R、並列 R、電流比 1', '接続方法によって合成抵抗は変わります。'),
          ],
          correctOptionIds: ['pc-final-a'], knowledgeTags: ['series-parallel', 'ohms-law'], skillTag: 'conclusion',
          explanation: [text('pc-final-exp', '直列は 2R、並列は R/2。電圧一定なので電流比は 4 です。')], shortPracticeQuestionId: 'physics-magnetic-01',
        },
      },
      variants: {
        detailed: ['pc-blank-series', 'pc-blank-parallel', 'pc-blank-current-ratio', 'pc-blank-power-ratio', 'pc-final-choice'],
        standard: ['pc-blank-series', 'pc-blank-parallel', 'pc-blank-current-ratio', 'pc-final-choice'],
        selfCheck: ['pc-blank-current-ratio', 'pc-final-choice'],
      },
    },
    simulation: {
      material: [text('pc-sim-material-1', '同じ抵抗 R を二つ用い、電圧 V 一定で直列接続と並列接続を比較する。')],
      items: [
        { id: 'pc-sim-item-1', label: '問1', prompt: [text('pc-sim-prompt-1', '正しい関係をすべて選べ。')], answerType: 'multi-choice', options: [simOption('pc-sim-opt-a', '直列合成は 2R'), simOption('pc-sim-opt-b', '並列合成は R/2'), simOption('pc-sim-opt-c', '並列の全電流は直列の 2 倍')], correctOptionIds: ['pc-sim-opt-a', 'pc-sim-opt-b'], score: 4, estimatedSeconds: 150, knowledgeTags: ['series-parallel'], skillTags: ['law-selection'] },
        { id: 'pc-sim-item-2', label: '問2', prompt: [text('pc-sim-prompt-2', '並列回路の全消費電力は直列回路の何倍か。')], answerType: 'number', correctValue: 4, tolerance: 0, score: 4, estimatedSeconds: 120, knowledgeTags: ['electric-power'], skillTags: ['calculation'] },
      ],
    },
    fullExplanation: [text('pc-full-1', '直列の合成抵抗は 2R、並列は R/2。同じ電圧なら全電流と全消費電力は合成抵抗に反比例するので、並列は直列の 4 倍です。')],
    relatedQuestions: { sameKnowledge: ['physics-magnetic-01'], sameMethod: ['physics-magnetic-01'], reinforcement: ['physics-magnetic-01'] },
  },
  {
    schemaVersion: '1.0', questionId: 'physics-magnetic-01', revision: 1, status: 'published', subject: 'physics', unitType: 'major-question',
    title: '関係式分析型｜負電荷と磁場',
    source: { type: 'original', label: '共通 STEP オリジナル', rightsNote: '関係式分析型の方向・符号問題' },
    taxonomy: { majorUnit: 'electromagnetism', minorUnit: 'magnetic-force', knowledgeTags: ['lorentz-force', 'circular-motion'], skillTags: ['condition-reading', 'law-selection', 'conclusion'] },
    difficulty: 'advanced', examLevel: 'common-test', estimatedSeconds: 540,
    assets: [],
    stem: [
      text('mg-stem-1', '負の電荷をもつ粒子が、紙面の右向きに速度 v で進んでいる。磁場 B は紙面の奥向きに一様である。重力の影響は無視する。粒子が磁場に入った直後の磁気力の向きと、その後の運動について最も適切な組合せを選べ。'),
    ],
    learning: {
      presentation: 'common-test',
      flowType: 'relation-analysis',
      finalBlankId: 'mg-final-choice',
      solutionFlow: [
        { id: 'mg-flow-1', type: 'content', content: [dialogue('mg-flow-text-1', '太郎', 'まず一般式 F=qv×B を使う。最初は正電荷だと仮定して v×B の向きを考えよう。')] },
        { id: 'mg-flow-b1', type: 'blank', blankId: 'mg-blank-positive-direction' },
        { id: 'mg-flow-2', type: 'content', content: [dialogue('mg-flow-text-2', '花子', 'でも実際の粒子は負電荷だから、磁気力の向きは v×B と反対になるね。')] },
        { id: 'mg-flow-b2', type: 'blank', blankId: 'mg-blank-negative-direction' },
        { id: 'mg-flow-3', type: 'content', content: [dialogue('mg-flow-text-3', '太郎', '磁気力は速度に垂直だから、仕事をせず速さは変えない。その代わり進行方向が変わる。')] },
        { id: 'mg-flow-b3', type: 'blank', blankId: 'mg-blank-speed' },
        { id: 'mg-flow-4', type: 'content', content: [dialogue('mg-flow-text-4', '花子', '最初に下向きの力を受けるので、軌道の中心は進行方向の下側にある。回転方向を判断しよう。')] },
        { id: 'mg-flow-b4', type: 'blank', blankId: 'mg-blank-rotation' },
        { id: 'mg-flow-5', type: 'content', content: [dialogue('mg-flow-text-5', '太郎', '力の向き、速さ、回転方向の関係がそろった。元の選択肢で確認しよう。')] },
      ],
      blanks: {
        'mg-blank-positive-direction': {
          id: 'mg-blank-positive-direction', answerType: 'single-choice', prompt: '正電荷だと仮定したとき、v×B の向きはどれか。',
          options: [option('mg-positive-up', '紙面の上向き'), option('mg-positive-down', '紙面の下向き', '右向き × 奥向きは上向きです。'), option('mg-positive-right', '右向き', '磁気力は速度に垂直です。')],
          correctOptionIds: ['mg-positive-up'], knowledgeTags: ['lorentz-force'], skillTag: 'law-selection',
          explanation: [text('mg-exp-positive', '右手の法則で、右向きの v と紙面奥向きの B から v×B は上向きです。')], shortPracticeQuestionId: 'physics-motion-01',
        },
        'mg-blank-negative-direction': {
          id: 'mg-blank-negative-direction', answerType: 'single-choice', prompt: '負電荷が受ける磁気力の向きはどれか。',
          options: [option('mg-negative-down', '紙面の下向き'), option('mg-negative-up', '紙面の上向き', '負電荷では v×B と反対向きになります。'), option('mg-negative-left', '左向き', '磁気力は速度に垂直です。')],
          correctOptionIds: ['mg-negative-down'], knowledgeTags: ['lorentz-force'], skillTag: 'condition-reading',
          explanation: [text('mg-exp-negative', 'q<0 なので、F=qv×B は v×B と反対の下向きです。')], shortPracticeQuestionId: 'physics-motion-01',
        },
        'mg-blank-speed': {
          id: 'mg-blank-speed', answerType: 'single-choice', prompt: '磁場中で粒子の速さはどうなるか。',
          options: [option('mg-speed-same', '一定のまま'), option('mg-speed-increase', '増加する', '磁気力は速度に垂直なので仕事をしません。'), option('mg-speed-decrease', '減少する', '磁気力は速度に垂直なので運動エネルギーは変わりません。')],
          correctOptionIds: ['mg-speed-same'], knowledgeTags: ['circular-motion'], skillTag: 'law-selection',
          explanation: [text('mg-exp-speed', 'F⊥v なので磁気力は仕事をせず、速さは一定です。')], shortPracticeQuestionId: 'physics-motion-01',
        },
        'mg-blank-rotation': {
          id: 'mg-blank-rotation', answerType: 'single-choice', prompt: '粒子の軌道は最初にどちら向きへ曲がるか。',
          options: [option('mg-rotation-clockwise', '時計回り'), option('mg-rotation-counter', '反時計回り', '右向きに進みながら下向きに曲がるので時計回りです。'), option('mg-rotation-straight', '直進する', '速度に垂直な磁気力が働くので進行方向は変化します。')],
          correctOptionIds: ['mg-rotation-clockwise'], knowledgeTags: ['circular-motion'], skillTag: 'conclusion',
          explanation: [text('mg-exp-rotation', '右向きの速度に対して力が下向きなので、軌道は時計回りに曲がります。')], shortPracticeQuestionId: 'physics-motion-01',
        },
        'mg-final-choice': {
          id: 'mg-final-choice', answerType: 'single-choice', prompt: '元の問題の選択肢から最も適切な組合せを選べ。',
          options: [
            option('mg-final-a', '磁気力は下向き、速さは一定、軌道は時計回り'),
            option('mg-final-b', '磁気力は上向き、速さは一定、軌道は反時計回り', '負電荷なので力の向きは v×B と反対です。'),
            option('mg-final-c', '磁気力は下向き、速さは増加、軌道は時計回り', '磁気力は速度に垂直なので速さは変わりません。'),
            option('mg-final-d', '磁気力は左向き、速さは一定、軌道は直進', '磁気力は速度に垂直で、進行方向を変えます。'),
          ],
          correctOptionIds: ['mg-final-a'], knowledgeTags: ['lorentz-force', 'circular-motion'], skillTag: 'conclusion',
          explanation: [text('mg-final-exp', '負電荷なので磁気力は下向き。磁気力は仕事をしないため速さは一定で、軌道は時計回りに曲がります。')], shortPracticeQuestionId: 'physics-motion-01',
        },
      },
      variants: {
        detailed: ['mg-blank-positive-direction', 'mg-blank-negative-direction', 'mg-blank-speed', 'mg-blank-rotation', 'mg-final-choice'],
        standard: ['mg-blank-negative-direction', 'mg-blank-speed', 'mg-blank-rotation', 'mg-final-choice'],
        selfCheck: ['mg-blank-rotation', 'mg-final-choice'],
      },
    },
    simulation: {
      material: [text('mg-sim-material-1', '負電荷が右向きに進み、磁場は紙面の奥向きである。')],
      items: [
        { id: 'mg-sim-item-1', label: '問1', prompt: [text('mg-sim-prompt-1', '磁気力の向きを選べ。')], answerType: 'single-choice', options: [simOption('mg-sim-up', '上向き'), simOption('mg-sim-down', '下向き'), simOption('mg-sim-left', '左向き')], correctOptionIds: ['mg-sim-down'], score: 3, estimatedSeconds: 90, knowledgeTags: ['lorentz-force'], skillTags: ['law-selection'] },
        { id: 'mg-sim-item-2', label: '問2', prompt: [text('mg-sim-prompt-2', '磁場中で速さはどうなるか。')], answerType: 'single-choice', options: [simOption('mg-sim-same', '一定'), simOption('mg-sim-faster', '増加'), simOption('mg-sim-slower', '減少')], correctOptionIds: ['mg-sim-same'], score: 3, estimatedSeconds: 90, knowledgeTags: ['circular-motion'], skillTags: ['conclusion'] },
      ],
    },
    fullExplanation: [text('mg-full-1', '右向き v と紙面奥向き B では v×B は上向き。負電荷なので力は下向きです。磁気力は速度に垂直で仕事をしないため速さは一定、軌道は時計回りに曲がります。')],
    relatedQuestions: { sameKnowledge: ['physics-motion-01'], sameMethod: ['physics-motion-01'], reinforcement: ['physics-motion-01'] },
  },
]

export const builtInQuestions = validateQuestionCatalog(rawQuestions)

export function getBuiltInQuestion(questionId: string) {
  return builtInQuestions.find((question) => question.questionId === questionId)
}
