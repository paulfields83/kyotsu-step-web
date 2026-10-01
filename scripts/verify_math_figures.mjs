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
  ['angle-bisector', 'geometry/angle-bisector', 'geometric-properties/assets/angle-bisector.svg'],
  ['triangle-centroid', 'geometry/triangle-centroid', 'geometric-properties/assets/triangle-centroid.svg'],
  ['triangle-centers', 'geometry/triangle-centers', 'geometric-properties/assets/triangle-centers.svg'],
  ['five-centers-summary', 'geometry/five-centers-summary', 'geometric-properties/assets/five-centers-summary.svg'],
  ['ceva', 'geometry/ceva', 'geometric-properties/assets/ceva.svg'],
  ['menelaus', 'geometry/menelaus', 'geometric-properties/assets/menelaus.svg'],
  ['ceva-reverse', 'geometry/ceva-reverse', 'geometric-properties/assets/ceva-reverse.svg'],
  ['menelaus-reverse', 'geometry/menelaus-reverse', 'geometric-properties/assets/menelaus-reverse.svg'],
  ['triangle-side-angle', 'geometry/triangle-side-angle', 'geometric-properties/assets/triangle-side-angle.svg'],
  ['cyclic-quadrilateral', 'geometry/cyclic-quadrilateral', 'geometric-properties/assets/cyclic-quadrilateral.svg'],
  ['tangent-chord', 'geometry/tangent-chord', 'geometric-properties/assets/tangent-chord.svg'],
  ['power-of-point', 'geometry/power-of-point', 'geometric-properties/assets/power-of-point.svg'],
  ['two-circles', 'geometry/two-circles', 'geometric-properties/assets/two-circles.svg'],
  ['three-perpendicular', 'geometry/three-perpendicular', 'geometric-properties/assets/three-perpendicular.svg'],
  ['data-transform', 'statistics/data-transform', 'data-analysis/assets/data-transform.svg'],
  ['trig-right-triangle', 'trigonometry/trig-right-triangle', 'geometry-measurement/assets/trig-right-triangle.svg'],
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
  const pgfIds = new Set(['quadratic-domain-range', 'quadratic-vertex-form', 'quadratic-shift', 'quadratic-max-min', 'data-transform'])
  if (pgfIds.has(entry.id)) requireCheck(checks, 'pgfplots-formula', tex.includes('\\addplot'), 'function/statistics geometry comes from PGFPlots')
  if (entry.id === 'three-perpendicular') requireCheck(checks, '3d-engine', tex.includes('tikz-3dplot'), '3D coordinates use tikz-3dplot')
  const sourceBindings = {
    'quadratic-domain-range': [/domain=-2:3/, /coordinates \{\(-2,3\) \(3,8\)\}/, /coordinates \{\(0,-1\)\}/],
    'quadratic-vertex-form': [/\{2\*\(x-1\.5\)\^2-2\}/, /coordinates \{\(1\.5,-2\)\}/, /axis cs:1\.5,-3\.1/],
    'quadratic-shift': [/\.5\*\(x-2\)\^2\+1/, /-\(\.5\*\(x-2\)\^2\+1\)/, /coordinates \{\(2,1\)\}/],
    'quadratic-max-min': [/\{\(x-1\)\^2-2\}/, /\{2\*x\^2-2\*x\}/, /\{\(x-1\)\^2\}/],
    'angle-bisector': [/\\pgfmathsetmacro\{\\ratio\}\{\\AB\/\(\\AB\+\\AC\)\}/, /\(B\)!\\ratio!\(C\)/],
    'triangle-centroid': [/\(B\)!\.5!\(C\)/, /name intersections=\{of=medianA and medianB,by=G\}/],
    'triangle-centers': [/\(O\) at \(2\.4,1\.2294118\)/, /\(I\) at \(1\.52154,1\.20510\)/, /\(H\) at \(\.8,\.9411765\)/],
    'five-centers-summary': [/\(G\) at \(1\.3333,\.8\)/, /\(O\) at \(1\.7,\.85\)/, /\(\.95,-\.025\)--\(2\.45,1\.725\)/, /\(I\) at \(1\.093,\.853\)/, /\(H\) at \(\.6,\.7\)/, /\(Ia\) at \(2\.307,-2\.955\)/],
    ceva: [/\(P\) at \(2\.3,1\.6\)/, /of=AP and BC,by=D/, /of=BP and CA,by=E/, /of=CP and AB,by=F/],
    menelaus: [/\(X\) at \(-3,-\.25\)/, /\(Y\) at \(7,3\.25\)/, /of=transversal and BCext,by=D/, /of=transversal and CA,by=E/, /of=transversal and AB,by=F/],
    'ceva-reverse': [/\(B\)!\.4!\(C\)/, /\(C\)!\.6!\(A\)/, /\(A\)!\.5!\(B\)/, /of=AD and BE,by=P/],
    'menelaus-reverse': [/\(D\) at \(-2,0\)/, /\(C\)!\.5!\(A\)/, /\(A\)!\.8!\(B\)/],
    'triangle-side-angle': [/\(A\) at \(1\.2,3\)/, /\(C\) at \(5\.8,0\)/, /\\angle A>\\angle B>\\angle C/],
    'cyclic-quadrilateral': [/\(A\) at \(150:3\)/, /\(B\) at \(230:3\)/, /\(C\) at \(325:3\)/, /\(D\) at \(55:3\)/],
    'tangent-chord': [/\(T\) at \(3,0\)/, /\(A\) at \(220:3\)/, /\(B\) at \(110:3\)/, /angle=S--T--A/, /angle=T--B--A/],
    'power-of-point': [/\(O\) at \(1,0\)/, /\(T\) at \(-\.25,2\.1650635\)/, /\(P\)--\(T\)/],
    'two-circles': [/\(X\) at \(0,1\.959592\)/, /\(Y\) at \(0,-1\.959592\)/, /\(T1\) at \(-1\.5,1\.2\)/, /\(T2\) at \(1\.5,1\.2\)/],
    'three-perpendicular': [/\(H\) at \(0,0,0\)/, /\(P\) at \(0,0,3\)/, /\(Q\) at \(3,1,0\)/, /\(L1\) at \(-1,3,0\)/, /\(L2\) at \(1,-3,0\)/],
    'data-transform': [/coordinates \{\(-2,0\) \(-\.5,0\) \(1\.5,0\) \(2\.5,0\)\}/, /coordinates \{\(1,1\) \(2\.5,1\) \(4\.5,1\) \(5\.5,1\)\}/, /coordinates \{\(4,1\) \(1,1\) \(-3,1\) \(-5,1\)\}/],
    'trig-right-triangle': [/\(A\) at \(0,0\)/, /\(B\) at \(4\.8,0\)/, /\(C\) at \(4\.8,3\.6\)/, /\\sin A=\\frac\{BC\}\{AC\}/],
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
  } else if (id === 'three-perpendicular') {
    const H = point(0, 0, 0), P = point(0, 0, 3), Q = point(3, 1, 0), l = point(-1, 3, 0)
    requireCheck(checks, 'plane-incidence', H.z === 0 && Q.z === 0, 'H,Q belong to z=0')
    requireCheck(checks, 'PH-plane-normal', sub(P, H).x === 0 && sub(P, H).y === 0, 'PH is parallel to plane normal')
    requireCheck(checks, 'l-perp-HQ', perpendicular(l, sub(Q, H)), 'l dot HQ=0')
    requireCheck(checks, 'l-perp-PQ', perpendicular(l, sub(Q, P)), 'l dot PQ=0')
    requireCheck(checks, 'projection', sub(Q, H).z === 0, 'HQ is the projection of PQ onto z=0')
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
