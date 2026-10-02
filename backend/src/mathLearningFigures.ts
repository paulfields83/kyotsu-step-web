import { TextbookUnitSchema, type TextbookReadingBlock, type TextbookUnit } from '../../src/domain/textbookSchema'

type Figure = { id: string; src: string; alt: string; caption?: string }
type Placement = { topicId: string; figure: Figure; afterParagraph?: number }

const assetFig = (id: string, alt: string, caption: string): Figure => ({
  id,
  src: `assets/${id}.svg`,
  alt,
  caption,
})

const F = {
  tasuki: assetFig('tasuki-cross','たすき掛けで交差する積を確認する模式図','斜めの積の和が中央の係数になることを確認する'),

  realLine: assetFig('real-number-line','実数を数直線上の点として表す図','有理数・無理数を含む実数は数直線上の点に対応する'),

  inequalities: assetFig('simultaneous-inequalities','2つの不等式の範囲と共通部分を示す数直線','連立不等式は2つの範囲の重なりを読む'),

  absDistance: assetFig('absolute-value-distance','絶対値を原点からの距離として示す数直線','|x| は原点から x までの距離'),

  absCase: assetFig('absolute-value-cases','絶対値の中身の符号で場合分けする流れ','境界で区切って絶対値を外す'),

  quadrants: assetFig('coordinate-quadrants','座標平面の4つの象限と各象限の座標符号を示す図','x・y の符号と象限の対応'),

  quadBasic: assetFig('quadratic-basic','係数 a の符号と絶対値による放物線の開き方の違い','y=ax² の開く向きと幅を比べる'),

  quadVertex: assetFig('quadratic-vertex-form','y=a(x-p)²+q の頂点 (p,q) と軸 x=p を正確に示す放物線','頂点 (p,q) は放物線上にあり、対称軸は必ず x=p を通る'),

  quadShift: assetFig('quadratic-shift','同一の放物線を平行移動した図と x 軸対称にした図','平行移動では形を変えず、対称移動では座標の符号だけを規則通り変える'),

  domainRange: assetFig('quadratic-domain-range','上に開く放物線を定義域で切り取り、頂点が最小値になることを示す図','定義域の端点と頂点を実際の放物線上で比較して値域を読む'),

  quadMaxMin: assetFig('quadratic-max-min','軸が定義域の内外にある場合を比較する図','最大・最小は頂点と端点の位置関係で決まる'),

  discriminant: assetFig('quadratic-discriminant','判別式と x 軸との共有点の個数を同じ尺度で対応させる3図','D&gt;0, D=0, D&lt;0 と共有点の個数'),

  lineIntersect: assetFig('parabola-line-intersection','放物線 y=x²−1 と直線 y=x+1 の共有点を示す図','連立すると共有点の x 座標を求める問題になる'),

  quadIneq: assetFig('quadratic-inequality','放物線 f(x)=(x−1)(x−3) の x 軸に対する上下と符号区間を示す図','2次不等式はグラフが x 軸より上か下かで読む'),

  absGraph: assetFig('absolute-value-graph','y=x²−1 の負の部分だけを x 軸の上側へ折り返した絶対値グラフ','y=|f(x)| は f(x)&lt;0 の部分を上へ反転する'),

  trigRight: assetFig('trig-right-triangle','直角三角形で角 A に対する対辺・隣辺・斜辺を示す図','本文と同じ角 A を基準にして sin・cos・tan の辺の対応を読む'),

  trigCoordinate: assetFig('trig-coordinate','半円上の点と座標で三角比を定義する図','座標による定義で 0°〜180° に拡張する'),

  sineLaw: assetFig('sine-law','三角形と外接円を用いた正弦定理の模式図','辺とその対角、外接円半径 R の対応'),

  cosineLaw: assetFig('cosine-law','三角形の2辺とその間の角を示す図','余弦定理は2辺とその間の角から向かいの辺を結ぶ'),

  triangleArea: assetFig('triangle-area','2辺とその間の角から三角形の面積を考える図','高さを b sin A と見ると面積公式につながる'),

  measurement: assetFig('height-distance','仰角と水平距離から高さを測る模式図','測量では実物を直角三角形に置き換える'),

  quadrilateralSplit: assetFig('quadrilateral-split','四角形を対角線で2つの三角形に分ける図','複雑な図形は三角形へ分割して計量する'),

  spatial: assetFig('spatial-measurement','立体を平面三角形へ落として考える模式図','空間図形でも必要な断面・三角形を取り出す'),

  histogram: assetFig('histogram','階級ごとの度数を柱の面積で表すヒストグラム','ヒストグラムでは階級の境界と高さを読む'),

  boxplot: assetFig('boxplot-quartiles','箱ひげ図と最小値・四分位数・中央値・最大値の位置','箱ひげ図は5数要約を1本の軸上で読む'),

  scatter: assetFig('scatter-correlation','正の相関・負の相関・相関なしを比較する散布図','散布図では点の全体的な傾向を見る'),

  dataTransform: assetFig('data-transform','データに定数を足す変換と定数倍する変換を比較する2つの数直線','＋b は散らばりを変えずに位置を移し、×a は中心と散らばりの両方を拡大縮小する'),

  statsCycle: assetFig('statistical-process','統計的探究の流れを循環で示す図','問い→収集→分析→解釈→次の問いの循環'),

  outlier: assetFig('outlier-boxplot','箱ひげ図の外側に離れた値を示す図','外れ値は分布全体と離れた位置に現れる'),

  countTree: assetFig('counting-tree','選択肢を枝分かれで数える樹形図','積の法則は各段階の選択肢を枝で表すと見やすい'),

  circular: assetFig('circular-permutation','円卓上に人を並べる円順列の模式図','回転して一致する並びは同じものとして扱う'),

  choose: assetFig('combination-selection','複数の対象から順序を気にせず選ぶ模式図','組合せでは選んだ集合だけを区別する'),

  sampleSpace: assetFig('sample-space','全事象を長方形、事象をその内部の領域で表す図','確率ではまず全事象と事象の範囲を分ける'),

  complementProb: assetFig('complement-event','事象 A とその余事象を全事象内で分けた図','A と Ā は全事象をちょうど2つに分ける'),

  probTree: assetFig('probability-tree','2段階の試行を確率付きの樹形図で示す図','条件付き確率・反復試行は枝ごとの確率を追う'),

  internalExternal: assetFig('internal-external-division','線分 AB を 2:1 に内分する点 P と外分する点 Q を正確な位置で比較する図','内分点は線分上、外分点は延長上にあり、どちらも指定された比を満たす'),

  angleBisector: assetFig('angle-bisector','不等辺三角形 ABC の角 A の二等分線 AD と辺の比を示す図','AD は実際の角の二等分線で、BD:DC=AB:AC を満たす'),

  centroid: assetFig('triangle-centroid','不等辺三角形の3本の中線と重心 G を示す図','各中線は辺の中点へ引かれ、3本は G で交わる'),

  centers: assetFig('triangle-centers','外心・内心・垂心をそれぞれの構成線とともに比較する図','外心＝垂直二等分線、内心＝角の二等分線、垂心＝高さの交点'),

  ceva: assetFig('ceva','D,E,F が各辺上にあり AD,BE,CF が1点 P で交わるチェバの定理の図','3本の線は同一点 P を通る'),

  menelaus: assetFig('menelaus','三角形の3辺または延長と一直線が交わる D,E,F を示すメネラウスの定理の図','D,E,F は同じ直線上にあり、各点は対応する辺または延長との交点'),

  cyclic: assetFig('cyclic-angle','同一円周上の点 C,D から同じ弧 AB を見込む2つの円周角を示す図','同じ弧 AB を見込む円周角 ∠ACB と ∠ADB は等しい'),

  cyclicQuad: assetFig('cyclic-quadrilateral','同じ円周上の4点 A,B,C,D を結んだ内接四角形','4頂点は同一円周上にあり、向かい合う角の和が180°になる'),

  tangentChord: assetFig('tangent-chord','接点 T の接線と弦 TA の角、同じ弦 TA を見る円周角 TBA を示す図','接弦定理で比較する2つの角を同じ図に明示する'),

  power: assetFig('power-of-point','円外の点 P から2本の割線 P-A-B, P-C-D と接線 PT を引いた図','A,B,C,D は円との交点で、PA·PB=PC·PD=PT² を満たす'),

  twoCircles: assetFig('two-circles','2つの円の共通弦と中心線、共通接線と半径の垂直関係を示す2図','共通弦は中心を結ぶ線に垂直、接点への半径は共通接線に垂直'),

  construction: assetFig('basic-construction','A,B を中心とする等しい半径の円弧の交点 U,V から垂直二等分線を作る図','等半径の円弧の交点を結ぶと AB の垂直二等分線になる'),

  linePlane: assetFig('line-plane','3D座標モデルで直線と平面が交わる・平行・平面上にある3場合を比較する図','直線と平面の位置関係を3種類に分ける'),

  fiveCenters: assetFig('five-centers-summary','三角形の五心を交わる線の種類で整理した比較図','重心・外心・内心・垂心・傍心を構成線で区別する'),

  cevaReverse: assetFig('ceva-reverse','比の積が1という条件から3本 AD,BE,CF が共点になるチェバの逆の図','数値条件から共点を結論する向きを示す'),

  menelausReverse: assetFig('menelaus-reverse','比の積が1という条件から D,E,F が一直線になるメネラウスの逆の図','数値条件から共線を結論する向きを示す'),

  threePerpendicular: assetFig('three-perpendicular','平面 α、点 P、垂足 H、斜線 PQ、射影 HQ、平面内直線 l を3D座標から投影した三垂線の定理の図','PH⊥α、l⊥HQ を満たし、その結果 l⊥PQ になる'),

  polyhedra: assetFig('polyhedra-euler','3D座標から投影した立方体で頂点・辺・面と個数を示す図','立方体では V=8, E=12, F=6 なので V−E+F=2'),

  placeValue: assetFig('place-value','位取り記数法の各桁と重みを示す図','各桁は基数の累乗を重みとして持つ'),

  positionGrid: assetFig('position-grid','格子上の位置を2つの数で表す座標模式図','基準・方向・量を固定すると位置を一意に表せる'),

  earth: assetFig('earth-measurement','地球断面と2地点・中心角を示す測量模式図','地表距離と中心角の比から地球周長を推定する'),

  domino: assetFig('domino-invariant','市松模様の盤面とドミノ1枚が黒白1マスずつ覆う図','色分けすると操作で変わらない量を見つけられる'),

  gridPath: assetFig('grid-shortest-path','格子上の最短経路を東・北の並びとして表す図','最短経路は必要な東移動と北移動の並べ方に置き換える'),

  parallelSimilarity: assetFig('parallel-similarity','三角形 ABC の2辺上に D,E を同率で取り DE∥BC とした相似図','平行線から等しい角を作り △ADE∽△ABC と辺の比へつなげる'),

  triangleInequality: assetFig('triangle-side-angle','BC が最長辺で、その向かいの角 A が最大になる不等辺三角形','実際の辺長の大小と向かいの角の大小を対応させる'),

  tiling: assetFig('regular-tiling','正多角形が1点のまわりに集まる敷き詰め図','1点のまわりの内角の和が360°になる必要がある'),

  hypothesis: assetFig('hypothesis-test-flow','仮説検定の判断手順を示す流れ図','帰無仮説のもとで極端な結果の起こりやすさを調べる'),

  trigSpecial: assetFig('trig-special-angles','0°・90°・180°の座標と三角比の符号を示す半円図','半円上の座標で特別角の値と符号を確認する'),

  heron: assetFig('heron-triangle','3辺だけが分かっている三角形の模式図','3辺が既知ならヘロンの公式で面積を直接求められる'),

  stoneGame: assetFig('stone-game','石取りゲームの残り個数を段階で示す図','負け位置を逆算して4の倍数を相手に渡す'),


}

const plans: Record<string, Placement[]> = {
  'math-1a-numbers-expressions': [
    { topicId:'s1-numbers-expressions-topic-09', figure:F.tasuki, afterParagraph:1 },
    { topicId:'s2-numbers-expressions-topic-02', figure:F.realLine, afterParagraph:1 },
    { topicId:'s3-numbers-expressions-topic-02', figure:F.inequalities, afterParagraph:1 },
    { topicId:'s3-numbers-expressions-topic-04', figure:F.absDistance, afterParagraph:1 },
    { topicId:'s3-numbers-expressions-topic-05', figure:F.absCase, afterParagraph:1 },
  ],
  'math-1a-quadratic-functions': [
    { topicId:'s1-quadratic-functions-topic-02', figure:F.quadrants, afterParagraph:1 },
    { topicId:'s1-quadratic-functions-topic-03', figure:F.domainRange, afterParagraph:1 },
    { topicId:'s1-quadratic-functions-topic-04', figure:F.quadBasic, afterParagraph:1 },
    { topicId:'s1-quadratic-functions-topic-05', figure:F.quadVertex, afterParagraph:1 },
    { topicId:'s1-quadratic-functions-topic-08', figure:F.quadShift, afterParagraph:1 },
    { topicId:'s2-quadratic-functions-topic-01', figure:F.quadVertex, afterParagraph:1 },
    { topicId:'s2-quadratic-functions-topic-02', figure:F.quadMaxMin, afterParagraph:1 },
    { topicId:'s2-quadratic-functions-topic-03', figure:F.quadMaxMin, afterParagraph:1 },
    { topicId:'s2-quadratic-functions-topic-04', figure:F.quadMaxMin, afterParagraph:1 },
    { topicId:'s3-quadratic-functions-topic-02', figure:F.discriminant, afterParagraph:1 },
    { topicId:'s3-quadratic-functions-topic-03', figure:F.lineIntersect, afterParagraph:1 },
    { topicId:'s3-quadratic-functions-topic-04', figure:F.quadIneq, afterParagraph:1 },
    { topicId:'s3-quadratic-functions-topic-05', figure:F.absGraph, afterParagraph:1 },
  ],
  'math-1a-geometry-measurement': [
    { topicId:'s1-geometry-measurement-topic-01', figure:F.trigRight, afterParagraph:1 },
    { topicId:'s2-geometry-measurement-topic-01', figure:F.trigCoordinate, afterParagraph:1 },
    { topicId:'s2-geometry-measurement-topic-02', figure:F.trigCoordinate, afterParagraph:1 },
    { topicId:'s2-geometry-measurement-topic-03', figure:F.trigSpecial, afterParagraph:1 },
    { topicId:'s3-geometry-measurement-topic-01', figure:F.sineLaw, afterParagraph:1 },
    { topicId:'s3-geometry-measurement-topic-02', figure:F.cosineLaw, afterParagraph:1 },
    { topicId:'s3-geometry-measurement-topic-03', figure:F.triangleArea, afterParagraph:1 },
    { topicId:'s3-geometry-measurement-topic-05', figure:F.heron, afterParagraph:1 },
    { topicId:'s4-geometry-measurement-topic-01', figure:F.measurement, afterParagraph:1 },
    { topicId:'s4-geometry-measurement-topic-02', figure:F.quadrilateralSplit, afterParagraph:1 },
    { topicId:'s4-geometry-measurement-topic-03', figure:F.spatial, afterParagraph:1 },
  ],
  'math-1a-data-analysis': [
    { topicId:'s1-data-analysis-topic-01', figure:F.histogram, afterParagraph:1 },
    { topicId:'s1-data-analysis-topic-04', figure:F.boxplot, afterParagraph:1 },
    { topicId:'s1-data-analysis-topic-06', figure:F.dataTransform, afterParagraph:1 },
    { topicId:'s1-data-analysis-topic-07', figure:F.scatter, afterParagraph:1 },
    { topicId:'s1-data-analysis-topic-09', figure:F.statsCycle, afterParagraph:1 },
    { topicId:'s1-data-analysis-topic-10', figure:F.outlier, afterParagraph:1 },
    { topicId:'s1-data-analysis-topic-12', figure:F.hypothesis, afterParagraph:2 },
  ],
  'math-1a-counting-probability': [
    { topicId:'s1-counting-probability-topic-02', figure:F.countTree, afterParagraph:1 },
    { topicId:'s1-counting-probability-topic-04', figure:F.countTree, afterParagraph:1 },
    { topicId:'s2-counting-probability-topic-02', figure:F.circular, afterParagraph:1 },
    { topicId:'s2-counting-probability-topic-03', figure:F.choose, afterParagraph:1 },
    { topicId:'s2-counting-probability-topic-04', figure:F.gridPath, afterParagraph:6 },
    { topicId:'s3-counting-probability-topic-01', figure:F.sampleSpace, afterParagraph:1 },
    { topicId:'s3-counting-probability-topic-04', figure:F.complementProb, afterParagraph:1 },
    { topicId:'s4-counting-probability-topic-02', figure:F.probTree, afterParagraph:1 },
    { topicId:'s4-counting-probability-topic-03', figure:F.probTree, afterParagraph:1 },
    { topicId:'s4-counting-probability-topic-06', figure:F.probTree, afterParagraph:1 },
    { topicId:'s4-counting-probability-topic-07', figure:F.probTree, afterParagraph:1 },
  ],
  'math-1a-geometric-properties': [
    { topicId:'s1-geometric-properties-topic-01', figure:F.parallelSimilarity, afterParagraph:2 },
    { topicId:'s1-geometric-properties-topic-02', figure:F.internalExternal, afterParagraph:1 },
    { topicId:'s1-geometric-properties-topic-03', figure:F.angleBisector, afterParagraph:1 },
    { topicId:'s1-geometric-properties-topic-04', figure:F.centroid, afterParagraph:1 },
    { topicId:'s1-geometric-properties-topic-05', figure:F.centers, afterParagraph:1 },
    { topicId:'s1-geometric-properties-topic-06', figure:F.fiveCenters, afterParagraph:1 },
    { topicId:'s1-geometric-properties-topic-07', figure:F.ceva, afterParagraph:1 },
    { topicId:'s1-geometric-properties-topic-08', figure:F.menelaus, afterParagraph:1 },
    { topicId:'s1-geometric-properties-topic-09', figure:F.cevaReverse, afterParagraph:1 },
    { topicId:'s1-geometric-properties-topic-09', figure:F.menelausReverse, afterParagraph:2 },
    { topicId:'s1-geometric-properties-topic-10', figure:F.triangleInequality, afterParagraph:1 },
    { topicId:'s2-geometric-properties-topic-01', figure:F.cyclic, afterParagraph:1 },
    { topicId:'s2-geometric-properties-topic-02', figure:F.cyclicQuad, afterParagraph:1 },
    { topicId:'s2-geometric-properties-topic-03', figure:F.tangentChord, afterParagraph:1 },
    { topicId:'s2-geometric-properties-topic-04', figure:F.power, afterParagraph:1 },
    { topicId:'s2-geometric-properties-topic-05', figure:F.twoCircles, afterParagraph:1 },
    { topicId:'s3-geometric-properties-topic-01', figure:F.construction, afterParagraph:1 },
    { topicId:'s4-geometric-properties-topic-01', figure:F.linePlane, afterParagraph:1 },
    { topicId:'s4-geometric-properties-topic-02', figure:F.threePerpendicular, afterParagraph:1 },
    { topicId:'s4-geometric-properties-topic-03', figure:F.polyhedra, afterParagraph:1 },
  ],
  'math-1a-human-activities': [
    { topicId:'s1-human-activities-topic-01', figure:F.placeValue, afterParagraph:1 },
    { topicId:'s1-human-activities-topic-02', figure:F.placeValue, afterParagraph:1 },
    { topicId:'s1-human-activities-topic-09', figure:F.positionGrid, afterParagraph:1 },
    { topicId:'s1-human-activities-topic-10', figure:F.earth, afterParagraph:1 },
    { topicId:'s2-human-activities-topic-01', figure:F.domino, afterParagraph:1 },
    { topicId:'s2-human-activities-topic-02', figure:F.stoneGame, afterParagraph:1 },
    { topicId:'s2-human-activities-topic-02', figure:F.tiling, afterParagraph:4 },
  ],
}

export function applyMathLearningFigures(unit: TextbookUnit): TextbookUnit {
  const unitPlans = plans[unit.unitId]
  if (!unitPlans?.length) return unit

  const nextSections = unit.sections.map((section) => {
    const topicIds = new Set(section.readingFlow.filter((block) => block.type === 'topic').map((block) => block.id))
    const sectionPlans = unitPlans.filter((plan) => topicIds.has(plan.topicId))
    if (!sectionPlans.length) return section

    const figureMap = new Map(section.figures.map((figure) => [figure.id, figure]))
    sectionPlans.forEach((plan) => figureMap.set(plan.figure.id, plan.figure))

    let currentTopic = ''
    let paragraphCount = 0
    const inserted = new Set<string>()
    const readingFlow: TextbookReadingBlock[] = []

    for (const block of section.readingFlow) {
      readingFlow.push(block)
      if (block.type === 'topic') {
        currentTopic = block.id
        paragraphCount = 0
        continue
      }
      if (block.type !== 'paragraph') continue
      paragraphCount += 1
      const after = sectionPlans
        .filter((plan) => plan.topicId === currentTopic && (plan.afterParagraph ?? 1) === paragraphCount)
        .filter((plan) => !inserted.has(`${plan.topicId}:${plan.figure.id}:${plan.afterParagraph ?? 1}`))
      for (const plan of after) {
        const placementKey = `${plan.topicId}:${plan.figure.id}:${plan.afterParagraph ?? 1}`
        inserted.add(placementKey)
        readingFlow.push({
          id: `figure-${plan.topicId}-${plan.figure.id}`,
          type: 'figure',
          figureId: plan.figure.id,
        })
      }
    }

    return { ...section, figures: [...figureMap.values()], readingFlow }
  })

  return TextbookUnitSchema.parse({
    ...unit,
    revision: unit.revision + 1,
    sections: nextSections,
  })
}
