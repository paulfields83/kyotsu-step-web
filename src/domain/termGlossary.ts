/**
 * Reference glossary for commonly accepted textbook notation ONLY.
 * No per-question variables or temporary definitions are included.
 * These entries are explanatory aids; the notation used in an individual
 * problem and its explicitly stated conditions always take precedence.
 */
export type TermGlossarySubject = 'math-1a' | 'physics'
export type GlossaryTerm = { latex: string; ja: string; zh: string; unit?: string }
export type GlossaryGroup = { id: string; ja: string; zh: string; terms: GlossaryTerm[] }

const term = (latex: string, ja: string, zh: string, unit?: string): GlossaryTerm =>
  ({ latex, ja, zh, ...(unit ? { unit } : {}) })

export const termGlossary: Record<TermGlossarySubject, GlossaryGroup[]> = {
  'math-1a': [{
    id: 'common-sets',
    ja: '広く使われる数の集合・記号',
    zh: '公认的数集与数学记号',
    terms: [
      term('\\mathbb{R}', '実数全体の集合', '实数集合'),
      term('\\mathbb{Q}', '有理数全体の集合', '有理数集合'),
      term('\\mathbb{Z}', '整数全体の集合', '整数集合'),
      term('\\mathbb{N}', '自然数全体の集合（0を含むかは教材の定義による）', '自然数集合（是否包含 0 以教材定义为准）'),
      term('\\mathbb{C}', '複素数全体の集合', '复数集合'),
      term('\\varnothing', '空集合。要素を1つも持たない集合', '空集，不含任何元素的集合'),
      term('\\in', '左の要素が右の集合に属することを表す', '表示左侧元素属于右侧集合'),
      term('\\notin', '左の要素が右の集合に属さないことを表す', '表示左侧元素不属于右侧集合'),
      term('\\subseteq', '部分集合。左の集合の要素はすべて右の集合に含まれる', '子集，左侧集合的元素全部属于右侧集合'),
    ],
  }],
  physics: [
    {
      id: 'motion',
      ja: '運動・位置・速度',
      zh: '运动、位置与速度',
      terms: [
        term('t', '時刻、または基準からの経過時間', '时刻，或自基准时刻起经过的时间', 's'),
        term('\\Delta t', '時間の変化量・時間間隔', '时间变化量或时间间隔', 's'),
        term('x,\\ y', '位置を表す座標。座標軸の向きは問題の設定による', '位置坐标，坐标轴方向由题目规定', 'm'),
        term('\\vec r', '原点から物体の位置を示す位置ベクトル', '从原点指向物体位置的位置矢量', 'm'),
        term('\\Delta\\vec r', '変位ベクトル。終位置ベクトルと初位置ベクトルの差', '位移矢量：末位置矢量与初位置矢量之差', 'm'),
        term('v', '速さ、または一次元で向きを符号で表す速度', '速率，或一维运动中用正负号表示方向的速度', 'm/s'),
        term('\\vec v', '速度ベクトル。速さと運動の向きを持つ', '速度矢量，包含大小与方向', 'm/s'),
        term('\\vec v_{\\mathrm{avg}}', '平均速度ベクトル。変位を経過時間で割る', '平均速度矢量：位移除以经过时间', 'm/s'),
        term('v_0', '初速度。運動を考え始める時刻の速度', '初速度：研究运动的起始时刻的速度', 'm/s'),
        term('v_x,\\ v_y', '速度の各座標方向の成分', '速度沿坐标轴方向的分量', 'm/s'),
        term('a', '加速度。単位時間あたりの速度の変化', '加速度：单位时间内速度的变化', 'm/s²'),
        term('a_x,\\ a_y', '加速度の各座標方向の成分', '加速度沿坐标轴方向的分量', 'm/s²'),
        term('g', '重力加速度の大きさ', '重力加速度的大小', 'm/s²'),
        term('\\theta', '角度。何と何の角度かは図・問題文で定義する', '角度，具体是哪两个方向之间的夹角由题目或图示确定', '° / rad'),
      ],
    },
    {
      id: 'forces',
      ja: '力・運動量・円運動',
      zh: '力、动量与圆周运动',
      terms: [
        term('m', '質量', '质量', 'kg'),
        term('\\vec F', '物体にはたらく力のベクトル', '作用于物体的力矢量', 'N'),
        term('N', '垂直抗力を表すことがある（単位 N と区別）', '有时表示支持力（注意与力的单位 N 区分）', 'N'),
        term('\\mu', '摩擦係数', '摩擦系数'),
        term('k', 'ばね定数（ばねの伸びと弾性力を結ぶ係数）', '弹簧劲度系数（联系形变量与弹力）', 'N/m'),
        term('\\vec p', '運動量。質量と速度の積', '动量：质量乘以速度', 'kg·m/s'),
        term('I', '力積を表す場合がある。電流 I と区別する', '有时表示冲量，须与电流 I 区分', 'N·s'),
        term('r', '円運動の半径として使う場合がある', '在圆周运动中常表示半径', 'm'),
        term('\\omega', '角速度。単位時間あたりの回転角', '角速度：单位时间转过的角度', 'rad/s'),
        term('T', '周期。1回の振動・回転にかかる時間', '周期：完成一次振动或转动所需的时间', 's'),
      ],
    },
    {
      id: 'energy',
      ja: '仕事・エネルギー・熱',
      zh: '功、能量与热',
      terms: [
        term('W', '仕事。力が物体を動かすときのエネルギー移動', '功：力使物体移动时的能量转移', 'J'),
        term('K', '運動エネルギーとして使うことがある', '有时表示动能', 'J'),
        term('U', '位置エネルギー・ポテンシャルエネルギー', '势能', 'J'),
        term('E', 'エネルギー（種類は添字・文脈で区別する）', '能量（具体类型通过下标或上下文区分）', 'J'),
        term('P', '仕事率・電力。単位時間あたりの仕事やエネルギー', '功率：单位时间的功或能量', 'W'),
        term('Q', '熱量', '热量', 'J'),
        term('c', '比熱容量として使うことがある', '有时表示比热容', 'J/(kg·K)'),
        term('T_{\\mathrm{temp}}', '絶対温度の記号 T。周期 T と区別する', '绝对温度 T，须与周期 T 区分', 'K'),
      ],
    },
    {
      id: 'waves',
      ja: '波動',
      zh: '波动',
      terms: [
        term('f', '振動数・周波数。1秒間の振動回数', '频率：每秒振动次数', 'Hz'),
        term('\\lambda', '波長。隣り合う同位相の点の距離', '波长：相邻同相位点之间的距离', 'm'),
        term('A', '振幅。平衡位置からの最大変位', '振幅：偏离平衡位置的最大距离', 'm'),
        term('v_{\\mathrm{wave}}', '波の速さ。物体の運動速度と区別する', '波速，与物体运动速度区分', 'm/s'),
      ],
    },
    {
      id: 'electric',
      ja: '電気・磁気',
      zh: '电学与磁学',
      terms: [
        term('q', '電荷・電気量', '电荷量', 'C'),
        term('I', '電流。単位時間あたりに流れる電気量', '电流：单位时间内通过的电荷量', 'A'),
        term('V', '電圧・電位差', '电压或电势差', 'V'),
        term('R', '電気抵抗', '电阻', 'Ω'),
        term('C', '電気容量（コンデンサーの容量）', '电容', 'F'),
        term('\\vec E', '電場・電界ベクトル', '电场强度矢量', 'N/C'),
        term('\\vec B', '磁束密度ベクトル', '磁感应强度矢量', 'T'),
        term('\\Phi', '磁束。磁場が面を貫く量', '磁通量', 'Wb'),
      ],
    },
  ],
}
