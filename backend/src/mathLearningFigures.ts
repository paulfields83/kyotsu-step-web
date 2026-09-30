import { TextbookUnitSchema, type TextbookReadingBlock, type TextbookUnit } from '../../src/domain/textbookSchema'

type Figure = { id: string; src: string; alt: string; caption?: string }
type Placement = { topicId: string; figure: Figure; afterParagraph?: number }

const svgData = (width: number, height: number, body: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"><rect width="100%" height="100%" fill="white"/>${body}</svg>`)}`

const fig = (id: string, alt: string, caption: string, body: string, width = 760, height = 420): Figure => ({
  id,
  src: svgData(width, height, body),
  alt,
  caption,
})

const axis = (x1=80,y1=320,x2=680,y2=320) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#334155" stroke-width="2.5"/>`

const F = {
  tasuki: fig('tasuki-cross','たすき掛けで交差する積を確認する模式図','斜めの積の和が中央の係数になることを確認する',
    `<text x="380" y="48" text-anchor="middle" font-size="25" font-weight="700" fill="#1f2937">たすき掛け</text>
    <text x="160" y="135" font-size="28" fill="#2563eb">a</text><text x="160" y="285" font-size="28" fill="#2563eb">b</text>
    <text x="600" y="135" font-size="28" fill="#ea580c">c</text><text x="600" y="285" font-size="28" fill="#ea580c">d</text>
    <line x1="195" y1="125" x2="565" y2="275" stroke="#64748b" stroke-width="3"/><line x1="195" y1="275" x2="565" y2="125" stroke="#64748b" stroke-width="3"/>
    <text x="380" y="182" text-anchor="middle" font-size="24" fill="#475569">ad</text><text x="380" y="252" text-anchor="middle" font-size="24" fill="#475569">bc</text>
    <text x="380" y="355" text-anchor="middle" font-size="22" fill="#1f2937">ad + bc を確認</text>`),

  realLine: fig('real-number-line','実数を数直線上の点として表す図','有理数・無理数を含む実数は数直線上の点に対応する',
    `<text x="380" y="52" text-anchor="middle" font-size="25" font-weight="700" fill="#1f2937">実数と数直線</text>
    ${axis(70,220,690,220)}
    <path d="M690 220 l-14 -8 v16 z" fill="#334155"/>
    <g stroke="#334155" stroke-width="2"><line x1="160" y1="205" x2="160" y2="235"/><line x1="280" y1="205" x2="280" y2="235"/><line x1="400" y1="205" x2="400" y2="235"/><line x1="520" y1="205" x2="520" y2="235"/><line x1="610" y1="205" x2="610" y2="235"/></g>
    <g font-size="22" fill="#334155" text-anchor="middle"><text x="160" y="270">−1</text><text x="280" y="270">0</text><text x="400" y="270">1</text><text x="520" y="270">√2</text><text x="610" y="270">2</text></g>
    <circle cx="520" cy="220" r="7" fill="#ea580c"/><text x="520" y="175" text-anchor="middle" font-size="20" fill="#ea580c">無理数も1点</text>`),

  inequalities: fig('simultaneous-inequalities','2つの不等式の範囲と共通部分を示す数直線','連立不等式は2つの範囲の重なりを読む',
    `<text x="380" y="45" text-anchor="middle" font-size="24" font-weight="700" fill="#1f2937">連立不等式＝共通部分</text>
    <line x1="90" y1="140" x2="680" y2="140" stroke="#334155" stroke-width="2.5"/><line x1="210" y1="140" x2="560" y2="140" stroke="#2563eb" stroke-width="9"/><circle cx="210" cy="140" r="9" fill="white" stroke="#2563eb" stroke-width="3"/><circle cx="560" cy="140" r="9" fill="#2563eb"/>
    <line x1="90" y1="260" x2="680" y2="260" stroke="#334155" stroke-width="2.5"/><line x1="320" y1="260" x2="650" y2="260" stroke="#ea580c" stroke-width="9"/><circle cx="320" cy="260" r="9" fill="#ea580c"/>
    <rect x="320" y="315" width="240" height="34" rx="17" fill="#dcfce7"/><text x="440" y="339" text-anchor="middle" font-size="21" fill="#166534">重なる範囲が解</text>`),

  absDistance: fig('absolute-value-distance','絶対値を原点からの距離として示す数直線','|x| は原点から x までの距離',
    `<text x="380" y="52" text-anchor="middle" font-size="25" font-weight="700" fill="#1f2937">絶対値＝距離</text>
    ${axis(80,230,680,230)}<circle cx="380" cy="230" r="7" fill="#334155"/><text x="380" y="270" text-anchor="middle" font-size="22">0</text>
    <circle cx="570" cy="230" r="8" fill="#2563eb"/><text x="570" y="270" text-anchor="middle" font-size="22">x</text>
    <line x1="388" y1="180" x2="562" y2="180" stroke="#ea580c" stroke-width="4"/><path d="M388 180 l14 -8 v16 z" fill="#ea580c"/><path d="M562 180 l-14 -8 v16 z" fill="#ea580c"/>
    <text x="475" y="158" text-anchor="middle" font-size="23" fill="#ea580c">|x|</text>`),

  absCase: fig('absolute-value-cases','絶対値の中身の符号で場合分けする流れ','境界で区切って絶対値を外す',
    `<text x="380" y="48" text-anchor="middle" font-size="24" font-weight="700" fill="#1f2937">絶対値は境界で場合分け</text>
    <rect x="80" y="120" width="220" height="90" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/><text x="190" y="155" text-anchor="middle" font-size="21" fill="#1f2937">中身 ≧ 0</text><text x="190" y="188" text-anchor="middle" font-size="20" fill="#2563eb">そのまま外す</text>
    <rect x="460" y="120" width="220" height="90" rx="14" fill="#fff7ed" stroke="#ea580c" stroke-width="3"/><text x="570" y="155" text-anchor="middle" font-size="21" fill="#1f2937">中身 &lt; 0</text><text x="570" y="188" text-anchor="middle" font-size="20" fill="#ea580c">符号を反転</text>
    <line x1="380" y1="80" x2="380" y2="270" stroke="#94a3b8" stroke-dasharray="8 8" stroke-width="2.5"/><text x="380" y="305" text-anchor="middle" font-size="21" fill="#475569">中身 = 0 が境界</text>`),

  quadrants: fig('coordinate-quadrants','座標平面の4つの象限を示す図','x・y の符号と象限の対応',
    `<line x1="80" y1="210" x2="680" y2="210" stroke="#334155" stroke-width="2.5"/><line x1="380" y1="55" x2="380" y2="365" stroke="#334155" stroke-width="2.5"/>
    <text x="535" y="125" font-size="26" fill="#2563eb">I</text><text x="220" y="125" font-size="26" fill="#2563eb">II</text><text x="220" y="310" font-size="26" fill="#2563eb">III</text><text x="535" y="310" font-size="26" fill="#2563eb">IV</text>
    <text x="690" y="215" font-size="20">x</text><text x="390" y="65" font-size="20">y</text>`),

  quadBasic: fig('quadratic-basic','係数 a による放物線の開き方の違い','y=ax² の開く向きと幅を比べる',
    `<line x1="80" y1="320" x2="690" y2="320" stroke="#334155" stroke-width="2.5"/><line x1="380" y1="60" x2="380" y2="365" stroke="#334155" stroke-width="2.5"/>
    <path d="M220 300 Q380 55 540 300" fill="none" stroke="#2563eb" stroke-width="4"/>
    <path d="M120 300 Q380 180 640 300" fill="none" stroke="#16a34a" stroke-width="4"/>
    <path d="M240 95 Q380 325 520 95" fill="none" stroke="#ea580c" stroke-width="4"/>
    <text x="575" y="115" font-size="20" fill="#2563eb">a&gt;0</text><text x="585" y="245" font-size="20" fill="#16a34a">|a| が小さい</text><text x="535" y="90" font-size="20" fill="#ea580c">a&lt;0</text>`),

  quadVertex: fig('quadratic-vertex-form','y=a(x-p)²+q の頂点 (p,q) と軸 x=p を正確に示す放物線','頂点 (p,q) は放物線上にあり、対称軸は必ず x=p を通る',
    `<line x1="100" y1="330" x2="690" y2="330" stroke="#334155" stroke-width="2.5"/>
    <line x1="150" y1="55" x2="150" y2="360" stroke="#334155" stroke-width="2.5"/>
    <path d="M 250 300 Q 430 -60 610 300" fill="none" stroke="#2563eb" stroke-width="4"/>
    <line x1="430" y1="70" x2="430" y2="350" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="8 8"/>
    <circle cx="430" cy="120" r="8" fill="#ea580c"/>
    <text x="458" y="110" font-size="22" fill="#ea580c">(p,q)</text>
    <text x="430" y="380" text-anchor="middle" font-size="20" fill="#475569">x=p</text>`),

  quadShift: fig('quadratic-shift','同一の放物線を平行移動した図と x 軸対称にした図','平行移動では形を変えず、対称移動では座標の符号だけを規則通り変える',
    `<text x="195" y="38" text-anchor="middle" font-size="21" font-weight="700">平行移動</text>
    <line x1="55" y1="300" x2="335" y2="300" stroke="#334155" stroke-width="2"/>
    <line x1="165" y1="55" x2="165" y2="350" stroke="#334155" stroke-width="2"/>
    <path d="M 70 290 Q 165 0 260 290" fill="none" stroke="#94a3b8" stroke-width="3"/>
    <path d="M 125 255 Q 220 -35 315 255" fill="none" stroke="#2563eb" stroke-width="4"/>
    <path d="M 175 180 C 195 150 220 132 250 122" fill="none" stroke="#ea580c" stroke-width="3"/>
    <path d="M 250 122 l-13 -8 l2 16 z" fill="#ea580c"/>
    <text x="560" y="38" text-anchor="middle" font-size="21" font-weight="700">x軸対称</text>
    <line x1="425" y1="220" x2="695" y2="220" stroke="#334155" stroke-width="2"/>
    <line x1="560" y1="55" x2="560" y2="370" stroke="#334155" stroke-width="2"/>
    <path d="M 460 260 Q 560 20 660 260" fill="none" stroke="#2563eb" stroke-width="4"/>
    <path d="M 460 180 Q 560 420 660 180" fill="none" stroke="#ea580c" stroke-width="4"/>
    <text x="560" y="405" text-anchor="middle" font-size="18" fill="#475569">y=f(x) ↔ y=−f(x)</text>`),

  domainRange: fig('quadratic-domain-range','上に開く放物線を定義域で切り取り、頂点が最小値になることを示す図','定義域の端点と頂点を実際の放物線上で比較して値域を読む',
    `<line x1="110" y1="330" x2="680" y2="330" stroke="#334155" stroke-width="2.5"/>
    <line x1="140" y1="60" x2="140" y2="360" stroke="#334155" stroke-width="2.5"/>
    <path d="M 200 300 Q 400 -60 600 300" fill="none" stroke="#cbd5e1" stroke-width="3"/>
    <path d="M 250 221.25 Q 400 18.75 550 221.25" fill="none" stroke="#2563eb" stroke-width="6"/>
    <line x1="250" y1="221.25" x2="250" y2="330" stroke="#94a3b8" stroke-width="2" stroke-dasharray="7 7"/>
    <line x1="550" y1="221.25" x2="550" y2="330" stroke="#94a3b8" stroke-width="2" stroke-dasharray="7 7"/>
    <circle cx="250" cy="221.25" r="6" fill="#2563eb"/><circle cx="550" cy="221.25" r="6" fill="#2563eb"/>
    <circle cx="400" cy="120" r="7" fill="#ea580c"/>
    <text x="400" y="94" text-anchor="middle" font-size="20" fill="#ea580c">最小値</text>
    <text x="250" y="360" text-anchor="middle" font-size="18" fill="#475569">x=a</text>
    <text x="550" y="360" text-anchor="middle" font-size="18" fill="#475569">x=b</text>`),

  quadMaxMin: fig('quadratic-max-min','軸が定義域の内外にある場合を比較する図','最大・最小は頂点と端点の位置関係で決まる',
    `<text x="190" y="45" text-anchor="middle" font-size="23" font-weight="700">軸が区間内</text><text x="570" y="45" text-anchor="middle" font-size="23" font-weight="700">軸が区間外</text>
    <path d="M70 300 Q190 100 310 300" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="95" y1="90" x2="95" y2="320" stroke="#94a3b8" stroke-dasharray="7 7"/><line x1="285" y1="90" x2="285" y2="320" stroke="#94a3b8" stroke-dasharray="7 7"/>
    <path d="M430 300 Q720 30 690 300" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="475" y1="90" x2="475" y2="320" stroke="#94a3b8" stroke-dasharray="7 7"/><line x1="650" y1="90" x2="650" y2="320" stroke="#94a3b8" stroke-dasharray="7 7"/>
    <circle cx="190" cy="100" r="7" fill="#ea580c"/><text x="190" y="370" text-anchor="middle" font-size="20" fill="#475569">頂点を使える</text><text x="565" y="370" text-anchor="middle" font-size="20" fill="#475569">端点を比較</text>`),

  discriminant: fig('quadratic-discriminant','判別式と x 軸との共有点の個数を対応させる3図','D&gt;0, D=0, D&lt;0 と共有点の個数',
    `<g stroke="#334155" stroke-width="2"><line x1="35" y1="245" x2="235" y2="245"/><line x1="270" y1="245" x2="470" y2="245"/><line x1="505" y1="245" x2="705" y2="245"/></g>
    <path d="M55 300 Q135 100 215 300" fill="none" stroke="#2563eb" stroke-width="4"/><path d="M290 280 Q370 245 450 280" fill="none" stroke="#16a34a" stroke-width="4"/><path d="M525 195 Q605 55 685 195" fill="none" stroke="#ea580c" stroke-width="4"/>
    <text x="135" y="355" text-anchor="middle" font-size="20">D&gt;0</text><text x="370" y="355" text-anchor="middle" font-size="20">D=0</text><text x="605" y="355" text-anchor="middle" font-size="20">D&lt;0</text>`),

  lineIntersect: fig('parabola-line-intersection','放物線と直線の共有点を示す図','連立すると共有点の x 座標を求める問題になる',
    `<line x1="70" y1="330" x2="700" y2="330" stroke="#334155" stroke-width="2.5"/><line x1="170" y1="60" x2="170" y2="365" stroke="#334155" stroke-width="2.5"/>
    <path d="M220 300 Q400 60 580 300" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="130" y1="300" x2="650" y2="110" stroke="#ea580c" stroke-width="4"/>
    <circle cx="296" cy="239" r="7" fill="#1f2937"/><circle cx="514" cy="160" r="7" fill="#1f2937"/><text x="405" y="390" text-anchor="middle" font-size="21" fill="#475569">交点＝両方の式を同時に満たす点</text>`),

  quadIneq: fig('quadratic-inequality','放物線の x 軸に対する上下と不等式の解を示す図','2次不等式はグラフが x 軸より上か下かで読む',
    `<line x1="75" y1="245" x2="690" y2="245" stroke="#334155" stroke-width="2.5"/><path d="M120 90 Q380 390 640 90" fill="none" stroke="#2563eb" stroke-width="4"/>
    <circle cx="245" cy="245" r="7" fill="#ea580c"/><circle cx="515" cy="245" r="7" fill="#ea580c"/>
    <line x1="245" y1="300" x2="515" y2="300" stroke="#ea580c" stroke-width="10" stroke-linecap="round"/><text x="380" y="350" text-anchor="middle" font-size="21" fill="#ea580c">符号を見る区間</text>`),

  absGraph: fig('absolute-value-graph','負の部分を x 軸の上側へ折り返す絶対値グラフ','y=|f(x)| は f(x)&lt;0 の部分を上へ反転する',
    `<line x1="80" y1="230" x2="690" y2="230" stroke="#334155" stroke-width="2.5"/><path d="M100 120 Q380 360 660 120" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="8 7"/><path d="M100 120 Q240 230 380 110 Q520 230 660 120" fill="none" stroke="#2563eb" stroke-width="4"/><text x="380" y="385" text-anchor="middle" font-size="21" fill="#475569">x軸より下の部分を上へ折り返す</text>`),

  trigRight: fig('trig-right-triangle','直角三角形で角 A に対する対辺・隣辺・斜辺を示す図','本文と同じ角 A を基準にして sin・cos・tan の辺の対応を読む',
    `<polygon points="610,330 150,330 150,95" fill="none" stroke="#1f2937" stroke-width="4"/>
    <path d="M150 310 h20 v20" fill="none" stroke="#64748b" stroke-width="3"/>
    <path d="M 562 330 A 48 48 0 0 1 569 305" fill="none" stroke="#ea580c" stroke-width="3"/>
    <text x="565" y="296" font-size="22" fill="#ea580c">A</text>
    <text x="365" y="363" text-anchor="middle" font-size="20">隣辺</text>
    <text x="112" y="220" text-anchor="middle" font-size="20">対辺</text>
    <text x="405" y="190" text-anchor="middle" font-size="20">斜辺</text>`),

  trigCoordinate: fig('trig-coordinate','半円上の点と座標で三角比を定義する図','座標による定義で 0°〜180° に拡張する',
    `<line x1="80" y1="260" x2="690" y2="260" stroke="#334155" stroke-width="2.5"/><line x1="380" y1="55" x2="380" y2="365" stroke="#334155" stroke-width="2.5"/><path d="M180 260 A200 200 0 0 1 580 260" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="380" y1="260" x2="265" y2="96" stroke="#ea580c" stroke-width="4"/><circle cx="265" cy="96" r="7" fill="#ea580c"/><line x1="265" y1="96" x2="265" y2="260" stroke="#94a3b8" stroke-dasharray="7 7"/><text x="245" y="78" font-size="21" fill="#ea580c">P(x,y)</text><text x="295" y="245" font-size="20">θ</text>`),

  sineLaw: fig('sine-law','三角形と外接円を用いた正弦定理の模式図','辺とその対角、外接円半径 R の対応',
    `<circle cx="380" cy="215" r="155" fill="none" stroke="#94a3b8" stroke-width="3"/><polygon points="250,105 535,170 330,340" fill="none" stroke="#1f2937" stroke-width="4"/><circle cx="380" cy="215" r="6" fill="#ea580c"/><line x1="380" y1="215" x2="535" y2="170" stroke="#ea580c" stroke-width="3"/><text x="430" y="188" font-size="20" fill="#ea580c">R</text><text x="225" y="92" font-size="22">A</text><text x="548" y="170" font-size="22">B</text><text x="320" y="370" font-size="22">C</text>`),

  cosineLaw: fig('cosine-law','三角形の2辺とその間の角を示す図','余弦定理は2辺とその間の角から向かいの辺を結ぶ',
    `<polygon points="130,320 610,320 330,90" fill="none" stroke="#1f2937" stroke-width="4"/><text x="360" y="355" font-size="21">c</text><text x="210" y="205" font-size="21">b</text><text x="500" y="205" font-size="21">a</text><path d="M175 320 A45 45 0 0 0 160 288" fill="none" stroke="#ea580c" stroke-width="3"/><text x="185" y="285" font-size="21" fill="#ea580c">A</text>`),

  triangleArea: fig('triangle-area','2辺とその間の角から三角形の面積を考える図','高さを b sin A と見ると面積公式につながる',
    `<polygon points="130,330 630,330 350,100" fill="none" stroke="#1f2937" stroke-width="4"/><line x1="350" y1="100" x2="350" y2="330" stroke="#94a3b8" stroke-width="3" stroke-dasharray="7 7"/><path d="M350 310 h20 v20" fill="none" stroke="#64748b" stroke-width="3"/><text x="365" y="220" font-size="20" fill="#475569">高さ</text><text x="240" y="360" font-size="20">c</text><text x="220" y="205" font-size="20">b</text>`),

  measurement: fig('height-distance','仰角と水平距離から高さを測る模式図','測量では実物を直角三角形に置き換える',
    `<line x1="90" y1="335" x2="690" y2="335" stroke="#334155" stroke-width="3"/><line x1="585" y1="335" x2="585" y2="80" stroke="#1f2937" stroke-width="5"/><line x1="180" y1="335" x2="585" y2="95" stroke="#2563eb" stroke-width="4"/><path d="M245 335 A65 65 0 0 0 236 302" fill="none" stroke="#ea580c" stroke-width="3"/><text x="250" y="300" font-size="21" fill="#ea580c">仰角</text><text x="390" y="365" text-anchor="middle" font-size="20">水平距離</text><text x="610" y="205" font-size="20">高さ</text>`),

  quadrilateralSplit: fig('quadrilateral-split','四角形を対角線で2つの三角形に分ける図','複雑な図形は三角形へ分割して計量する',
    `<polygon points="130,110 590,80 650,315 100,340" fill="none" stroke="#1f2937" stroke-width="4"/><line x1="130" y1="110" x2="650" y2="315" stroke="#2563eb" stroke-width="4"/><text x="370" y="230" font-size="22" fill="#2563eb">対角線</text><text x="380" y="385" text-anchor="middle" font-size="20" fill="#475569">2つの三角形に分けて考える</text>`),

  spatial: fig('spatial-measurement','立体を平面三角形へ落として考える模式図','空間図形でも必要な断面・三角形を取り出す',
    `<polygon points="190,310 490,310 610,225 310,225" fill="none" stroke="#1f2937" stroke-width="3"/><line x1="190" y1="310" x2="190" y2="110" stroke="#1f2937" stroke-width="3"/><line x1="490" y1="310" x2="490" y2="110" stroke="#1f2937" stroke-width="3"/><line x1="610" y1="225" x2="610" y2="55" stroke="#1f2937" stroke-width="3"/><line x1="310" y1="225" x2="310" y2="55" stroke="#1f2937" stroke-width="3"/><polygon points="190,110 490,110 610,55 310,55" fill="none" stroke="#1f2937" stroke-width="3"/><line x1="190" y1="310" x2="610" y2="55" stroke="#2563eb" stroke-width="4"/><line x1="190" y1="310" x2="490" y2="110" stroke="#ea580c" stroke-width="4"/>`),

  histogram: fig('histogram','階級ごとの度数を柱の面積で表すヒストグラム','ヒストグラムでは階級の境界と高さを読む',
    `<line x1="90" y1="330" x2="690" y2="330" stroke="#334155" stroke-width="2.5"/><line x1="90" y1="70" x2="90" y2="330" stroke="#334155" stroke-width="2.5"/>
    <g fill="#dbeafe" stroke="#2563eb" stroke-width="2"><rect x="120" y="250" width="90" height="80"/><rect x="210" y="190" width="90" height="140"/><rect x="300" y="105" width="90" height="225"/><rect x="390" y="145" width="90" height="185"/><rect x="480" y="220" width="90" height="110"/></g><text x="390" y="380" text-anchor="middle" font-size="20" fill="#475569">階級</text><text x="35" y="200" transform="rotate(-90 35 200)" text-anchor="middle" font-size="20" fill="#475569">度数</text>`),

  boxplot: fig('boxplot-quartiles','箱ひげ図と最小値・四分位数・中央値・最大値の位置','箱ひげ図は5数要約を1本の軸上で読む',
    `<line x1="100" y1="220" x2="660" y2="220" stroke="#334155" stroke-width="2.5"/><line x1="150" y1="190" x2="150" y2="250" stroke="#334155" stroke-width="3"/><line x1="610" y1="190" x2="610" y2="250" stroke="#334155" stroke-width="3"/><rect x="250" y="155" width="260" height="130" fill="#eff6ff" stroke="#2563eb" stroke-width="4"/><line x1="385" y1="155" x2="385" y2="285" stroke="#ea580c" stroke-width="4"/>
    <g font-size="18" fill="#475569" text-anchor="middle"><text x="150" y="315">最小</text><text x="250" y="315">Q1</text><text x="385" y="315">中央値</text><text x="510" y="315">Q3</text><text x="610" y="315">最大</text></g>`),

  scatter: fig('scatter-correlation','正の相関・負の相関・相関なしを比較する散布図','散布図では点の全体的な傾向を見る',
    `<text x="125" y="45" text-anchor="middle" font-size="21" font-weight="700">正の相関</text><text x="380" y="45" text-anchor="middle" font-size="21" font-weight="700">負の相関</text><text x="635" y="45" text-anchor="middle" font-size="21" font-weight="700">相関なし</text>
    <g fill="#2563eb">${[[70,280],[95,250],[120,230],[145,190],[170,165],[195,130]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g>
    <g fill="#ea580c">${[[325,125],[350,145],[375,185],[400,200],[425,245],[450,275]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g>
    <g fill="#16a34a">${[[575,160],[600,275],[625,120],[650,225],[675,185],[700,295]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g>
    <g stroke="#94a3b8" stroke-width="2"><line x1="50" y1="320" x2="220" y2="320"/><line x1="50" y1="80" x2="50" y2="320"/><line x1="305" y1="320" x2="475" y2="320"/><line x1="305" y1="80" x2="305" y2="320"/><line x1="560" y1="320" x2="730" y2="320"/><line x1="560" y1="80" x2="560" y2="320"/></g>`),

  dataTransform: fig('data-transform','データに定数を足す変換と定数倍する変換を比較する2つの数直線','＋b は散らばりを変えずに位置を移し、×a は中心と散らばりの両方を拡大縮小する',
    `<text x="195" y="45" text-anchor="middle" font-size="21" font-weight="700">y=x+b</text>
    <text x="565" y="45" text-anchor="middle" font-size="21" font-weight="700">y=ax</text>
    <line x1="55" y1="190" x2="335" y2="190" stroke="#334155" stroke-width="2.5"/>
    <circle cx="125" cy="165" r="7" fill="#2563eb"/><circle cx="178" cy="165" r="7" fill="#2563eb"/><circle cx="230" cy="165" r="7" fill="#2563eb"/>
    <circle cx="195" cy="215" r="7" fill="#ea580c"/><circle cx="248" cy="215" r="7" fill="#ea580c"/><circle cx="300" cy="215" r="7" fill="#ea580c"/>
    <path d="M145 115 C180 95 205 95 240 115" fill="none" stroke="#64748b" stroke-width="2.5"/><path d="M240 115 l-12 -7 l2 14 z" fill="#64748b"/>
    <text x="195" y="282" text-anchor="middle" font-size="18" fill="#475569">＋b：間隔は変わらない</text>
    <line x1="425" y1="190" x2="705" y2="190" stroke="#334155" stroke-width="2.5"/>
    <circle cx="495" cy="165" r="7" fill="#2563eb"/><circle cx="548" cy="165" r="7" fill="#2563eb"/><circle cx="600" cy="165" r="7" fill="#2563eb"/>
    <circle cx="455" cy="215" r="7" fill="#ea580c"/><circle cx="550" cy="215" r="7" fill="#ea580c"/><circle cx="645" cy="215" r="7" fill="#ea580c"/>
    <text x="565" y="282" text-anchor="middle" font-size="18" fill="#475569">×a：間隔も |a| 倍</text>
    <text x="380" y="360" text-anchor="middle" font-size="20" fill="#1f2937">平均：a x̄+b　　分散：a²倍　　標準偏差：|a|倍</text>`),

  statsCycle: fig('statistical-process','統計的探究の流れを循環で示す図','問い→収集→分析→解釈→次の問いの循環',
    `<g font-size="20" font-weight="700" text-anchor="middle"><rect x="300" y="45" width="160" height="55" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/><text x="380" y="79">問いを立てる</text><rect x="520" y="175" width="150" height="55" rx="14" fill="#fff7ed" stroke="#ea580c" stroke-width="3"/><text x="595" y="209">データ収集</text><rect x="300" y="305" width="160" height="55" rx="14" fill="#f0fdf4" stroke="#16a34a" stroke-width="3"/><text x="380" y="339">分析・解釈</text><rect x="90" y="175" width="150" height="55" rx="14" fill="#f8fafc" stroke="#64748b" stroke-width="3"/><text x="165" y="209">次の問い</text></g><path d="M455 95 C520 110 555 140 575 172 M520 225 C485 280 450 300 430 305 M300 330 C230 315 190 275 170 230 M165 175 C190 120 240 95 300 82" fill="none" stroke="#94a3b8" stroke-width="3"/>`),

  outlier: fig('outlier-boxplot','箱ひげ図の外側に離れた値を示す図','外れ値は分布全体と離れた位置に現れる',
    `<line x1="120" y1="220" x2="570" y2="220" stroke="#334155" stroke-width="2.5"/><rect x="250" y="165" width="210" height="110" fill="#eff6ff" stroke="#2563eb" stroke-width="4"/><line x1="355" y1="165" x2="355" y2="275" stroke="#ea580c" stroke-width="4"/><circle cx="655" cy="220" r="9" fill="#ea580c"/><text x="655" y="185" text-anchor="middle" font-size="20" fill="#ea580c">外れ値候補</text>`),

  countTree: fig('counting-tree','選択肢を枝分かれで数える樹形図','積の法則は各段階の選択肢を枝で表すと見やすい',
    `<circle cx="90" cy="210" r="7" fill="#1f2937"/><g stroke="#64748b" stroke-width="3"><line x1="97" y1="210" x2="270" y2="105"/><line x1="97" y1="210" x2="270" y2="210"/><line x1="97" y1="210" x2="270" y2="315"/><line x1="270" y1="105" x2="520" y2="70"/><line x1="270" y1="105" x2="520" y2="140"/><line x1="270" y1="210" x2="520" y2="175"/><line x1="270" y1="210" x2="520" y2="245"/><line x1="270" y1="315" x2="520" y2="280"/><line x1="270" y1="315" x2="520" y2="350"/></g><g font-size="20" fill="#475569"><text x="280" y="95">A</text><text x="280" y="205">B</text><text x="280" y="310">C</text><text x="535" y="78">1</text><text x="535" y="148">2</text><text x="535" y="183">1</text><text x="535" y="253">2</text></g>`),

  circular: fig('circular-permutation','円卓上に人を並べる円順列の模式図','回転して一致する並びは同じものとして扱う',
    `<circle cx="380" cy="210" r="110" fill="#f8fafc" stroke="#64748b" stroke-width="3"/><g fill="#2563eb">${[[380,70],[500,130],[500,290],[380,350],[260,290],[260,130]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="24"/>`).join('')}</g><text x="380" y="215" text-anchor="middle" font-size="22" fill="#475569">円卓</text><path d="M565 165 A190 190 0 0 1 570 260" fill="none" stroke="#ea580c" stroke-width="3"/><path d="M570 260 l-10 -12 l16 -1 z" fill="#ea580c"/><text x="610" y="220" font-size="20" fill="#ea580c">回転</text>`),

  choose: fig('combination-selection','複数の対象から順序を気にせず選ぶ模式図','組合せでは選んだ集合だけを区別する',
    `<g>${[0,1,2,3,4,5].map(i=>`<circle cx="${145+i*95}" cy="185" r="34" fill="${i===1||i===4?'#dbeafe':'#f8fafc'}" stroke="${i===1||i===4?'#2563eb':'#94a3b8'}" stroke-width="3"/><text x="${145+i*95}" y="193" text-anchor="middle" font-size="22" fill="#1f2937">${String.fromCharCode(65+i)}</text>`).join('')}</g><text x="380" y="290" text-anchor="middle" font-size="21" fill="#475569">選ぶ順番ではなく、選ばれた組を数える</text>`),

  sampleSpace: fig('sample-space','全事象を長方形、事象をその内部の領域で表す図','確率ではまず全事象と事象の範囲を分ける',
    `<rect x="100" y="70" width="560" height="280" rx="12" fill="#f8fafc" stroke="#1f2937" stroke-width="4"/><ellipse cx="320" cy="210" rx="150" ry="95" fill="#dbeafe" stroke="#2563eb" stroke-width="4"/><text x="125" y="105" font-size="24" font-weight="700">全事象 Ω</text><text x="320" y="220" text-anchor="middle" font-size="28" font-weight="700" fill="#2563eb">事象 A</text>`),

  complementProb: fig('complement-event','事象 A とその余事象を全事象内で分けた図','A と Ā は全事象をちょうど2つに分ける',
    `<rect x="100" y="70" width="560" height="280" rx="12" fill="#fff7ed" stroke="#1f2937" stroke-width="4"/><ellipse cx="330" cy="210" rx="140" ry="95" fill="#dbeafe" stroke="#2563eb" stroke-width="4"/><text x="330" y="220" text-anchor="middle" font-size="28" fill="#2563eb">A</text><text x="565" y="220" text-anchor="middle" font-size="28" fill="#ea580c">Ā</text><text x="380" y="390" text-anchor="middle" font-size="21" fill="#475569">P(A)+P(Ā)=1</text>`),

  probTree: fig('probability-tree','2段階の試行を確率付きの樹形図で示す図','条件付き確率・反復試行は枝ごとの確率を追う',
    `<circle cx="95" cy="210" r="7" fill="#1f2937"/><g stroke="#64748b" stroke-width="3"><line x1="102" y1="210" x2="300" y2="125"/><line x1="102" y1="210" x2="300" y2="295"/><line x1="300" y1="125" x2="560" y2="80"/><line x1="300" y1="125" x2="560" y2="170"/><line x1="300" y1="295" x2="560" y2="250"/><line x1="300" y1="295" x2="560" y2="340"/></g><g font-size="19" fill="#475569"><text x="185" y="145">p</text><text x="185" y="290">1−p</text><text x="420" y="95">q</text><text x="420" y="175">1−q</text></g>`),

  internalExternal: fig('internal-external-division','線分の内分点と外分点を示す図','内分・外分は点の位置と比の向きを図で確認する',
    `<line x1="100" y1="180" x2="660" y2="180" stroke="#334155" stroke-width="3"/><circle cx="180" cy="180" r="7" fill="#1f2937"/><circle cx="430" cy="180" r="7" fill="#2563eb"/><circle cx="590" cy="180" r="7" fill="#1f2937"/><text x="180" y="220" text-anchor="middle" font-size="21">A</text><text x="430" y="220" text-anchor="middle" font-size="21" fill="#2563eb">P</text><text x="590" y="220" text-anchor="middle" font-size="21">B</text><text x="385" y="120" text-anchor="middle" font-size="21" fill="#475569">内分点は A と B の間</text>
    <line x1="100" y1="330" x2="700" y2="330" stroke="#334155" stroke-width="3"/><circle cx="180" cy="330" r="7" fill="#1f2937"/><circle cx="430" cy="330" r="7" fill="#1f2937"/><circle cx="620" cy="330" r="7" fill="#ea580c"/><text x="620" y="370" text-anchor="middle" font-size="21" fill="#ea580c">Q</text>`),

  angleBisector: fig('angle-bisector','不等辺三角形 ABC の角 A の二等分線 AD と辺の比を示す図','AD は実際の角の二等分線で、BD:DC=AB:AC を満たす',
    `<polygon points="350,70 100,340 650,340" fill="none" stroke="#1f2937" stroke-width="4"/>
    <line x1="350" y1="70" x2="362.3" y2="340" stroke="#2563eb" stroke-width="4"/>
    <path d="M 319.69 104.33 A 46 46 0 0 1 352.09 115.95" fill="none" stroke="#ea580c" stroke-width="3"/>
    <path d="M 352.09 115.95 A 46 46 0 0 1 382.29 102.76" fill="none" stroke="#ea580c" stroke-width="3"/>
    <text x="350" y="50" text-anchor="middle" font-size="20">A</text><text x="82" y="364" text-anchor="middle" font-size="20">B</text><text x="668" y="364" text-anchor="middle" font-size="20">C</text>
    <text x="362.3" y="370" text-anchor="middle" font-size="20" fill="#2563eb">D</text>
    <text x="380" y="410" text-anchor="middle" font-size="20" fill="#475569">BD : DC = AB : AC</text>`),

  centroid: fig('triangle-centroid','不等辺三角形の3本の中線と重心 G を示す図','各中線は辺の中点へ引かれ、3本は G で交わる',
    `<polygon points="365,65 95,340 655,315" fill="none" stroke="#1f2937" stroke-width="4"/>
    <line x1="365" y1="65" x2="375" y2="327.5" stroke="#2563eb" stroke-width="3"/>
    <line x1="95" y1="340" x2="510" y2="190" stroke="#2563eb" stroke-width="3"/>
    <line x1="655" y1="315" x2="230" y2="202.5" stroke="#2563eb" stroke-width="3"/>
    <circle cx="375" cy="327.5" r="5" fill="#64748b"/><circle cx="510" cy="190" r="5" fill="#64748b"/><circle cx="230" cy="202.5" r="5" fill="#64748b"/>
    <circle cx="371.67" cy="240" r="8" fill="#ea580c"/><text x="392" y="232" font-size="20" fill="#ea580c">G</text>
    <text x="380" y="405" text-anchor="middle" font-size="20" fill="#475569">3本の中線は G で交わり、各中線を 2:1 に分ける</text>`),

  centers: fig('triangle-centers','外心・内心・垂心をそれぞれの構成線とともに比較する図','外心＝垂直二等分線、内心＝角の二等分線、垂心＝高さの交点',
    `<g transform="translate(5 0)">
      <text x="110" y="35" text-anchor="middle" font-size="20" font-weight="700">外心 O</text>
      <polygon points="100,60 25,245 205,225" fill="none" stroke="#1f2937" stroke-width="3"/>
      <line x1="-2.25" y1="126.25" x2="127.25" y2="178.75" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="94.75" y1="179.25" x2="210.25" y2="105.75" stroke="#2563eb" stroke-width="2.5"/>
      <circle cx="107.88" cy="170.9" r="7" fill="#ea580c"/><text x="122" y="163" font-size="17" fill="#ea580c">O</text>
      <text x="110" y="275" text-anchor="middle" font-size="16" fill="#475569">垂直二等分線</text>
    </g>
    <g transform="translate(255 0)">
      <text x="110" y="35" text-anchor="middle" font-size="20" font-weight="700">内心 I</text>
      <polygon points="100,60 25,245 205,225" fill="none" stroke="#1f2937" stroke-width="3"/>
      <line x1="100" y1="60" x2="115.92" y2="234.9" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="25" y1="245" x2="155.05" y2="146.51" stroke="#2563eb" stroke-width="2.5"/>
      <circle cx="110.92" cy="179.94" r="7" fill="#ea580c"/><text x="125" y="172" font-size="17" fill="#ea580c">I</text>
      <text x="110" y="275" text-anchor="middle" font-size="16" fill="#475569">角の二等分線</text>
    </g>
    <g transform="translate(505 0)">
      <text x="110" y="35" text-anchor="middle" font-size="20" font-weight="700">垂心 H</text>
      <polygon points="100,60 25,245 205,225" fill="none" stroke="#1f2937" stroke-width="3"/>
      <line x1="100" y1="60" x2="119.39" y2="234.51" stroke="#2563eb" stroke-width="2.5"/>
      <line x1="25" y1="245" x2="162.18" y2="157.71" stroke="#2563eb" stroke-width="2.5"/>
      <circle cx="114.25" cy="188.21" r="7" fill="#ea580c"/><text x="129" y="180" font-size="17" fill="#ea580c">H</text>
      <text x="110" y="275" text-anchor="middle" font-size="16" fill="#475569">高さ</text>
    </g>
    <text x="380" y="345" text-anchor="middle" font-size="18" fill="#475569">点の位置ではなく「どの線の交点か」で判別する</text>`),

  ceva: fig('ceva','D,E,F が各辺上にあり AD,BE,CF が1点 P で交わるチェバの定理の図','3本の線は同一点 P を通る',
    `<polygon points="375,65 90,340 670,330" fill="none" stroke="#1f2937" stroke-width="4"/>
    <line x1="375" y1="65" x2="432.66" y2="334.09" stroke="#2563eb" stroke-width="3"/>
    <line x1="90" y1="340" x2="490.2" y2="168.49" stroke="#2563eb" stroke-width="3"/>
    <line x1="670" y1="330" x2="287.4" y2="149.53" stroke="#2563eb" stroke-width="3"/>
    <circle cx="405" cy="205" r="8" fill="#ea580c"/>
    <circle cx="432.66" cy="334.09" r="5" fill="#2563eb"/><circle cx="490.2" cy="168.49" r="5" fill="#2563eb"/><circle cx="287.4" cy="149.53" r="5" fill="#2563eb"/>
    <text x="375" y="48" text-anchor="middle" font-size="19">A</text><text x="74" y="363" text-anchor="middle" font-size="19">B</text><text x="686" y="353" text-anchor="middle" font-size="19">C</text>
    <text x="432.66" y="363" text-anchor="middle" font-size="18" fill="#2563eb">D</text><text x="508" y="163" font-size="18" fill="#2563eb">E</text><text x="270" y="142" text-anchor="end" font-size="18" fill="#2563eb">F</text>
    <text x="420" y="195" font-size="18" fill="#ea580c">P</text>
    <text x="380" y="405" text-anchor="middle" font-size="19" fill="#475569">AD・BE・CF は同じ点 P で交わる</text>`),

  menelaus: fig('menelaus','三角形の3辺または延長と一直線が交わる D,E,F を示すメネラウスの定理の図','D,E,F は同じ直線上にあり、各点は対応する辺または延長との交点',
    `<polygon points="370,65 115,335 650,335" fill="none" stroke="#1f2937" stroke-width="4"/>
    <line x1="150" y1="180" x2="730" y2="338" stroke="#2563eb" stroke-width="4"/>
    <circle cx="238.57" cy="204.16" r="6" fill="#ea580c"/><circle cx="623.05" cy="309.01" r="6" fill="#ea580c"/><circle cx="718.33" cy="335" r="6" fill="#ea580c"/>
    <text x="370" y="48" text-anchor="middle" font-size="19">A</text><text x="99" y="358" text-anchor="middle" font-size="19">B</text><text x="666" y="358" text-anchor="middle" font-size="19">C</text>
    <text x="222" y="196" text-anchor="end" font-size="18" fill="#ea580c">F</text><text x="638" y="300" font-size="18" fill="#ea580c">E</text><text x="718" y="365" text-anchor="middle" font-size="18" fill="#ea580c">D</text>
    <text x="380" y="405" text-anchor="middle" font-size="19" fill="#475569">D・E・F は1本の直線上</text>`),

  cyclic: fig('cyclic-angle','同じ弧に対する円周角が等しいことを示す図','同じ弧を見込む円周角は等しい',
    `<circle cx="380" cy="210" r="150" fill="none" stroke="#1f2937" stroke-width="4"/><circle cx="260" cy="300" r="6" fill="#1f2937"/><circle cx="500" cy="300" r="6" fill="#1f2937"/><circle cx="300" cy="90" r="6" fill="#2563eb"/><circle cx="460" cy="90" r="6" fill="#ea580c"/><line x1="300" y1="90" x2="260" y2="300" stroke="#2563eb" stroke-width="3"/><line x1="300" y1="90" x2="500" y2="300" stroke="#2563eb" stroke-width="3"/><line x1="460" y1="90" x2="260" y2="300" stroke="#ea580c" stroke-width="3"/><line x1="460" y1="90" x2="500" y2="300" stroke="#ea580c" stroke-width="3"/>`),

  cyclicQuad: fig('cyclic-quadrilateral','同じ円周上の4点 A,B,C,D を結んだ内接四角形','4頂点は同一円周上にあり、向かい合う角の和が180°になる',
    `<circle cx="380" cy="210" r="145" fill="none" stroke="#64748b" stroke-width="3"/>
    <polygon points="248.59,148.72 307.5,335.57 505.57,282.5 463.17,91.22" fill="none" stroke="#2563eb" stroke-width="4"/>
    <text x="230" y="158" font-size="19">A</text><text x="297" y="362" font-size="19">B</text><text x="520" y="290" font-size="19">C</text><text x="475" y="82" font-size="19">D</text>
    <text x="380" y="405" text-anchor="middle" font-size="20" fill="#475569">A,B,C,D はすべて同一円周上</text>`),

  tangentChord: fig('tangent-chord','接点 T の接線と弦 TA の角、同じ弦 TA を見る円周角 TBA を示す図','接弦定理で比較する2つの角を同じ図に明示する',
    `<circle cx="370" cy="220" r="135" fill="none" stroke="#1f2937" stroke-width="4"/>
    <line x1="505" y1="65" x2="505" y2="380" stroke="#2563eb" stroke-width="4"/>
    <line x1="505" y1="220" x2="274.54" y2="315.46" stroke="#ea580c" stroke-width="4"/>
    <line x1="302.5" y1="103.09" x2="505" y2="220" stroke="#64748b" stroke-width="3"/>
    <line x1="302.5" y1="103.09" x2="274.54" y2="315.46" stroke="#64748b" stroke-width="3"/>
    <path d="M505 178 A42 42 0 0 0 467.8 200.5" fill="none" stroke="#ea580c" stroke-width="3"/>
    <path d="M339 124 A42 42 0 0 0 294 145" fill="none" stroke="#ea580c" stroke-width="3"/>
    <circle cx="505" cy="220" r="6" fill="#1f2937"/><circle cx="274.54" cy="315.46" r="5" fill="#1f2937"/><circle cx="302.5" cy="103.09" r="5" fill="#1f2937"/>
    <text x="522" y="227" font-size="19">T</text><text x="255" y="335" font-size="19">A</text><text x="286" y="92" font-size="19">B</text>
    <text x="380" y="410" text-anchor="middle" font-size="20" fill="#475569">接線と弦 TA の角 ＝ ∠TBA</text>`),

  power: fig('power-of-point','円外の点 P から2本の割線 P-A-B, P-C-D と接線 PT を引いた図','A,B,C,D は円との交点で、PA·PB=PC·PD=PT² を満たす',
    `<circle cx="470" cy="215" r="108" fill="none" stroke="#1f2937" stroke-width="4"/>
    <line x1="115" y1="215" x2="720" y2="81.9" stroke="#2563eb" stroke-width="3"/>
    <line x1="115" y1="215" x2="710" y2="381.6" stroke="#2563eb" stroke-width="3"/>
    <line x1="115" y1="215" x2="437.14" y2="112.12" stroke="#16a34a" stroke-width="4"/>
    <circle cx="115" cy="215" r="7" fill="#ea580c"/>
    <circle cx="378.94" cy="156.93" r="5" fill="#2563eb"/><circle cx="528.28" cy="124.08" r="5" fill="#2563eb"/>
    <circle cx="396.02" cy="293.69" r="5" fill="#2563eb"/><circle cx="492.36" cy="320.66" r="5" fill="#2563eb"/>
    <circle cx="437.14" cy="112.12" r="5" fill="#16a34a"/>
    <text x="95" y="198" font-size="19" fill="#ea580c">P</text><text x="378.94" y="140" text-anchor="middle" font-size="18" fill="#2563eb">A</text><text x="528.28" y="108" text-anchor="middle" font-size="18" fill="#2563eb">B</text>
    <text x="396.02" y="318" text-anchor="middle" font-size="18" fill="#2563eb">C</text><text x="492.36" y="345" text-anchor="middle" font-size="18" fill="#2563eb">D</text><text x="437.14" y="95" text-anchor="middle" font-size="18" fill="#16a34a">T</text>
    <text x="380" y="410" text-anchor="middle" font-size="19" fill="#475569">PA·PB = PC·PD = PT²</text>`),

  twoCircles: fig('two-circles','2つの円の共通弦と中心線、共通接線と半径の垂直関係を示す2図','共通弦は中心を結ぶ線に垂直、接点への半径は共通接線に垂直',
    `<text x="245" y="40" text-anchor="middle" font-size="20" font-weight="700">共通弦</text>
    <circle cx="185" cy="205" r="88" fill="none" stroke="#2563eb" stroke-width="3"/><circle cx="305" cy="205" r="88" fill="none" stroke="#ea580c" stroke-width="3"/>
    <line x1="185" y1="205" x2="305" y2="205" stroke="#64748b" stroke-width="2.5" stroke-dasharray="7 7"/><line x1="245" y1="140.63" x2="245" y2="269.37" stroke="#16a34a" stroke-width="4"/>
    <circle cx="185" cy="205" r="5" fill="#2563eb"/><circle cx="305" cy="205" r="5" fill="#ea580c"/>
    <text x="245" y="335" text-anchor="middle" font-size="18" fill="#475569">共通弦 ⟂ 中心線</text>
    <text x="585" y="40" text-anchor="middle" font-size="20" font-weight="700">共通接線</text>
    <circle cx="515" cy="205" r="70" fill="none" stroke="#2563eb" stroke-width="3"/><circle cx="650" cy="205" r="70" fill="none" stroke="#ea580c" stroke-width="3"/>
    <line x1="455" y1="135" x2="710" y2="135" stroke="#16a34a" stroke-width="4"/><line x1="515" y1="205" x2="515" y2="135" stroke="#64748b" stroke-width="3"/><line x1="650" y1="205" x2="650" y2="135" stroke="#64748b" stroke-width="3"/>
    <path d="M515 149 h14 v-14" fill="none" stroke="#64748b" stroke-width="2.5"/><path d="M650 149 h14 v-14" fill="none" stroke="#64748b" stroke-width="2.5"/>
    <text x="585" y="335" text-anchor="middle" font-size="18" fill="#475569">半径 ⟂ 接線</text>`),

  construction: fig('basic-construction','コンパスと直線による垂直二等分線の作図模式図','作図では同じ半径の円弧の交点を利用する',
    `<line x1="160" y1="260" x2="600" y2="260" stroke="#1f2937" stroke-width="4"/><circle cx="160" cy="260" r="7" fill="#1f2937"/><circle cx="600" cy="260" r="7" fill="#1f2937"/><path d="M160 260 m0 -190 a190 190 0 0 1 0 380" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="7 7"/><path d="M600 260 m0 -190 a190 190 0 0 0 0 380" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="7 7"/><line x1="380" y1="65" x2="380" y2="390" stroke="#16a34a" stroke-width="4"/>`),

  linePlane: fig('line-plane','直線と平面の交わり方を示す空間模式図','平行・交差・平面上の3種類を区別する',
    `<polygon points="130,300 540,300 650,180 240,180" fill="#f8fafc" stroke="#64748b" stroke-width="3"/><line x1="90" y1="120" x2="610" y2="120" stroke="#2563eb" stroke-width="4"/><line x1="350" y1="70" x2="400" y2="340" stroke="#ea580c" stroke-width="4"/><line x1="210" y1="250" x2="550" y2="250" stroke="#16a34a" stroke-width="4"/><text x="610" y="105" font-size="19" fill="#2563eb">平行</text><text x="405" y="80" font-size="19" fill="#ea580c">交わる</text><text x="530" y="240" font-size="19" fill="#16a34a">平面上</text>`),

  fiveCenters: fig('five-centers-summary','三角形の五心を交わる線の種類で整理した比較図','重心・外心・内心・垂心・傍心を構成線で区別する',
    `<g font-size="16" text-anchor="middle">
    <g transform="translate(20 70)"><rect width="135" height="220" rx="12" fill="#f8fafc" stroke="#cbd5e1"/><text x="67" y="30" font-weight="700">重心 G</text><polygon points="25,175 110,175 65,65" fill="none" stroke="#1f2937" stroke-width="2.5"/><line x1="65" y1="65" x2="67" y2="175" stroke="#2563eb" stroke-width="2.5"/><line x1="25" y1="175" x2="88" y2="120" stroke="#2563eb" stroke-width="2.5"/><text x="67" y="205" fill="#475569">中線</text></g>
    <g transform="translate(165 70)"><rect width="135" height="220" rx="12" fill="#f8fafc" stroke="#cbd5e1"/><text x="67" y="30" font-weight="700">外心 O</text><polygon points="25,175 110,175 65,65" fill="none" stroke="#1f2937" stroke-width="2.5"/><line x1="67" y1="50" x2="67" y2="195" stroke="#2563eb" stroke-width="2.5"/><line x1="10" y1="120" x2="125" y2="120" stroke="#2563eb" stroke-width="2.5"/><text x="67" y="205" fill="#475569">垂直二等分線</text></g>
    <g transform="translate(310 70)"><rect width="135" height="220" rx="12" fill="#f8fafc" stroke="#cbd5e1"/><text x="67" y="30" font-weight="700">内心 I</text><polygon points="25,175 110,175 65,65" fill="none" stroke="#1f2937" stroke-width="2.5"/><line x1="65" y1="65" x2="67" y2="175" stroke="#2563eb" stroke-width="2.5"/><line x1="25" y1="175" x2="78" y2="112" stroke="#2563eb" stroke-width="2.5"/><text x="67" y="205" fill="#475569">内角二等分線</text></g>
    <g transform="translate(455 70)"><rect width="135" height="220" rx="12" fill="#f8fafc" stroke="#cbd5e1"/><text x="67" y="30" font-weight="700">垂心 H</text><polygon points="25,175 110,175 65,65" fill="none" stroke="#1f2937" stroke-width="2.5"/><line x1="65" y1="65" x2="67" y2="175" stroke="#2563eb" stroke-width="2.5"/><line x1="25" y1="175" x2="94" y2="92" stroke="#2563eb" stroke-width="2.5"/><text x="67" y="205" fill="#475569">高さ</text></g>
    <g transform="translate(600 70)"><rect width="135" height="220" rx="12" fill="#fff7ed" stroke="#fed7aa"/><text x="67" y="30" font-weight="700">傍心 Iₐ</text><polygon points="25,175 110,175 65,65" fill="none" stroke="#1f2937" stroke-width="2.5"/><line x1="65" y1="65" x2="67" y2="200" stroke="#ea580c" stroke-width="2.5"/><line x1="10" y1="190" x2="96" y2="85" stroke="#ea580c" stroke-width="2.5"/><text x="67" y="205" fill="#9a3412">内・外角二等分線</text></g></g>
    <text x="380" y="350" text-anchor="middle" font-size="20" fill="#475569">五心は「どの線を交わらせた点か」を区別する</text>`),

  cevaReverse: fig('ceva-reverse','比の積が1という条件から3本 AD,BE,CF が共点になるチェバの逆の図','数値条件から共点を結論する向きを示す',
    `<polygon points="375,65 90,340 670,330" fill="none" stroke="#1f2937" stroke-width="4"/><line x1="375" y1="65" x2="432.66" y2="334.09" stroke="#2563eb" stroke-width="3"/><line x1="90" y1="340" x2="490.2" y2="168.49" stroke="#2563eb" stroke-width="3"/><line x1="670" y1="330" x2="287.4" y2="149.53" stroke="#2563eb" stroke-width="3"/><circle cx="405" cy="205" r="8" fill="#ea580c"/><text x="380" y="405" text-anchor="middle" font-size="19" fill="#475569">(BD/DC)(CE/EA)(AF/FB)=1 ⇒ 3本は共点</text>`),

  menelausReverse: fig('menelaus-reverse','比の積が1という条件から D,E,F が一直線になるメネラウスの逆の図','数値条件から共線を結論する向きを示す',
    `<polygon points="370,65 115,335 650,335" fill="none" stroke="#1f2937" stroke-width="4"/><line x1="150" y1="180" x2="730" y2="338" stroke="#2563eb" stroke-width="4"/><circle cx="238.57" cy="204.16" r="6" fill="#ea580c"/><circle cx="623.05" cy="309.01" r="6" fill="#ea580c"/><circle cx="718.33" cy="335" r="6" fill="#ea580c"/><text x="380" y="405" text-anchor="middle" font-size="19" fill="#475569">比の積=1 ⇒ D・E・F は一直線上</text>`),

  threePerpendicular: fig('three-perpendicular','平面 α、点 P、垂足 H、斜線 PQ、射影 HQ、平面内直線 l を3D座標から投影した三垂線の定理の図','PH⊥α、l⊥HQ を満たし、その結果 l⊥PQ になる',
    `<polygon points="382.28,400.32 756.68,202.72 549.32,93.28 174.92,290.88" fill="#f8fafc" stroke="#64748b" stroke-width="3"/>
    <line x1="365" y1="300" x2="365" y2="112.8" stroke="#ea580c" stroke-width="4"/>
    <line x1="365" y1="112.8" x2="581" y2="186" stroke="#2563eb" stroke-width="4"/>
    <line x1="365" y1="300" x2="581" y2="186" stroke="#16a34a" stroke-width="4"/>
    <line x1="445.35" y1="342.41" x2="284.65" y2="257.59" stroke="#7c3aed" stroke-width="4"/>
    <circle cx="365" cy="300" r="6" fill="#1f2937"/><circle cx="365" cy="112.8" r="6" fill="#1f2937"/><circle cx="581" cy="186" r="6" fill="#1f2937"/>
    <text x="365" y="92" text-anchor="middle" font-size="19">P</text><text x="347" y="325" font-size="19">H</text><text x="596" y="194" font-size="19">Q</text><text x="188" y="276" font-size="19" fill="#475569">平面 α</text><text x="278" y="248" font-size="19" fill="#7c3aed">l</text>
    <text x="380" y="420" text-anchor="middle" font-size="19" fill="#475569">PH⊥α，l⊥HQ（射影） ⇒ l⊥PQ</text>`),

  polyhedra: fig('polyhedra-euler','多面体の頂点・辺・面を示す立方体','オイラーの公式では頂点・辺・面を数える',
    `<rect x="190" y="140" width="280" height="210" fill="none" stroke="#1f2937" stroke-width="4"/><rect x="300" y="70" width="280" height="210" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="190" y1="140" x2="300" y2="70" stroke="#1f2937" stroke-width="4"/><line x1="470" y1="140" x2="580" y2="70" stroke="#1f2937" stroke-width="4"/><line x1="470" y1="350" x2="580" y2="280" stroke="#1f2937" stroke-width="4"/><line x1="190" y1="350" x2="300" y2="280" stroke="#1f2937" stroke-width="4"/><text x="380" y="395" text-anchor="middle" font-size="21" fill="#475569">V − E + F = 2</text>`),

  placeValue: fig('place-value','位取り記数法の各桁と重みを示す図','各桁は基数の累乗を重みとして持つ',
    `<g font-size="22" text-anchor="middle"><rect x="120" y="130" width="520" height="120" fill="#f8fafc" stroke="#64748b" stroke-width="3"/>${[0,1,2,3].map(i=>`<line x1="${250+i*130}" y1="130" x2="${250+i*130}" y2="250" stroke="#cbd5e1" stroke-width="2"/>`).join('')}<text x="185" y="185">a₃</text><text x="315" y="185">a₂</text><text x="445" y="185">a₁</text><text x="575" y="185">a₀</text><text x="185" y="225">b³</text><text x="315" y="225">b²</text><text x="445" y="225">b¹</text><text x="575" y="225">b⁰</text></g>`),

  positionGrid: fig('position-grid','格子上の位置を2つの数で表す座標模式図','基準・方向・量を固定すると位置を一意に表せる',
    `<g stroke="#cbd5e1" stroke-width="1.5">${[0,1,2,3,4,5].map(i=>`<line x1="${160+i*80}" y1="80" x2="${160+i*80}" y2="340"/>`).join('')}${[0,1,2,3].map(i=>`<line x1="160" y1="${100+i*70}" x2="560" y2="${100+i*70}"/>`).join('')}</g><circle cx="400" cy="240" r="9" fill="#ea580c"/><text x="420" y="230" font-size="21" fill="#ea580c">(x,y)</text><line x1="160" y1="340" x2="610" y2="340" stroke="#334155" stroke-width="2.5"/><line x1="160" y1="340" x2="160" y2="50" stroke="#334155" stroke-width="2.5"/>`),

  earth: fig('earth-measurement','地球断面と2地点・中心角を示す測量模式図','地表距離と中心角の比から地球周長を推定する',
    `<circle cx="380" cy="230" r="150" fill="none" stroke="#2563eb" stroke-width="4"/><circle cx="380" cy="230" r="7" fill="#1f2937"/><line x1="380" y1="230" x2="305" y2="100" stroke="#64748b" stroke-width="3"/><line x1="380" y1="230" x2="455" y2="100" stroke="#64748b" stroke-width="3"/><path d="M340 160 A80 80 0 0 1 420 160" fill="none" stroke="#ea580c" stroke-width="3"/><text x="380" y="145" text-anchor="middle" font-size="21" fill="#ea580c">中心角</text><path d="M305 100 A150 150 0 0 1 455 100" fill="none" stroke="#16a34a" stroke-width="6"/><text x="380" y="65" text-anchor="middle" font-size="20" fill="#16a34a">地表距離</text>`),

  domino: fig('domino-invariant','市松模様の盤面とドミノ1枚が黒白1マスずつ覆う図','色分けすると操作で変わらない量を見つけられる',
    `<g>${Array.from({length:32},(_,i)=>{const r=Math.floor(i/8),c=i%8;return `<rect x="${150+c*55}" y="${70+r*55}" width="55" height="55" fill="${(r+c)%2===0?'#e2e8f0':'#64748b'}" stroke="#fff" stroke-width="1"/>`}).join('')}</g><rect x="260" y="125" width="110" height="55" fill="none" stroke="#ea580c" stroke-width="5"/><text x="380" y="335" text-anchor="middle" font-size="21" fill="#475569">ドミノ1枚は黒1・白1を覆う</text>`),

  gridPath: fig('grid-shortest-path','格子上の最短経路を東・北の並びとして表す図','最短経路は必要な東移動と北移動の並べ方に置き換える',
    `<g stroke="#cbd5e1" stroke-width="2">${Array.from({length:6},(_,i)=>`<line x1="${140+i*90}" y1="80" x2="${140+i*90}" y2="350"/>`).join('')}${Array.from({length:4},(_,i)=>`<line x1="140" y1="${80+i*90}" x2="590" y2="${80+i*90}"/>`).join('')}</g><circle cx="140" cy="350" r="8" fill="#2563eb"/><circle cx="590" cy="80" r="8" fill="#ea580c"/><path d="M140 350 H320 V260 H410 V170 H590 V80" fill="none" stroke="#16a34a" stroke-width="5"/><text x="120" y="380" font-size="20" fill="#2563eb">A</text><text x="605" y="75" font-size="20" fill="#ea580c">B</text><text x="380" y="405" text-anchor="middle" font-size="20" fill="#475569">東・北の順番だけが変わる</text>`),

  parallelSimilarity: fig('parallel-similarity','三角形内の平行線で相似が生じる図','平行線から等しい角を作り相似へつなげる',
    `<polygon points="120,340 650,340 380,70" fill="none" stroke="#1f2937" stroke-width="4"/><line x1="230" y1="230" x2="540" y2="230" stroke="#2563eb" stroke-width="4"/><text x="195" y="230" font-size="20">D</text><text x="555" y="230" font-size="20">E</text><text x="380" y="55" text-anchor="middle" font-size="20">A</text><text x="95" y="365" font-size="20">B</text><text x="660" y="365" font-size="20">C</text><text x="385" y="205" text-anchor="middle" font-size="20" fill="#2563eb">DE ∥ BC</text>`),

  triangleInequality: fig('triangle-side-angle','BC が最長辺で、その向かいの角 A が最大になる不等辺三角形','実際の辺長の大小と向かいの角の大小を対応させる',
    `<polygon points="380,80 120,340 680,340" fill="none" stroke="#1f2937" stroke-width="4"/>
    <line x1="120" y1="340" x2="680" y2="340" stroke="#2563eb" stroke-width="6"/>
    <path d="M 343.23 116.77 A 52 52 0 0 1 419.55 113.78" fill="none" stroke="#ea580c" stroke-width="4"/>
    <text x="405" y="132" font-size="21" fill="#ea580c">∠A</text>
    <text x="400" y="375" text-anchor="middle" font-size="20" fill="#2563eb">a=BC（最長）</text>
    <text x="380" y="58" text-anchor="middle" font-size="19">A</text><text x="104" y="363" text-anchor="middle" font-size="19">B</text><text x="696" y="363" text-anchor="middle" font-size="19">C</text>
    <text x="380" y="410" text-anchor="middle" font-size="20" fill="#475569">a&gt;b なら、その向かいの角も A&gt;B</text>`),

  tiling: fig('regular-tiling','正多角形が1点のまわりに集まる敷き詰め図','1点のまわりの内角の和が360°になる必要がある',
    `<g transform="translate(380 215)">${Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;const x=Math.cos(a)*95,y=Math.sin(a)*95;return `<polygon points="0,0 ${x},${y} ${Math.cos(a+Math.PI/3)*95},${Math.sin(a+Math.PI/3)*95}" fill="${i%2?'#ffedd5':'#dbeafe'}" stroke="#64748b" stroke-width="2"/>`}).join('')}</g><circle cx="380" cy="215" r="6" fill="#1f2937"/><text x="380" y="390" text-anchor="middle" font-size="21" fill="#475569">中心まわりの角の和 = 360°</text>`),

  hypothesis: fig('hypothesis-test-flow','仮説検定の判断手順を示す流れ図','帰無仮説のもとで極端な結果の起こりやすさを調べる',
    `<g text-anchor="middle" font-size="19" font-weight="700"><rect x="80" y="150" width="160" height="70" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/><text x="160" y="180">帰無仮説を</text><text x="160" y="205">置く</text><rect x="300" y="150" width="160" height="70" rx="14" fill="#f8fafc" stroke="#64748b" stroke-width="3"/><text x="380" y="180">極端な結果の</text><text x="380" y="205">割合を求める</text><rect x="520" y="150" width="160" height="70" rx="14" fill="#fff7ed" stroke="#ea580c" stroke-width="3"/><text x="600" y="180">十分小さいか</text><text x="600" y="205">判断</text></g><path d="M240 185 H300 M460 185 H520" stroke="#94a3b8" stroke-width="3"/><path d="M292 178 l12 7 l-12 7 z M512 178 l12 7 l-12 7 z" fill="#94a3b8"/><text x="380" y="300" text-anchor="middle" font-size="20" fill="#475569">小さい → 偶然だけでは説明しにくい</text>`),

  trigSpecial: fig('trig-special-angles','0°・90°・180°の座標と三角比の符号を示す半円図','半円上の座標で特別角の値と符号を確認する',
    `<line x1="100" y1="270" x2="660" y2="270" stroke="#334155" stroke-width="2.5"/><line x1="380" y1="65" x2="380" y2="330" stroke="#334155" stroke-width="2.5"/><path d="M180 270 A200 200 0 0 1 580 270" fill="none" stroke="#2563eb" stroke-width="4"/><g fill="#ea580c"><circle cx="580" cy="270" r="8"/><circle cx="380" cy="70" r="8"/><circle cx="180" cy="270" r="8"/></g><g font-size="20" fill="#475569"><text x="600" y="295">0°</text><text x="390" y="55">90°</text><text x="145" y="295">180°</text></g>`),

  heron: fig('heron-triangle','3辺だけが分かっている三角形の模式図','3辺が既知ならヘロンの公式で面積を直接求められる',
    `<polygon points="120,330 640,330 390,80" fill="none" stroke="#1f2937" stroke-width="4"/><text x="370" y="365" text-anchor="middle" font-size="22">c</text><text x="235" y="205" font-size="22">b</text><text x="520" y="205" font-size="22">a</text><text x="380" y="410" text-anchor="middle" font-size="20" fill="#475569">角を求めず3辺から面積へ</text>`),

  stoneGame: fig('stone-game','石取りゲームの残り個数を段階で示す図','負け位置を逆算して4の倍数を相手に渡す',
    `<g fill="#2563eb">${Array.from({length:12},(_,i)=>`<circle cx="${115+(i%6)*95}" cy="${130+Math.floor(i/6)*100}" r="20"/>`).join('')}</g><text x="380" y="320" text-anchor="middle" font-size="22" fill="#475569">残り個数を小さい場合から逆算</text><rect x="250" y="345" width="260" height="45" rx="20" fill="#fff7ed" stroke="#ea580c" stroke-width="3"/><text x="380" y="375" text-anchor="middle" font-size="21" fill="#ea580c">4の倍数が目印</text>`)
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
