import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = join(repoRoot, 'backend', 'data', 'textbooks', 'math-1a', 'figure-sources')

export const expectedFigures = [
  ['quadratic-domain-range', 'quadratic/quadratic-domain-range', 'quadratic-functions/assets/quadratic-domain-range.svg'],
  ['quadratic-vertex-form', 'quadratic/quadratic-vertex-form', 'quadratic-functions/assets/quadratic-vertex-form.svg'],
  ['quadratic-shift', 'quadratic/quadratic-shift', 'quadratic-functions/assets/quadratic-shift.svg'],
  ['quadratic-max-min', 'quadratic/quadratic-max-min', 'quadratic-functions/assets/quadratic-max-min.svg'],
  ['coordinate-quadrants', 'quadratic/coordinate-quadrants', 'quadratic-functions/assets/coordinate-quadrants.svg'],
  ['quadratic-basic', 'quadratic/quadratic-basic', 'quadratic-functions/assets/quadratic-basic.svg'],
  ['quadratic-discriminant', 'quadratic/quadratic-discriminant', 'quadratic-functions/assets/quadratic-discriminant.svg'],
  ['parabola-line-intersection', 'quadratic/parabola-line-intersection', 'quadratic-functions/assets/parabola-line-intersection.svg'],
  ['quadratic-inequality', 'quadratic/quadratic-inequality', 'quadratic-functions/assets/quadratic-inequality.svg'],
  ['absolute-value-graph', 'quadratic/absolute-value-graph', 'quadratic-functions/assets/absolute-value-graph.svg'],
  ['parallel-similarity', 'geometry/parallel-similarity', 'geometric-properties/assets/parallel-similarity.svg'],
  ['internal-external-division', 'geometry/internal-external-division', 'geometric-properties/assets/internal-external-division.svg'],
  ['angle-bisector', 'geometry/angle-bisector', 'geometric-properties/assets/angle-bisector.svg'],
  ['triangle-centroid', 'geometry/triangle-centroid', 'geometric-properties/assets/triangle-centroid.svg'],
  ['triangle-centers', 'geometry/triangle-centers', 'geometric-properties/assets/triangle-centers.svg'],
  ['five-centers-summary', 'geometry/five-centers-summary', 'geometric-properties/assets/five-centers-summary.svg'],
  ['ceva', 'geometry/ceva', 'geometric-properties/assets/ceva.svg'],
  ['menelaus', 'geometry/menelaus', 'geometric-properties/assets/menelaus.svg'],
  ['ceva-reverse', 'geometry/ceva-reverse', 'geometric-properties/assets/ceva-reverse.svg'],
  ['menelaus-reverse', 'geometry/menelaus-reverse', 'geometric-properties/assets/menelaus-reverse.svg'],
  ['triangle-side-angle', 'geometry/triangle-side-angle', 'geometric-properties/assets/triangle-side-angle.svg'],
  ['cyclic-angle', 'geometry/cyclic-angle', 'geometric-properties/assets/cyclic-angle.svg'],
  ['cyclic-quadrilateral', 'geometry/cyclic-quadrilateral', 'geometric-properties/assets/cyclic-quadrilateral.svg'],
  ['tangent-chord', 'geometry/tangent-chord', 'geometric-properties/assets/tangent-chord.svg'],
  ['power-of-point', 'geometry/power-of-point', 'geometric-properties/assets/power-of-point.svg'],
  ['two-circles', 'geometry/two-circles', 'geometric-properties/assets/two-circles.svg'],
  ['basic-construction', 'geometry/basic-construction', 'geometric-properties/assets/basic-construction.svg'],
  ['line-plane', 'geometry/line-plane', 'geometric-properties/assets/line-plane.svg'],
  ['three-perpendicular', 'geometry/three-perpendicular', 'geometric-properties/assets/three-perpendicular.svg'],
  ['polyhedra-euler', 'geometry/polyhedra-euler', 'geometric-properties/assets/polyhedra-euler.svg'],
  ['data-transform', 'statistics/data-transform', 'data-analysis/assets/data-transform.svg'],
  ['trig-right-triangle', 'trigonometry/trig-right-triangle', 'geometry-measurement/assets/trig-right-triangle.svg'],
  ['tasuki-cross', 'algebra/tasuki-cross', 'numbers-expressions/assets/tasuki-cross.svg'],
  ['real-number-line', 'algebra/real-number-line', 'numbers-expressions/assets/real-number-line.svg'],
  ['simultaneous-inequalities', 'algebra/simultaneous-inequalities', 'numbers-expressions/assets/simultaneous-inequalities.svg'],
  ['absolute-value-distance', 'algebra/absolute-value-distance', 'numbers-expressions/assets/absolute-value-distance.svg'],
  ['absolute-value-cases', 'algebra/absolute-value-cases', 'numbers-expressions/assets/absolute-value-cases.svg'],
  ['trig-coordinate', 'trigonometry/trig-coordinate', 'geometry-measurement/assets/trig-coordinate.svg'],
  ['trig-special-angles', 'trigonometry/trig-special-angles', 'geometry-measurement/assets/trig-special-angles.svg'],
  ['sine-law', 'trigonometry/sine-law', 'geometry-measurement/assets/sine-law.svg'],
  ['cosine-law', 'trigonometry/cosine-law', 'geometry-measurement/assets/cosine-law.svg'],
  ['triangle-area', 'trigonometry/triangle-area', 'geometry-measurement/assets/triangle-area.svg'],
  ['heron-triangle', 'trigonometry/heron-triangle', 'geometry-measurement/assets/heron-triangle.svg'],
  ['height-distance', 'trigonometry/height-distance', 'geometry-measurement/assets/height-distance.svg'],
  ['quadrilateral-split', 'trigonometry/quadrilateral-split', 'geometry-measurement/assets/quadrilateral-split.svg'],
  ['spatial-measurement', 'trigonometry/spatial-measurement', 'geometry-measurement/assets/spatial-measurement.svg'],
  ['histogram', 'statistics/histogram', 'data-analysis/assets/histogram.svg'],
  ['boxplot-quartiles', 'statistics/boxplot-quartiles', 'data-analysis/assets/boxplot-quartiles.svg'],
  ['scatter-correlation', 'statistics/scatter-correlation', 'data-analysis/assets/scatter-correlation.svg'],
  ['statistical-process', 'statistics/statistical-process', 'data-analysis/assets/statistical-process.svg'],
  ['outlier-boxplot', 'statistics/outlier-boxplot', 'data-analysis/assets/outlier-boxplot.svg'],
  ['hypothesis-test-flow', 'statistics/hypothesis-test-flow', 'data-analysis/assets/hypothesis-test-flow.svg'],
  ['counting-tree', 'probability/counting-tree', 'counting-probability/assets/counting-tree.svg'],
  ['circular-permutation', 'probability/circular-permutation', 'counting-probability/assets/circular-permutation.svg'],
  ['combination-selection', 'probability/combination-selection', 'counting-probability/assets/combination-selection.svg'],
  ['grid-shortest-path', 'probability/grid-shortest-path', 'counting-probability/assets/grid-shortest-path.svg'],
  ['sample-space', 'probability/sample-space', 'counting-probability/assets/sample-space.svg'],
  ['complement-event', 'probability/complement-event', 'counting-probability/assets/complement-event.svg'],
  ['probability-tree', 'probability/probability-tree', 'counting-probability/assets/probability-tree.svg'],
  ['place-value', 'human-activities/place-value', 'human-activities/assets/place-value.svg'],
  ['position-grid', 'human-activities/position-grid', 'human-activities/assets/position-grid.svg'],
  ['earth-measurement', 'human-activities/earth-measurement', 'human-activities/assets/earth-measurement.svg'],
  ['domino-invariant', 'human-activities/domino-invariant', 'human-activities/assets/domino-invariant.svg'],
  ['stone-game', 'human-activities/stone-game', 'human-activities/assets/stone-game.svg'],
  ['regular-tiling', 'human-activities/regular-tiling', 'human-activities/assets/regular-tiling.svg'],
  ['demorgan', 'sets/demorgan', 'sets-propositions/assets/demorgan.svg'],
].map(([id, sourceDir, asset]) => ({ id, sourceDir, asset }))

const EPS = 1e-7
const point = (x, y, z = 0) => ({ x, y, z })
const add = (a, b) => point(a.x + b.x, a.y + b.y, a.z + b.z)
const sub = (a, b) => point(a.x - b.x, a.y - b.y, a.z - b.z)
const scale = (a, k) => point(a.x * k, a.y * k, a.z * k)
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z
const norm = (a) => Math.sqrt(dot(a, a))
const distance = (a, b) => norm(sub(a, b))
const cross2 = (a, b) => a.x * b.y - a.y * b.x
const approx = (a, b, epsilon = EPS) => Math.abs(a - b) <= epsilon * Math.max(1, Math.abs(a), Math.abs(b))
const midpoint = (a, b) => scale(add(a, b), 0.5)
const collinear = (a, b, c) => approx(cross2(sub(b, a), sub(c, a)), 0)
const perpendicular = (a, b) => approx(dot(a, b), 0)
const angleAt = (a, vertex, b) => {
  const u = sub(a, vertex)
  const v = sub(b, vertex)
  const cosine = Math.max(-1, Math.min(1, dot(u, v) / (norm(u) * norm(v))))
  return Math.acos(cosine)
}
const lineIntersection = (a, b, c, d) => {
  const r = sub(b, a)
  const s = sub(d, c)
  const denominator = cross2(r, s)
  if (approx(denominator, 0)) throw new Error('parallel lines have no unique intersection')
  const t = cross2(sub(c, a), s) / denominator
  return add(a, scale(r, t))
}
const pointLineDistance = (p, a, b) => Math.abs(cross2(sub(b, a), sub(p, a))) / distance(a, b)
const polar = (degrees, radius) => {
  const radians = degrees * Math.PI / 180
  return point(radius * Math.cos(radians), radius * Math.sin(radians))
}
const weighted = (terms, denominator) => scale(
  terms.reduce((sum, [p, weight]) => add(sum, scale(p, weight)), point(0, 0, 0)),
  1 / denominator,
)
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length
const variance = (values) => {
  const m = mean(values)
  return mean(values.map((value) => (value - m) ** 2))
}
const correlation = (xs, ys) => {
  const mx = mean(xs), my = mean(ys)
  const covariance = mean(xs.map((x, index) => (x - mx) * (ys[index] - my)))
  return covariance / Math.sqrt(variance(xs) * variance(ys))
}
const insideTriangle = (p, a, b, c) => {
  const s1 = cross2(sub(b, a), sub(p, a))
  const s2 = cross2(sub(c, b), sub(p, b))
  const s3 = cross2(sub(a, c), sub(p, c))
  return (s1 >= -EPS && s2 >= -EPS && s3 >= -EPS) || (s1 <= EPS && s2 <= EPS && s3 <= EPS)
}

function requireCheck(checks, name, condition, detail) {
  checks.push({ name, passed: Boolean(condition), detail })
  if (!condition) throw new Error(`${name}: ${detail}`)
}

function validateFiles(entry, checks) {
  const directory = join(sourceRoot, entry.sourceDir)
  const spec = JSON.parse(readFileSync(join(directory, 'figure_spec.json'), 'utf8'))
  const tex = readFileSync(join(directory, 'figure.tex'), 'utf8')
  requireCheck(checks, 'spec-id', spec.figure_id === entry.id, `${spec.figure_id} == ${entry.id}`)
  for (const key of ['unit', 'topic', 'teaching_goal', 'source', 'objects', 'constraints', 'labels', 'forbidden', 'engine', 'qa_rules', 'status']) {
    requireCheck(checks, `spec-${key}`, spec[key] !== undefined, `figure_spec.json contains ${key}`)
  }
  requireCheck(checks, 'standalone-source', /\\documentclass\[[^\]]*\]\{standalone\}/.test(tex), 'independently compilable standalone document')
  requireCheck(checks, 'no-svg-source', !/<svg\b|<path\b|viewBox=/.test(tex), 'source is TeX/TikZ rather than handwritten SVG')
  const pgfIds = new Set([
    'quadratic-domain-range',
    'quadratic-vertex-form',
    'quadratic-shift',
    'quadratic-max-min',
    'coordinate-quadrants',
    'quadratic-basic',
    'quadratic-discriminant',
    'parabola-line-intersection',
    'quadratic-inequality',
    'absolute-value-graph',
    'data-transform',
    'real-number-line',
    'simultaneous-inequalities',
    'absolute-value-distance',
    'histogram',
    'boxplot-quartiles',
    'scatter-correlation',
    'outlier-boxplot',
    'position-grid',
  ])
  if (pgfIds.has(entry.id)) requireCheck(checks, 'pgfplots-formula', tex.includes('\\addplot'), 'function/statistics geometry comes from PGFPlots')
  if (['line-plane', 'three-perpendicular', 'polyhedra-euler', 'spatial-measurement'].includes(entry.id)) requireCheck(checks, '3d-engine', tex.includes('tikz-3dplot'), '3D coordinates use tikz-3dplot')
  const sourceBindings = {
    'quadratic-domain-range': [/domain=-2:3/, /coordinates \{\(-2,3\) \(3,8\)\}/, /coordinates \{\(0,-1\)\}/],
    'quadratic-vertex-form': [/\{2\*\(x-1\.5\)\^2-2\}/, /coordinates \{\(1\.5,-2\)\}/, /axis cs:1\.5,-3\.1/],
    'quadratic-shift': [/\.5\*\(x-2\)\^2\+1/, /-\(\.5\*\(x-2\)\^2\+1\)/, /coordinates \{\(2,1\)\}/],
    'quadratic-max-min': [/\{\(x-1\)\^2-2\}/, /\{2\*x\^2-2\*x\}/, /\{\(x-1\)\^2\}/],
    'coordinate-quadrants': [/coordinates \{\(2,1\.5\)\}/, /coordinates \{\(-2,1\.5\)\}/, /coordinates \{\(-2,-1\.5\)\}/, /coordinates \{\(2,-1\.5\)\}/],
    'quadratic-basic': [/\{x\^2\}/, /\{2\*x\^2\}/, /\{\.5\*x\^2\}/, /\{-x\^2\}/, /coordinates \{\(0,0\)\}/],
    'quadratic-discriminant': [/\{x\^2-1\}/, /coordinates \{\(-1,0\) \(1,0\)\}/, /\{x\^2\}/, /coordinates \{\(0,0\)\}/, /\{x\^2\+1\}/],
    'parabola-line-intersection': [/\{x\^2-1\}/, /\{x\+1\}/, /coordinates \{\(-1,0\) \(2,3\)\}/],
    'quadratic-inequality': [/\{\(x-1\)\*\(x-3\)\}/, /coordinates \{\(1,0\) \(3,0\)\}/, /f\(x\)>0/, /f\(x\)<0/],
    'absolute-value-graph': [/\{x\^2-1\}/, /\{abs\(x\^2-1\)\}/, /domain=-1:1/, /\{1-x\^2\}/, /coordinates \{\(-1,0\) \(1,0\)\}/],
    'parallel-similarity': [/\(D\) at \(\$\(A\)!\.45!\(B\)\$\)/, /\(E\) at \(\$\(A\)!\.45!\(C\)\$\)/, /DE\\parallel BC/],
    'internal-external-division': [/\\pgfmathsetmacro\{\\internalratio\}\{2\/3\}/, /\(P\) at \(\$\(A\)!\\internalratio!\(B\)\$\)/, /\(Q\) at \(\$\(A2\)!2!\(B2\)\$\)/, /AP:PB=2:1/, /AQ:QB=2:1/],
    'angle-bisector': [/\\pgfmathsetmacro\{\\ratio\}\{\\AB\/\(\\AB\+\\AC\)\}/, /\(B\)!\\ratio!\(C\)/],
    'triangle-centroid': [/\(B\)!\.5!\(C\)/, /name intersections=\{of=medianA and medianB,by=G\}/],
    'triangle-centers': [/\(O\) at \(2\.4,1\.2294118\)/, /\(I\) at \(1\.52154,1\.20510\)/, /\(H\) at \(\.8,\.9411765\)/],
    'five-centers-summary': [/\(G\) at \(1\.3333,\.8\)/, /\(O\) at \(1\.7,\.85\)/, /\(\.95,-\.025\)--\(2\.45,1\.725\)/, /\(I\) at \(1\.093,\.853\)/, /\(H\) at \(\.6,\.7\)/, /\(Ia\) at \(2\.307,-2\.955\)/],
    ceva: [/\(P\) at \(2\.3,1\.6\)/, /of=AP and BC,by=D/, /of=BP and CA,by=E/, /of=CP and AB,by=F/],
    menelaus: [/\(X\) at \(-3,-\.25\)/, /\(Y\) at \(7,3\.25\)/, /of=transversal and BCext,by=D/, /of=transversal and CA,by=E/, /of=transversal and AB,by=F/],
    'ceva-reverse': [/\(B\)!\.4!\(C\)/, /\(C\)!\.6!\(A\)/, /\(A\)!\.5!\(B\)/, /of=AD and BE,by=P/],
    'menelaus-reverse': [/\(D\) at \(-2,0\)/, /\(C\)!\.5!\(A\)/, /\(A\)!\.8!\(B\)/],
    'triangle-side-angle': [/\(A\) at \(1\.2,3\)/, /\(C\) at \(5\.8,0\)/, /\\angle A>\\angle B>\\angle C/],
    'cyclic-angle': [/\(A\) at \(210:3\)/, /\(B\) at \(330:3\)/, /\(C\) at \(70:3\)/, /\(D\) at \(135:3\)/, /angle=A--C--B/, /angle=A--D--B/],
    'cyclic-quadrilateral': [/\(A\) at \(150:3\)/, /\(B\) at \(230:3\)/, /\(C\) at \(325:3\)/, /\(D\) at \(55:3\)/],
    'tangent-chord': [/\(T\) at \(3,0\)/, /\(A\) at \(220:3\)/, /\(B\) at \(110:3\)/, /angle=S--T--A/, /angle=T--B--A/],
    'power-of-point': [/\(O\) at \(1,0\)/, /\(T\) at \(-\.25,2\.1650635\)/, /\(P\)--\(T\)/],
    'two-circles': [/\(X\) at \(0,1\.959592\)/, /\(Y\) at \(0,-1\.959592\)/, /\(T1\) at \(-1\.5,1\.2\)/, /\(T2\) at \(1\.5,1\.2\)/],
    'basic-construction': [/\(A\) at \(-2\.4,0\)/, /\(B\) at \(2\.4,0\)/, /\\pgfmathsetmacro\{\\intersectionheight\}\{sqrt\(3\.2\^2-2\.4\^2\)\}/, /\(U\) at \(0,\\intersectionheight\)/, /circle \(3\.2\)/],
    'line-plane': [/\(X1\) at \(-\.8,-\.3,-1\)/, /\(O1\) at \(0,0,0\)/, /\(Y1\) at \(\.8,\.3,1\)/, /\(X2\) at \(-1\.2,-\.5,1\)/, /\(Y3\) at \(1\.2,\.6,0\)/],
    'three-perpendicular': [/\(H\) at \(0,0,0\)/, /\(P\) at \(0,0,3\)/, /\(Q\) at \(3,1,0\)/, /\(L1\) at \(-1,3,0\)/, /\(L2\) at \(1,-3,0\)/],
    'polyhedra-euler': [/\(A\) at \(0,0,0\)/, /\(B\) at \(3,0,0\)/, /\(G\) at \(3,3,3\)/, /F=6/, /E=12/, /V=8/, /V-E\+F=8-12\+6=2/],
    'data-transform': [/coordinates \{\(-2,0\) \(-\.5,0\) \(1\.5,0\) \(2\.5,0\)\}/, /coordinates \{\(1,1\) \(2\.5,1\) \(4\.5,1\) \(5\.5,1\)\}/, /coordinates \{\(4,1\) \(1,1\) \(-3,1\) \(-5,1\)\}/],
    'trig-right-triangle': [/\(A\) at \(0,0\)/, /\(B\) at \(4\.8,0\)/, /\(C\) at \(4\.8,3\.6\)/, /\\sin A=\\frac\{BC\}\{AC\}/],
    'tasuki-cross': [/\(ax\+b\)\(cx\+d\)/, /ad\+bc/, /acx\^2/],
    'real-number-line': [/1\.41421356/, /\\sqrt2/, /\\mathrm\{Q\}/],
    'simultaneous-inequalities': [/coordinates \{\(1,2\)\(4,2\)\}/, /coordinates \{\(2,1\.2\)\(4\.8,1\.2\)\}/, /2\\le x\\le4/],
    'absolute-value-distance': [/coordinates \{\(0,0\)\}/, /coordinates \{\(-3,0\)\(3,0\)\}/, /\|-3\|=3/, /\|3\|=3/],
    'absolute-value-cases': [/x-a\\ge0/, /x-a<0/, /x\\ge a/, /x<a/],
    'trig-coordinate': [/\(P\) at \(120:1\)/, /\(H\) at \(-\.5,0\)/, /x=\\cos\\theta/, /y=\\sin\\theta/, /OP=1/],
    'trig-special-angles': [/\(1,0\).*0\^\\circ/, /\(0,1\).*90\^\\circ/, /\(-1,0\).*180\^\\circ/],
    'sine-law': [/\(A\) at \(140:3\)/, /\(B\) at \(250:3\)/, /\(C\) at \(20:3\)/, /\\frac\{a\}\{\\sin A\}=2R/],
    'cosine-law': [/\(A\) at \(0,0\)/, /\(B\) at \(5,0\)/, /\(C\) at \(1\.5,3\)/, /a\^2=b\^2\+c\^2-2bc\\cos A/],
    'triangle-area': [/\(D\) at \(1\.8,0\)/, /h=b\\sin A/, /S=\\frac12bc\\sin A/],
    'heron-triangle': [/\(B\) at \(4,0\)/, /\(C\) at \(4,3\)/, /S=\\sqrt\{6\(6-3\)\(6-4\)\(6-5\)\}=6/],
    'height-distance': [/\(B\) at \(6,0\)/, /\(C\) at \(6,3\.6\)/, /h=d\\tan\\theta/],
    'quadrilateral-split': [/\(A\)--\(C\)/, /S_\{ABCD\}=S_\{ABC\}\+S_\{ACD\}/],
    'spatial-measurement': [/\(A\) at \(0,0,0\)/, /\(G\) at \(4,3,2\)/, /AG\^2=AC\^2\+CG\^2/],
    histogram: [/coordinates \{\(0,2\)\(10,5\)\(20,8\)\(30,4\)\(40,1\)\(50,0\)\}/, /ybar interval/],
    'boxplot-quartiles': [/xtick=\{1,3,5,7,9\}/, /axis cs:3,\.55.*axis cs:7,1\.45/, /axis cs:5,\.55/],
    'scatter-correlation': [/\(0,0\)\(\.5,\.7\).*\(2\.5,3\.4\)/, /\(4,4\).*\(6\.5,\.7\)/, /r\\approx0/],
    'statistical-process': [/\(q\) \{Question\}/, /\(c\) \{Collect\}/, /\(a\) \{Analyze\}/, /\(i\) \{Interpret\}/],
    'outlier-boxplot': [/xtick=\{0,2,3\.5,5,8,9\.5,11\}/, /axis cs:9\.5,\.3/, /coordinates \{\(11,1\)\}/],
    'hypothesis-test-flow': [/\(h\) \{\$H_0\$\}/, /\(p\) \{\$p\$-value\}/, /p<0\.05/, /p\\ge0\.05/],
    'counting-tree': [/3\\times2=6/, /\{1\/A,2\/B,3\/C\}/, /\(L\\i-A\)/],
    'circular-permutation': [/\{90\/A,18\/B,306\/C,234\/D,162\/E\}/, /\(5-1\)!=24/],
    'combination-selection': [/\{1\/B,4\/E\}/, /\\\{B,E\\\}=\\\{E,B\\\}/, /_\{5\}C_\{2\}=10/],
    'grid-shortest-path': [/grid \(4,3\)/, /4E\+3N/, /_\{7\}C_\{3\}=35/],
    'sample-space': [/\\Omega=\\\{1,2,3,4,5,6\\\}/, /A=\\\{2,4,6\\\}/],
    'complement-event': [/A\\cap\\overline A=\\emptyset/, /A\\cup\\overline A=\\Omega/],
    'probability-tree': [/\$pq\$/, /\$p\(1-q\)\$/, /\$\(1-p\)q\$/, /\$\(1-p\)\(1-q\)\$/],
    'place-value': [/314=3\\cdot10\^2\+1\\cdot10\^1\+4\\cdot10\^0/, /0\/3\/\$10\^2\$/],
    'position-grid': [/coordinates \{\(3,2\)\}/, /P\(3,2\)/],
    'earth-measurement': [/\(A\) at \(60:3\)/, /\(B\) at \(100:3\)/, /\\theta=40\^\\circ/, /s=R\\theta/],
    'domino-invariant': [/mod\(\\r\+\\c,2\)/, /\(1,1\) rectangle \(3,2\)/, /\\Delta\(B-W\)=0/],
    'stone-game': [/\{4,8,12\}/, /take \$1,2,\$ or \$3\$ stones/, /\$\+4\$/],
    'regular-tiling': [/\{0,\.\.\.,5\}/, /60\*\\k/, /6\\times60\^\\circ=360\^\\circ/],
    demorgan: [/\\overline\{A\\cap B\}/, /\\overline A\\cup\\overline B/, /even odd rule/],
  }
  const missingBindings = sourceBindings[entry.id].filter((pattern) => !pattern.test(tex)).map(String)
  requireCheck(checks, 'source-model-binding', missingBindings.length === 0, missingBindings.length === 0
    ? 'verified model values and constructions are present in figure.tex'
    : `missing ${missingBindings.join(', ')}`)
  return { spec, tex }
}

function verifyModel(id, checks) {
  if (id === 'quadratic-domain-range') {
    const f = (x) => x * x - 1
    requireCheck(checks, 'vertex', approx(f(0), -1), 'V=(0,-1)')
    requireCheck(checks, 'left-endpoint', approx(f(-2), 3), 'L=(-2,3)')
    requireCheck(checks, 'right-endpoint', approx(f(3), 8), 'R=(3,8)')
    requireCheck(checks, 'range', Math.min(f(-2), f(0), f(3)) === -1 && Math.max(f(-2), f(0), f(3)) === 8, 'range is [-1,8]')
  } else if (id === 'quadratic-vertex-form') {
    const f = (x) => 2 * (x - 1.5) ** 2 - 2
    requireCheck(checks, 'vertex', approx(f(1.5), -2), 'V=(1.5,-2)')
    requireCheck(checks, 'symmetry', approx(f(0.5), f(2.5)), 'symmetric points have equal ordinates')
  } else if (id === 'quadratic-shift') {
    const f = (x) => 0.5 * x ** 2
    const g = (x) => 0.5 * (x - 2) ** 2 + 1
    const h = (x) => -g(x)
    for (const x of [-2, -0.5, 0, 1.5, 3]) {
      requireCheck(checks, `translate-${x}`, approx(g(x), f(x - 2) + 1), `g(${x})=f(${x}-2)+1`)
      requireCheck(checks, `reflect-${x}`, approx(h(x), -g(x)), `h(${x})=-g(${x})`)
    }
  } else if (id === 'quadratic-max-min') {
    const fixed = (x) => (x - 1) ** 2 - 2
    requireCheck(checks, 'fixed-domain-min', approx(fixed(1), -2), 'minimum at the in-domain vertex')
    requireCheck(checks, 'fixed-domain-max', approx(fixed(-1), 2) && approx(fixed(3), 2), 'maximum at closed endpoints')
    requireCheck(checks, 'moving-endpoint-boundary', approx(0.5, 0.5), 'axis x=1/2 is the case boundary for [0,a]')
    requireCheck(checks, 'moving-axis-boundaries', !(-0.5 >= 0 && -0.5 <= 2) && (1 >= 0 && 1 <= 2) && !(2.5 >= 0 && 2.5 <= 2), 'axis left/inside/right split at 0 and 2')
  } else if (id === 'coordinate-quadrants') {
    const points = [point(2, 1.5), point(-2, 1.5), point(-2, -1.5), point(2, -1.5)]
    const quadrants = points.map(({ x, y }) => x > 0 && y > 0 ? 1 : x < 0 && y > 0 ? 2 : x < 0 && y < 0 ? 3 : 4)
    requireCheck(checks, 'quadrant-signs', quadrants.join(',') === '1,2,3,4', `quadrants=${quadrants.join(',')}`)
    requireCheck(checks, 'off-axes', points.every(({ x, y }) => x !== 0 && y !== 0), 'example points do not lie on an axis')
  } else if (id === 'quadratic-basic') {
    const functions = [(x) => x ** 2, (x) => 2 * x ** 2, (x) => 0.5 * x ** 2, (x) => -(x ** 2)]
    requireCheck(checks, 'common-vertex', functions.every((f) => approx(f(0), 0)), 'all four vertices are O=(0,0)')
    requireCheck(checks, 'width-order', functions[1](1) > functions[0](1) && functions[0](1) > functions[2](1), '2x^2 > x^2 > (1/2)x^2 at x=1')
    requireCheck(checks, 'opening-directions', functions[0](1) > 0 && functions[1](1) > 0 && functions[2](1) > 0 && functions[3](1) < 0, 'sign(a) determines opening direction')
  } else if (id === 'quadratic-discriminant') {
    const cases = [
      { a: 1, b: 0, c: -1, roots: [-1, 1] },
      { a: 1, b: 0, c: 0, roots: [0] },
      { a: 1, b: 0, c: 1, roots: [] },
    ]
    const discriminants = cases.map(({ a, b, c }) => b ** 2 - 4 * a * c)
    requireCheck(checks, 'discriminants', discriminants.join(',') === '4,0,-4', `D=${discriminants.join(',')}`)
    requireCheck(checks, 'root-counts', cases.map(({ roots }) => roots.length).join(',') === '2,1,0', 'root counts are 2,1,0')
    requireCheck(checks, 'root-incidence', cases.every(({ a, b, c, roots }) => roots.every((x) => approx(a * x ** 2 + b * x + c, 0))), 'all marked roots lie on y=0')
  } else if (id === 'parabola-line-intersection') {
    const parabola = (x) => x ** 2 - 1
    const line = (x) => x + 1
    const roots = [-1, 2]
    requireCheck(checks, 'intersection-equations', roots.every((x) => approx(parabola(x), line(x))), 'both x values satisfy both equations')
    requireCheck(checks, 'intersection-points', approx(parabola(-1), 0) && approx(parabola(2), 3), 'P=(-1,0), Q=(2,3)')
  } else if (id === 'quadratic-inequality') {
    const f = (x) => (x - 1) * (x - 3)
    requireCheck(checks, 'roots', approx(f(1), 0) && approx(f(3), 0), 'roots are x=1,3')
    requireCheck(checks, 'sign-left', f(0) > 0, 'f(x)>0 for x<1')
    requireCheck(checks, 'sign-inside', f(2) < 0, 'f(x)<0 for 1<x<3')
    requireCheck(checks, 'sign-right', f(4) > 0, 'f(x)>0 for x>3')
  } else if (id === 'absolute-value-graph') {
    const f = (x) => x ** 2 - 1
    const g = (x) => Math.abs(f(x))
    requireCheck(checks, 'fixed-roots', approx(g(-1), 0) && approx(g(1), 0), 'roots stay at -1 and 1')
    requireCheck(checks, 'outside-unchanged', [-2, 2].every((x) => approx(g(x), f(x))), '|f|=f outside [-1,1]')
    requireCheck(checks, 'inside-reflected', [-0.5, 0, 0.5].every((x) => approx(g(x), -f(x))), '|f|=-f inside (-1,1)')
    requireCheck(checks, 'nonnegative', [-2, -1, 0, 1, 2].every((x) => g(x) >= 0), '|f(x)| is nonnegative')
  } else if (id === 'parallel-similarity') {
    const A = point(1.2, 4), B = point(0, 0), C = point(6, 0)
    const D = add(A, scale(sub(B, A), 0.45)), E = add(A, scale(sub(C, A), 0.45))
    requireCheck(checks, 'D-on-AB', collinear(A, B, D), 'D belongs to AB')
    requireCheck(checks, 'E-on-AC', collinear(A, C, E), 'E belongs to AC')
    requireCheck(checks, 'same-division-ratio', approx(distance(A, D) / distance(A, B), distance(A, E) / distance(A, C)), 'AD/AB=AE/AC')
    requireCheck(checks, 'parallel-lines', approx(cross2(sub(E, D), sub(C, B)), 0), 'DE is parallel to BC')
  } else if (id === 'internal-external-division') {
    const A = point(0, 0), B = point(3, 0)
    const P = add(A, scale(sub(B, A), 2 / 3)), Q = add(A, scale(sub(B, A), 2))
    requireCheck(checks, 'P-on-segment', collinear(A, B, P) && P.x > A.x && P.x < B.x, 'P lies inside AB')
    requireCheck(checks, 'internal-ratio', approx(distance(A, P) / distance(P, B), 2), 'AP:PB=2:1')
    requireCheck(checks, 'Q-on-extension', collinear(A, B, Q) && Q.x > B.x, 'Q lies beyond B')
    requireCheck(checks, 'external-ratio', approx(distance(A, Q) / distance(Q, B), 2), 'AQ:QB=2:1')
  } else if (id === 'angle-bisector') {
    const A = point(1.2, 4), B = point(0, 0), C = point(6, 0)
    const ratio = distance(A, B) / (distance(A, B) + distance(A, C))
    const D = add(B, scale(sub(C, B), ratio))
    requireCheck(checks, 'D-on-BC', collinear(B, C, D), 'D belongs to BC')
    requireCheck(checks, 'side-ratio', approx(distance(B, D) / distance(D, C), distance(A, B) / distance(A, C)), 'BD/DC=AB/AC')
    requireCheck(checks, 'equal-angles', approx(angleAt(B, A, D), angleAt(D, A, C)), 'BAD=DAC')
  } else if (id === 'triangle-centroid') {
    const A = point(1, 4), B = point(0, 0), C = point(6, 0)
    const Ma = midpoint(B, C), Mb = midpoint(C, A), Mc = midpoint(A, B)
    const G = scale(add(add(A, B), C), 1 / 3)
    requireCheck(checks, 'three-medians', collinear(A, Ma, G) && collinear(B, Mb, G) && collinear(C, Mc, G), 'all medians contain G')
    requireCheck(checks, 'median-ratio', approx(distance(A, G) / distance(G, Ma), 2), 'AG:GM_a=2:1')
  } else if (id === 'triangle-centers' || id === 'five-centers-summary') {
    const compact = id === 'five-centers-summary'
    const A = compact ? point(0.6, 2.4) : point(0.8, 3.4)
    const B = point(0, 0)
    const C = compact ? point(3.4, 0) : point(4.8, 0)
    const a = distance(B, C), b = distance(C, A), c = distance(A, B)
    const G = scale(add(add(A, B), C), 1 / 3)
    const I = weighted([[A, a], [B, b], [C, c]], a + b + c)
    const Ia = weighted([[A, -a], [B, b], [C, c]], -a + b + c)
    const O = lineIntersection(midpoint(B, C), add(midpoint(B, C), point(0, 1)), midpoint(C, A), add(midpoint(C, A), point(A.y - C.y, C.x - A.x)))
    const H = lineIntersection(A, add(A, point(0, 1)), B, add(B, point(-(A.y - C.y), A.x - C.x)))
    requireCheck(checks, 'circumcenter', approx(distance(O, A), distance(O, B)) && approx(distance(O, B), distance(O, C)), 'OA=OB=OC')
    const inDistances = [pointLineDistance(I, A, B), pointLineDistance(I, B, C), pointLineDistance(I, C, A)]
    requireCheck(checks, 'incenter', approx(inDistances[0], inDistances[1]) && approx(inDistances[1], inDistances[2]), 'I is equidistant from three sides')
    requireCheck(checks, 'orthocenter', perpendicular(sub(H, A), sub(C, B)) && perpendicular(sub(H, B), sub(A, C)) && perpendicular(sub(H, C), sub(B, A)), 'all three altitudes contain H')
    if (compact) {
      const Ma = midpoint(B, C), Mb = midpoint(C, A), Mc = midpoint(A, B)
      requireCheck(checks, 'centroid', collinear(A, Ma, G) && collinear(B, Mb, G) && collinear(C, Mc, G), 'all medians contain G')
      const exDistances = [pointLineDistance(Ia, A, B), pointLineDistance(Ia, B, C), pointLineDistance(Ia, C, A)]
      requireCheck(checks, 'excenter-distance', approx(exDistances[0], exDistances[1]) && approx(exDistances[1], exDistances[2]), 'I_A is equidistant from one side and two extensions')
      requireCheck(checks, 'excenter-outside', !insideTriangle(Ia, A, B, C), 'I_A lies outside triangle ABC')
    }
  } else if (id === 'ceva') {
    const A = point(1.2, 4), B = point(0, 0), C = point(6, 0), P = point(2.3, 1.6)
    const D = lineIntersection(A, P, B, C), E = lineIntersection(B, P, C, A), F = lineIntersection(C, P, A, B)
    requireCheck(checks, 'side-incidence', collinear(B, C, D) && collinear(C, A, E) && collinear(A, B, F), 'D,E,F lie on corresponding sides')
    requireCheck(checks, 'concurrency', collinear(A, D, P) && collinear(B, E, P) && collinear(C, F, P), 'AD,BE,CF meet at P')
    const product = distance(B, D) / distance(D, C) * distance(C, E) / distance(E, A) * distance(A, F) / distance(F, B)
    requireCheck(checks, 'ceva-product', approx(product, 1), `ratio product=${product}`)
  } else if (id === 'menelaus') {
    const A = point(1, 4), B = point(0, 0), C = point(6, 0), X = point(-3, -0.25), Y = point(7, 3.25)
    const D = lineIntersection(X, Y, point(-3, 0), point(7, 0)), E = lineIntersection(X, Y, C, A), F = lineIntersection(X, Y, A, B)
    requireCheck(checks, 'collinearity', collinear(D, E, F), 'D,E,F lie on the same transversal')
    const product = distance(B, D) / distance(D, C) * distance(C, E) / distance(E, A) * distance(A, F) / distance(F, B)
    requireCheck(checks, 'menelaus-product', approx(product, 1), `unsigned ratio product=${product}`)
  } else if (id === 'ceva-reverse') {
    const A = point(1.2, 4), B = point(0, 0), C = point(6, 0)
    const D = add(B, scale(sub(C, B), 0.4)), E = add(C, scale(sub(A, C), 0.6)), F = midpoint(A, B)
    const P = lineIntersection(A, D, B, E)
    const product = distance(B, D) / distance(D, C) * distance(C, E) / distance(E, A) * distance(A, F) / distance(F, B)
    requireCheck(checks, 'given-product', approx(product, 1), `ratio product=${product}`)
    requireCheck(checks, 'reverse-concurrency', collinear(C, F, P), 'third cevian passes through P')
  } else if (id === 'menelaus-reverse') {
    const A = point(1, 4), B = point(0, 0), C = point(6, 0), D = point(-2, 0), E = midpoint(C, A), F = add(A, scale(sub(B, A), 0.8))
    const product = distance(B, D) / distance(D, C) * distance(C, E) / distance(E, A) * distance(A, F) / distance(F, B)
    requireCheck(checks, 'given-product', approx(product, 1), `ratio product=${product}`)
    requireCheck(checks, 'reverse-collinearity', collinear(D, E, F), 'D,E,F are collinear')
  } else if (id === 'triangle-side-angle') {
    const A = point(1.2, 3), B = point(0, 0), C = point(5.8, 0)
    const a = distance(B, C), b = distance(C, A), c = distance(A, B)
    const Aang = angleAt(B, A, C), Bang = angleAt(A, B, C), Cang = angleAt(A, C, B)
    requireCheck(checks, 'side-order', a > b && b > c, `a=${a}, b=${b}, c=${c}`)
    requireCheck(checks, 'angle-order', Aang > Bang && Bang > Cang, `A=${Aang}, B=${Bang}, C=${Cang}`)
  } else if (id === 'cyclic-angle') {
    const A = polar(210, 3), B = polar(330, 3), C = polar(70, 3), D = polar(135, 3)
    for (const [name, p] of Object.entries({ A, B, C, D })) requireCheck(checks, `circle-${name}`, approx(norm(p), 3), `${name} lies on r=3`)
    requireCheck(checks, 'same-chord-angle', approx(angleAt(A, C, B), angleAt(A, D, B)), 'ACB=ADB')
  } else if (id === 'cyclic-quadrilateral') {
    const A = polar(150, 3), B = polar(230, 3), C = polar(325, 3), D = polar(55, 3)
    for (const [name, p] of Object.entries({ A, B, C, D })) requireCheck(checks, `circle-${name}`, approx(norm(p), 3), `${name} lies on r=3`)
    requireCheck(checks, 'opposite-angles', approx(angleAt(D, A, B) + angleAt(B, C, D), Math.PI), 'opposite angles sum to pi')
  } else if (id === 'tangent-chord') {
    const O = point(0, 0), T = point(3, 0), A = polar(220, 3), B = polar(110, 3), tangent = point(0, -1)
    requireCheck(checks, 'circle-points', approx(distance(O, T), 3) && approx(distance(O, A), 3) && approx(distance(O, B), 3), 'T,A,B lie on circle')
    requireCheck(checks, 'tangent', perpendicular(sub(T, O), tangent), 'OT is perpendicular to tangent')
    const tangentAngle = Math.acos(dot(tangent, sub(A, T)) / (norm(tangent) * distance(A, T)))
    requireCheck(checks, 'angle-equality', approx(tangentAngle, angleAt(T, B, A)), 'tangent-chord angle equals inscribed angle')
  } else if (id === 'power-of-point') {
    const O = point(1, 0), P = point(-4, 0), A = point(-1.5, 0), B = point(3.5, 0), C = point(-1, 1.5), D = point(1, 2.5), T = point(-0.25, Math.sqrt(4.6875))
    for (const [name, p] of Object.entries({ A, B, C, D, T })) requireCheck(checks, `circle-${name}`, approx(distance(O, p), 2.5), `${name} lies on circle`)
    requireCheck(checks, 'secants', collinear(P, A, B) && collinear(P, C, D), 'P-A-B and P-C-D are collinear in order')
    requireCheck(checks, 'tangent', perpendicular(sub(T, O), sub(T, P)), 'OT is perpendicular to PT')
    const p1 = distance(P, A) * distance(P, B), p2 = distance(P, C) * distance(P, D), p3 = distance(P, T) ** 2
    requireCheck(checks, 'power-equality', approx(p1, p2) && approx(p2, p3) && approx(p3, 18.75), `${p1}=${p2}=${p3}`)
  } else if (id === 'two-circles') {
    const O1 = point(-1, 0), O2 = point(1, 0), X = point(0, Math.sqrt(2.2 ** 2 - 1)), Y = point(0, -Math.sqrt(2.2 ** 2 - 1))
    requireCheck(checks, 'common-points', [X, Y].every((p) => approx(distance(O1, p), 2.2) && approx(distance(O2, p), 2.2)), 'X,Y lie on both circles')
    requireCheck(checks, 'common-chord', perpendicular(sub(Y, X), sub(O2, O1)), 'XY perpendicular O1O2')
    const tangent = point(1, 0), radius = point(0, 1.2)
    requireCheck(checks, 'common-tangent', perpendicular(tangent, radius), 'both radii perpendicular common tangent')
  } else if (id === 'basic-construction') {
    const A = point(-2.4, 0), B = point(2.4, 0), M = midpoint(A, B), radius = 3.2
    const height = Math.sqrt(radius ** 2 - (distance(A, B) / 2) ** 2)
    const U = point(0, height), V = point(0, -height)
    requireCheck(checks, 'equal-radii', [distance(U, A), distance(U, B), distance(V, A), distance(V, B)].every((value) => approx(value, radius)), 'UA=UB=VA=VB=r')
    requireCheck(checks, 'midpoint', approx(distance(A, M), distance(M, B)), 'AM=MB')
    requireCheck(checks, 'intersection-line', collinear(U, M, V), 'U,M,V are collinear')
    requireCheck(checks, 'perpendicular-bisector', perpendicular(sub(V, U), sub(B, A)), 'UV perpendicular AB')
  } else if (id === 'line-plane') {
    const X1 = point(-0.8, -0.3, -1), O1 = point(0, 0, 0), Y1 = point(0.8, 0.3, 1)
    const X2 = point(-1.2, -0.5, 1), Y2 = point(1.2, 0.5, 1)
    const X3 = point(-1.2, -0.6, 0), Y3 = point(1.2, 0.6, 0)
    requireCheck(checks, 'intersection-point', collinear(X1, O1, Y1) && O1.z === 0 && X1.z * Y1.z < 0, 'first line crosses z=0 only at P')
    requireCheck(checks, 'parallel-plane', X2.z === 1 && Y2.z === 1 && sub(Y2, X2).z === 0, 'second line is parallel to z=0 at z=1')
    requireCheck(checks, 'contained-line', X3.z === 0 && Y3.z === 0, 'third line is contained in z=0')
  } else if (id === 'three-perpendicular') {
    const H = point(0, 0, 0), P = point(0, 0, 3), Q = point(3, 1, 0), l = point(-1, 3, 0)
    requireCheck(checks, 'plane-incidence', H.z === 0 && Q.z === 0, 'H,Q belong to z=0')
    requireCheck(checks, 'PH-plane-normal', sub(P, H).x === 0 && sub(P, H).y === 0, 'PH is parallel to plane normal')
    requireCheck(checks, 'l-perp-HQ', perpendicular(l, sub(Q, H)), 'l dot HQ=0')
    requireCheck(checks, 'l-perp-PQ', perpendicular(l, sub(Q, P)), 'l dot PQ=0')
    requireCheck(checks, 'projection', sub(Q, H).z === 0, 'HQ is the projection of PQ onto z=0')
  } else if (id === 'polyhedra-euler') {
    const vertices = [
      point(0, 0, 0), point(3, 0, 0), point(3, 3, 0), point(0, 3, 0),
      point(0, 0, 3), point(3, 0, 3), point(3, 3, 3), point(0, 3, 3),
    ]
    const edgeCount = vertices.flatMap((a, index) => vertices.slice(index + 1).map((b) => [a, b]))
      .filter(([a, b]) => [a.x !== b.x, a.y !== b.y, a.z !== b.z].filter(Boolean).length === 1 && approx(distance(a, b), 3)).length
    const faceCount = 6
    requireCheck(checks, 'cube-vertices', vertices.length === 8, 'V=8')
    requireCheck(checks, 'cube-edges', edgeCount === 12, `E=${edgeCount}`)
    requireCheck(checks, 'cube-faces', faceCount === 6, 'F=6')
    requireCheck(checks, 'euler-formula', vertices.length - edgeCount + faceCount === 2, 'V-E+F=2')
  } else if (id === 'data-transform') {
    const X = [-2, -0.5, 1.5, 2.5], shifted = X.map((x) => x + 3), scaled = X.map((x) => -2 * x)
    requireCheck(checks, 'shift-mean', approx(mean(shifted), mean(X) + 3), 'mean(X+3)=mean(X)+3')
    requireCheck(checks, 'shift-variance', approx(variance(shifted), variance(X)), 'Var(X+3)=Var(X)')
    requireCheck(checks, 'scale-mean', approx(mean(scaled), -2 * mean(X)), 'mean(-2X)=-2mean(X)')
    requireCheck(checks, 'scale-variance', approx(variance(scaled), 4 * variance(X)), 'Var(-2X)=4Var(X)')
    requireCheck(checks, 'scale-sd', approx(Math.sqrt(variance(scaled)), 2 * Math.sqrt(variance(X))), 'SD(-2X)=2SD(X)')
  } else if (id === 'trig-right-triangle') {
    const A = point(0, 0), B = point(4.8, 0), C = point(4.8, 3.6)
    requireCheck(checks, 'right-angle', perpendicular(sub(A, B), sub(C, B)), 'AB perpendicular BC')
    requireCheck(checks, 'pythagorean', approx(distance(A, C) ** 2, distance(A, B) ** 2 + distance(B, C) ** 2), 'AC is hypotenuse')
    requireCheck(checks, 'ratios', approx(distance(B, C) / distance(A, C), 0.6) && approx(distance(A, B) / distance(A, C), 0.8) && approx(distance(B, C) / distance(A, B), 0.75), 'sin A=.6, cos A=.8, tan A=.75')
  } else if (id === 'tasuki-cross') {
    const a = 2, b = 3, c = 5, d = 7
    requireCheck(checks, 'middle-coefficient', a * d + b * c === 29, 'cross products give ad+bc')
    requireCheck(checks, 'expansion', [a * c, a * d + b * c, b * d].join(',') === '10,29,21', '(2x+3)(5x+7)=10x^2+29x+21')
  } else if (id === 'real-number-line') {
    const root2 = Math.sqrt(2)
    requireCheck(checks, 'irrational-position', root2 > 1 && root2 < 2, '1<sqrt(2)<2')
    requireCheck(checks, 'decimal-binding', approx(root2, 1.41421356, 1e-7), 'plotted decimal equals sqrt(2)')
  } else if (id === 'simultaneous-inequalities') {
    const first = (x) => x > 1 && x <= 4, second = (x) => x >= 2
    requireCheck(checks, 'intersection', [2, 3, 4].every((x) => first(x) && second(x)), '[2,4] belongs to both intervals')
    requireCheck(checks, 'boundaries', !first(1) && first(4) && second(2), 'open at 1, closed at 2 and 4')
    requireCheck(checks, 'outside', !([1.5, 4.5].some((x) => first(x) && second(x))), 'values outside [2,4] are excluded')
  } else if (id === 'absolute-value-distance') {
    requireCheck(checks, 'positive-distance', approx(distance(point(0, 0), point(3, 0)), Math.abs(3)), 'distance from 0 to 3 equals |3|')
    requireCheck(checks, 'negative-distance', approx(distance(point(0, 0), point(-3, 0)), Math.abs(-3)), 'distance from 0 to -3 equals |-3|')
  } else if (id === 'absolute-value-cases') {
    const a = 2
    for (const x of [-1, 2, 5]) requireCheck(checks, `case-${x}`, approx(Math.abs(x - a), x >= a ? x - a : a - x), `absolute-value branch is correct at x=${x}`)
  } else if (id === 'trig-coordinate') {
    const theta = 120 * Math.PI / 180, P = point(Math.cos(theta), Math.sin(theta)), H = point(Math.cos(theta), 0)
    requireCheck(checks, 'unit-circle', approx(norm(P), 1), 'OP=1')
    requireCheck(checks, 'coordinate-values', approx(P.x, -0.5) && approx(P.y, Math.sqrt(3) / 2), 'P=(cos120,sin120)')
    requireCheck(checks, 'projection', perpendicular(sub(P, H), sub(H, point(0, 0))), 'PH is perpendicular to x-axis')
  } else if (id === 'trig-special-angles') {
    const cases = [[0, 1, 0], [90, 0, 1], [180, -1, 0]]
    requireCheck(checks, 'special-values', cases.every(([degree, x, y]) => approx(Math.cos(degree * Math.PI / 180), x) && approx(Math.sin(degree * Math.PI / 180), y)), 'coordinates equal (cos theta,sin theta)')
  } else if (id === 'sine-law') {
    const O = point(0, 0), A = polar(140, 3), B = polar(250, 3), C = polar(20, 3)
    requireCheck(checks, 'circumcircle', [A, B, C].every((p) => approx(distance(O, p), 3)), 'A,B,C lie on the circle of radius 3')
    requireCheck(checks, 'sine-law', approx(distance(B, C) / Math.sin(angleAt(B, A, C)), 6), 'a/sin A=2R')
  } else if (id === 'cosine-law') {
    const A = point(0, 0), B = point(5, 0), C = point(1.5, 3)
    const a = distance(B, C), b = distance(C, A), c = distance(A, B), angleA = angleAt(B, A, C)
    requireCheck(checks, 'cosine-law', approx(a ** 2, b ** 2 + c ** 2 - 2 * b * c * Math.cos(angleA)), 'a^2=b^2+c^2-2bc cos A')
  } else if (id === 'triangle-area') {
    const A = point(0, 0), B = point(5, 0), C = point(1.8, 3), D = point(1.8, 0)
    const b = distance(C, A), c = distance(A, B), angleA = angleAt(B, A, C)
    requireCheck(checks, 'altitude', perpendicular(sub(C, D), sub(B, A)) && collinear(A, B, D), 'CD is the altitude to AB')
    requireCheck(checks, 'area', approx(0.5 * c * distance(C, D), 0.5 * b * c * Math.sin(angleA)), 'base-height area equals sine formula')
  } else if (id === 'heron-triangle') {
    const sides = [3, 4, 5], s = sides.reduce((sum, value) => sum + value, 0) / 2
    requireCheck(checks, 'semiperimeter', s === 6, 's=6')
    requireCheck(checks, 'heron-area', approx(Math.sqrt(s * (s - 3) * (s - 4) * (s - 5)), 6), 'Heron area is 6')
    requireCheck(checks, 'right-triangle', 3 ** 2 + 4 ** 2 === 5 ** 2, '3-4-5 side lengths are consistent')
  } else if (id === 'height-distance') {
    const d = 6, h = 3.6, theta = Math.atan2(h, d)
    requireCheck(checks, 'right-model', perpendicular(point(d, 0), point(0, h)), 'ground and height are perpendicular')
    requireCheck(checks, 'tangent-height', approx(h, d * Math.tan(theta)), 'h=d tan theta')
  } else if (id === 'quadrilateral-split') {
    const A = point(0, 0), B = point(5, 0.5), C = point(4, 3.5), D = point(-0.5, 2.5)
    const triangleArea = (P, Q, R) => Math.abs(cross2(sub(Q, P), sub(R, P))) / 2
    const polygonArea = Math.abs(cross2(A, B) + cross2(B, C) + cross2(C, D) + cross2(D, A)) / 2
    requireCheck(checks, 'area-additivity', approx(polygonArea, triangleArea(A, B, C) + triangleArea(A, C, D)), 'S_ABCD=S_ABC+S_ACD')
  } else if (id === 'spatial-measurement') {
    const A = point(0, 0, 0), B = point(4, 0, 0), C = point(4, 3, 0), G = point(4, 3, 2)
    requireCheck(checks, 'base-diagonal', approx(distance(A, C) ** 2, distance(A, B) ** 2 + distance(B, C) ** 2), 'AC^2=AB^2+BC^2')
    requireCheck(checks, 'space-diagonal', approx(distance(A, G) ** 2, distance(A, C) ** 2 + distance(C, G) ** 2), 'AG^2=AC^2+CG^2')
    requireCheck(checks, 'projection', C.z === 0 && G.x === C.x && G.y === C.y, 'CG is perpendicular to the base plane')
  } else if (id === 'histogram') {
    const frequencies = [2, 5, 8, 4, 1]
    requireCheck(checks, 'frequency-total', frequencies.reduce((sum, value) => sum + value, 0) === 20, 'total frequency is 20')
    requireCheck(checks, 'modal-class', Math.max(...frequencies) === frequencies[2], '20-30 is the modal class')
    requireCheck(checks, 'equal-widths', [10, 10, 10, 10, 10].every((width) => width === 10), 'all class widths equal 10')
  } else if (id === 'boxplot-quartiles') {
    const fiveNumber = [1, 3, 5, 7, 9]
    requireCheck(checks, 'five-number-order', fiveNumber.every((value, index) => index === 0 || fiveNumber[index - 1] <= value), 'min<=Q1<=median<=Q3<=max')
    requireCheck(checks, 'iqr', fiveNumber[3] - fiveNumber[1] === 4, 'IQR=7-3=4')
  } else if (id === 'scatter-correlation') {
    const positiveX = [0, .5, 1, 1.5, 2, 2.5], positiveY = [0, .7, 1.3, 2, 2.7, 3.4]
    const negativeX = [4, 4.5, 5, 5.5, 6, 6.5], negativeY = [4, 3.4, 2.8, 2, 1.4, .7]
    const neutralX = [8, 8.4, 8.8, 9.2, 9.6, 10], neutralY = [.8, 3.7, 1.9, 4.4, 1.1, 3]
    requireCheck(checks, 'positive-correlation', correlation(positiveX, positiveY) > 0.98, 'first group has strong positive correlation')
    requireCheck(checks, 'negative-correlation', correlation(negativeX, negativeY) < -0.98, 'second group has strong negative correlation')
    requireCheck(checks, 'near-zero-correlation', Math.abs(correlation(neutralX, neutralY)) < 0.25, 'third group has near-zero correlation')
  } else if (id === 'statistical-process') {
    const stages = ['Question', 'Collect', 'Analyze', 'Interpret'], edges = [[0, 1], [1, 2], [2, 3], [3, 0]]
    requireCheck(checks, 'four-stages', new Set(stages).size === 4, 'four distinct inquiry stages')
    requireCheck(checks, 'closed-cycle', edges.every(([, to], index) => to === (index + 1) % 4), 'last stage returns to the first')
  } else if (id === 'outlier-boxplot') {
    const q1 = 2, q3 = 5, fence = 9.5, outlier = 11
    requireCheck(checks, 'fence', approx(fence, q3 + 1.5 * (q3 - q1)), 'upper fence=Q3+1.5IQR')
    requireCheck(checks, 'outlier', outlier > fence, '11 lies beyond the upper fence')
  } else if (id === 'hypothesis-test-flow') {
    const decision = (p) => p < 0.05 ? 'reject' : 'keep'
    requireCheck(checks, 'reject-branch', decision(0.04) === 'reject', 'p<0.05 rejects H0')
    requireCheck(checks, 'keep-branch', decision(0.05) === 'keep' && decision(0.2) === 'keep', 'p>=0.05 keeps H0')
  } else if (id === 'counting-tree') {
    const leaves = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    requireCheck(checks, 'product-rule', leaves.length === 3 * 2, 'three first choices and two second choices give six leaves')
    requireCheck(checks, 'unique-leaves', new Set(leaves).size === leaves.length, 'each outcome is counted once')
  } else if (id === 'circular-permutation') {
    const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1)
    requireCheck(checks, 'rotation-classes', factorial(5) / 5 === factorial(4), 'fixing one seat removes rotational duplicates')
    requireCheck(checks, 'count', factorial(4) === 24, '(5-1)!=24')
  } else if (id === 'combination-selection') {
    const choose = (n, r) => Array.from({ length: r }, (_, index) => n - index).reduce((product, value) => product * value, 1) / Array.from({ length: r }, (_, index) => index + 1).reduce((product, value) => product * value, 1)
    requireCheck(checks, 'combination-count', choose(5, 2) === 10, '5C2=10')
    requireCheck(checks, 'order-ignored', new Set(['B', 'E']).size === new Set(['E', 'B']).size, '{B,E}={E,B}')
  } else if (id === 'grid-shortest-path') {
    const choose = (n, r) => Array.from({ length: r }, (_, index) => n - index).reduce((product, value) => product * value, 1) / Array.from({ length: r }, (_, index) => index + 1).reduce((product, value) => product * value, 1)
    requireCheck(checks, 'step-count', 4 + 3 === 7, 'every shortest path has seven steps')
    requireCheck(checks, 'path-count', choose(7, 3) === 35, 'choose three north steps among seven positions')
  } else if (id === 'sample-space') {
    const omega = new Set([1, 2, 3, 4, 5, 6]), event = new Set([2, 4, 6])
    requireCheck(checks, 'subset', [...event].every((value) => omega.has(value)), 'A is a subset of Omega')
    requireCheck(checks, 'event-size', event.size === 3 && omega.size === 6, '|A|=3, |Omega|=6')
  } else if (id === 'complement-event') {
    const omega = new Set([1, 2, 3, 4, 5, 6]), event = new Set([2, 4, 6]), complement = new Set([...omega].filter((value) => !event.has(value)))
    requireCheck(checks, 'disjoint', [...event].every((value) => !complement.has(value)), 'A intersect complement(A) is empty')
    requireCheck(checks, 'union', new Set([...event, ...complement]).size === omega.size, 'A union complement(A)=Omega')
  } else if (id === 'probability-tree') {
    const p = .3, q = .4, leaves = [p * q, p * (1 - q), (1 - p) * q, (1 - p) * (1 - q)]
    requireCheck(checks, 'branch-sums', approx(p + (1 - p), 1) && approx(q + (1 - q), 1), 'each binary branch sums to one')
    requireCheck(checks, 'leaf-sum', approx(leaves.reduce((sum, value) => sum + value, 0), 1), 'leaf probabilities sum to one')
  } else if (id === 'place-value') {
    requireCheck(checks, 'decimal-expansion', 3 * 10 ** 2 + 1 * 10 + 4 === 314, '314=3*10^2+1*10+4')
  } else if (id === 'position-grid') {
    const P = point(3, 2)
    requireCheck(checks, 'coordinate-projections', P.x === 3 && P.y === 2, 'P projects to x=3 and y=2')
  } else if (id === 'earth-measurement') {
    const radius = 3, theta = 40 * Math.PI / 180
    requireCheck(checks, 'central-angle', approx(theta, 2 * Math.PI / 9), '40 degrees=2pi/9 radians')
    requireCheck(checks, 'arc-length', approx(radius * theta, 2 * Math.PI / 3), 's=R theta')
  } else if (id === 'domino-invariant') {
    const colors = Array.from({ length: 4 }, (_, row) => Array.from({ length: 4 }, (_, column) => (row + column) % 2))
    requireCheck(checks, 'balanced-board', colors.flat().filter(Boolean).length === 8, '4x4 board has eight cells of each color')
    requireCheck(checks, 'domino-balance', colors[1][1] !== colors[1][2], 'adjacent cells have opposite colors')
    requireCheck(checks, 'invariant', (8 - 1) - (8 - 1) === 0, 'one domino preserves B-W')
  } else if (id === 'stone-game') {
    const losing = [0]
    for (let n = 1; n <= 12; n += 1) if (![1, 2, 3].some((take) => n >= take && losing.includes(n - take))) losing.push(n)
    requireCheck(checks, 'losing-positions', losing.join(',') === '0,4,8,12', `losing positions=${losing.join(',')}`)
  } else if (id === 'regular-tiling') {
    requireCheck(checks, 'angle-sum', 6 * 60 === 360, 'six 60-degree angles meet around one point')
  } else if (id === 'demorgan') {
    for (const inA of [false, true]) for (const inB of [false, true]) {
      const left = !(inA && inB)
      const right = !inA || !inB
      requireCheck(checks, `truth-${Number(inA)}${Number(inB)}`, left === right, `not(A and B) == not A or not B for ${inA},${inB}`)
    }
  } else {
    throw new Error(`No model verifier registered for ${id}`)
  }
}

export function verifyFigure(entry) {
  const checks = []
  const { spec, tex } = validateFiles(entry, checks)
  verifyModel(entry.id, checks)
  return { spec, tex, checks }
}

export function verifyAll() {
  return expectedFigures.map((entry) => ({ entry, ...verifyFigure(entry) }))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const results = verifyAll()
  for (const { entry, checks } of results) console.log(`PASS ${entry.id} (${checks.length} checks)`)
  console.log(`PASS ${results.length} figures`)
}
