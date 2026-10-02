import { chromium } from '@playwright/test'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dvi2svg, load, tex } from 'node-tikzjax'

import { expectedFigures, verifyAll } from './verify_math_figures.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = join(repoRoot, 'backend', 'data', 'textbooks', 'math-1a', 'figure-sources')
const dataRoot = join(repoRoot, 'backend', 'data', 'textbooks', 'math-1a')
const fontRoot = join(repoRoot, 'node_modules', 'node-tikzjax', 'css', 'bakoma', 'ttf')
const qaPreviewRoot = join('/tmp', 'kyotsu-step-math-figure-qa')
const visualApproved = process.argv.includes('--visual-approved')
const onlyIds = process.argv.find((argument) => argument.startsWith('--only='))
  ?.slice('--only='.length)
  .split(',')
  .filter(Boolean)
const selectedFigures = onlyIds
  ? expectedFigures.filter((entry) => onlyIds.includes(entry.id))
  : expectedFigures

if (onlyIds) {
  const foundIds = new Set(selectedFigures.map((entry) => entry.id))
  const unknownIds = onlyIds.filter((id) => !foundIds.has(id))
  if (unknownIds.length > 0) throw new Error(`Unknown figure ids: ${unknownIds.join(', ')}`)
}

function latexForTikzJax(source) {
  const texPackages = {}
  const input = source
    .replace(/^% !TeX.*$/gm, '')
    .replace(/\\documentclass(?:\[[^\]]*\])?\{[^}]+\}/g, '')
    .replace(/\\usepackage(?:\[([^\]]*)\])?\{([^}]+)\}/g, (_match, options, names) => {
      for (const name of names.split(',')) texPackages[name.trim()] = options || ''
      return ''
    })
  return { input, texPackages }
}

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function embedFonts(svg) {
  const families = new Set([...svg.matchAll(/font-family="([^"]+)"/g)].map((match) => match[1]))
  const fontFaces = [...families].sort().map((family) => {
    const path = join(fontRoot, `${family}.ttf`)
    if (!existsSync(path)) throw new Error(`Missing TikZ font: ${family}`)
    const encoded = readFileSync(path).toString('base64')
    return `@font-face{font-family:${family};src:url(data:font/ttf;base64,${encoded}) format('truetype');font-display:block}`
  }).join('')
  return svg.replace(/<svg([^>]*)>/, `<svg$1><defs><style>${fontFaces}</style></defs>`)
}

function decorateSvg(svg, spec) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1]?.split(/\s+/).map(Number)
  if (!viewBox || viewBox.length !== 4 || viewBox.some((value) => !Number.isFinite(value))) {
    throw new Error(`Invalid SVG viewBox for ${spec.figure_id}`)
  }
  const [x, y, width, height] = viewBox
  const metadata = `<title>${xmlEscape(spec.topic)}</title><desc>${xmlEscape(spec.teaching_goal)}</desc>`
  const background = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#fff" stroke="none"/>`
  return svg.replace(/(<svg[^>]*>)(<defs>.*?<\/defs>)?/s, (_match, start, defs = '') => `${start}${defs}${metadata}${background}`)
}

function svgDimensions(svg) {
  const width = Number(svg.match(/\bwidth="([0-9.]+)"/)?.[1])
  const height = Number(svg.match(/\bheight="([0-9.]+)"/)?.[1])
  if (!Number.isFinite(width) || !Number.isFinite(height)) throw new Error('SVG has no numeric dimensions')
  return { width, height }
}

function qaPayload(entry, spec, source, checks) {
  return {
    figure_id: entry.id,
    source_sha256: createHash('sha256').update(source).digest('hex'),
    engine: spec.engine,
    math_qa: {
      status: 'pass',
      checks: checks.map(({ name, passed, detail }) => ({ name, passed, detail })),
    },
    compile_qa: {
      status: 'pass',
      standalone_tex: 'figure.tex',
      review_pdf: 'figure.pdf',
      generated_svg: 'figure.svg',
    },
    visual_qa: {
      status: visualApproved ? 'pass' : 'pending',
      review_surface: 'PDF and 2x PNG preview',
    },
    publish_qa: {
      status: visualApproved ? 'pass' : 'pending',
      asset: entry.asset,
    },
  }
}

mkdirSync(qaPreviewRoot, { recursive: true })
await load()
const verified = new Map(verifyAll().map((result) => [result.entry.id, result]))
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({ deviceScaleFactor: 2 })
const page = await context.newPage()

try {
  for (const entry of selectedFigures) {
    const result = verified.get(entry.id)
    const directory = join(sourceRoot, entry.sourceDir)
    const source = readFileSync(join(directory, 'figure.tex'), 'utf8')
    const { input, texPackages } = latexForTikzJax(source)
    const dvi = await tex(input, { texPackages, showConsole: process.env.FIGURE_TEX_DEBUG === '1' })
    let svg = await dvi2svg(dvi, { disableOptimize: false })
    svg = decorateSvg(embedFonts(svg), result.spec)

    const { width, height } = svgDimensions(svg)
    await page.setViewportSize({ width: Math.ceil(width), height: Math.ceil(height) })
    await page.setContent(`<!doctype html><style>html,body{margin:0;background:#fff}svg{display:block}</style>${svg}`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)

    const sourceSvgPath = join(directory, 'figure.svg')
    const sourcePdfPath = join(directory, 'figure.pdf')
    const previewPngPath = join(qaPreviewRoot, `${entry.id}.png`)
    writeFileSync(sourceSvgPath, `${svg}\n`)
    await page.pdf({
      path: sourcePdfPath,
      width: `${width}px`,
      height: `${height}px`,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      printBackground: true,
    })
    await page.locator('svg').screenshot({ path: previewPngPath, animations: 'disabled' })

    const qa = qaPayload(entry, result.spec, source, result.checks)
    writeFileSync(join(directory, 'qa_results.json'), `${JSON.stringify(qa, null, 2)}\n`)
    if (visualApproved) {
      const assetPath = join(dataRoot, entry.asset)
      mkdirSync(dirname(assetPath), { recursive: true })
      writeFileSync(assetPath, `${svg}\n`)
    }
    console.log(`${visualApproved ? 'PUBLISHED' : 'REVIEW'} ${entry.id} (${Math.round(width)}x${Math.round(height)})`)
  }
} finally {
  await context.close()
  await browser.close()
}

console.log(`PNG review previews: ${qaPreviewRoot}`)
