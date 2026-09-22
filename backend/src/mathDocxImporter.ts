import { existsSync, readFileSync } from 'node:fs'
import { basename, join, posix } from 'node:path'
import { inflateRawSync } from 'node:zlib'
import {
  TextbookAnswerBookSchema,
  TextbookUnitSchema,
  type TextbookAnswerBook,
  type TextbookAnswerEntry,
  type TextbookItem,
  type TextbookReadingBlock,
  type TextbookReadingPart,
  type TextbookSection,
  type TextbookUnit,
} from '../../src/domain/textbookSchema'

type ZipEntry = { name: string; data: Buffer }
type DocParagraph = { kind: 'p'; text: string; style?: string }
type DocTable = { kind: 'table'; rows: string[][] }
type DocElement = DocParagraph | DocTable

type RawTopic = {
  title: string
  elements: DocElement[]
}

type RawSection = {
  number: string
  title: string
  topics: RawTopic[]
  pending: DocElement[]
}

type AnswerGroup = {
  label: string
  entries: Map<string, string>
}

type ImportedSource = {
  sections: TextbookSection[]
  answers: TextbookAnswerBook['answers']
  assets: Map<string, Buffer>
  warnings: string[]
}

export type MathDocxUnitConfig = {
  unitId: string
  title: string
  subtitle?: string
  sourceFiles: string[]
  defaultSectionTitle?: string
}

export type ImportedMathTextbook = {
  unit: TextbookUnit
  answerBook: TextbookAnswerBook
  assets: Map<string, Buffer>
  warnings: string[]
}

const AUTHORING_PREFIXES = [
  'この教材の使い方',
  '難易度の考え方',
  '誘導の強さ',
  '空欄の役割',
  '対象範囲',
]

const NOTE_PREFIXES = [
  '注意',
  'ここで確認',
  '別の見方',
  '判断の固定手順',
  '証明で省かないこと',
  '数直線の読み方',
  '読み方',
]

function decodeXml(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function readZipEntries(buffer: Buffer) {
  let eocd = -1
  const min = Math.max(0, buffer.length - 65_557)
  for (let offset = buffer.length - 22; offset >= min; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      eocd = offset
      break
    }
  }
  if (eocd < 0) throw new Error('DOCX zip directory not found')

  const totalEntries = buffer.readUInt16LE(eocd + 10)
  const centralOffset = buffer.readUInt32LE(eocd + 16)
  let cursor = centralOffset
  const entries = new Map<string, Buffer>()

  for (let index = 0; index < totalEntries; index += 1) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) throw new Error('invalid DOCX central directory')
    const compressionMethod = buffer.readUInt16LE(cursor + 10)
    const compressedSize = buffer.readUInt32LE(cursor + 20)
    const fileNameLength = buffer.readUInt16LE(cursor + 28)
    const extraLength = buffer.readUInt16LE(cursor + 30)
    const commentLength = buffer.readUInt16LE(cursor + 32)
    const localOffset = buffer.readUInt32LE(cursor + 42)
    const fileName = buffer.subarray(cursor + 46, cursor + 46 + fileNameLength).toString('utf8')

    if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error(`invalid DOCX local entry: ${fileName}`)
    const localNameLength = buffer.readUInt16LE(localOffset + 26)
    const localExtraLength = buffer.readUInt16LE(localOffset + 28)
    const dataStart = localOffset + 30 + localNameLength + localExtraLength
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize)

    let data: Buffer
    if (compressionMethod === 0) data = Buffer.from(compressed)
    else if (compressionMethod === 8) data = inflateRawSync(compressed)
    else throw new Error(`unsupported DOCX compression method ${compressionMethod}: ${fileName}`)

    entries.set(fileName, data)
    cursor += 46 + fileNameLength + extraLength + commentLength
  }

  return entries
}

function xmlAttributes(fragment: string) {
  const attributes = new Map<string, string>()
  for (const match of fragment.matchAll(/([:\w-]+)="([^"]*)"/g)) attributes.set(match[1], decodeXml(match[2]))
  return attributes
}

function documentRelationships(xml: string) {
  const relationships = new Map<string, string>()
  for (const match of xml.matchAll(/<Relationship\b([^>]*)\/?\s*>/g)) {
    const attrs = xmlAttributes(match[1])
    const id = attrs.get('Id')
    const target = attrs.get('Target')
    if (!id || !target || attrs.get('TargetMode') === 'External') continue
    relationships.set(id, posix.normalize(posix.join('word', target)))
  }
  return relationships
}

function fragmentText(fragment: string, relationships: Map<string, string>) {
  const chunks: string[] = []
  const tokenPattern = /<(?:w|m):t\b[^>]*>([\s\S]*?)<\/(?:w|m):t>|<w:tab\b[^>]*\/?\s*>|<w:br\b[^>]*\/?\s*>|<a:blip\b([^>]*)\/?\s*>/g
  for (const match of fragment.matchAll(tokenPattern)) {
    if (match[1] !== undefined) {
      chunks.push(decodeXml(match[1]))
      continue
    }
    if (match[0].startsWith('<w:tab')) {
      chunks.push('　')
      continue
    }
    if (match[0].startsWith('<w:br')) {
      chunks.push('\n')
      continue
    }
    const attrs = xmlAttributes(match[2] ?? '')
    const rid = attrs.get('r:embed')
    const target = rid ? relationships.get(rid) : undefined
    if (target) chunks.push(`[[IMAGE:${target}]]`)
  }
  return chunks.join('').replace(/\u00a0/g, ' ').trim()
}

function readDocElements(entries: Map<string, Buffer>) {
  const documentXml = entries.get('word/document.xml')?.toString('utf8')
  if (!documentXml) throw new Error('word/document.xml is missing')
  const relXml = entries.get('word/_rels/document.xml.rels')?.toString('utf8') ?? ''
  const relationships = documentRelationships(relXml)
  const body = documentXml.match(/<w:body\b[^>]*>([\s\S]*?)<\/w:body>/)?.[1]
  if (!body) throw new Error('DOCX body is missing')

  const elements: DocElement[] = []
  const elementPattern = /<w:p\b[\s\S]*?<\/w:p>|<w:tbl\b[\s\S]*?<\/w:tbl>/g
  for (const match of body.matchAll(elementPattern)) {
    const xml = match[0]
    if (xml.startsWith('<w:p')) {
      const text = fragmentText(xml, relationships)
      if (!text) continue
      const style = xml.match(/<w:pStyle\b[^>]*w:val="([^"]+)"/)?.[1]
      elements.push({ kind: 'p', text, ...(style ? { style } : {}) })
      continue
    }

    const rows: string[][] = []
    for (const rowMatch of xml.matchAll(/<w:tr\b[\s\S]*?<\/w:tr>/g)) {
      const row: string[] = []
      for (const cellMatch of rowMatch[0].matchAll(/<w:tc\b[\s\S]*?<\/w:tc>/g)) {
        row.push(fragmentText(cellMatch[0], relationships))
      }
      if (row.some(Boolean)) rows.push(row)
    }
    if (rows.length) elements.push({ kind: 'table', rows })
  }

  return elements
}

function normalizeSpace(value: string) {
  return value.replace(/[\t\r\n]+/g, ' ').replace(/[ 　]+/g, ' ').trim()
}

function normalizeHeading(value: string) {
  return normalizeSpace(value)
    .replace(/^第\s*[0-9０-９]+\s*節\s*/u, '')
    .replace(/^[0-9０-９]+[.．]?\s*/u, '')
    .replace(/[「」『』（）()・／/：:,.，。\-―–—\s]/g, '')
    .toLowerCase()
}

function toAsciiDigits(value: string) {
  return value.replace(/[０-９]/g, (char) => String(char.charCodeAt(0) - 0xff10))
}

function isAuthoringMeta(text: string) {
  const normalized = normalizeSpace(text)
  if (AUTHORING_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return true
  if (/^教科書\s*p\.?\s*\d+/i.test(normalized)) return true
  if (/^Guide\s*p\.?\s*\d+/i.test(normalized)) return true
  if (/^教科書\s*p\.?\s*\d+.*Guide\s*p/i.test(normalized)) return true
  return false
}

function sectionHeading(text: string) {
  const normalized = normalizeSpace(text)
  if (/節末問題/.test(normalized)) return undefined
  const match = normalized.match(/^第\s*([0-9０-９]+)\s*節\s+(.+)$/u)
  if (!match) return undefined
  return { number: toAsciiDigits(match[1]), title: match[2].trim() }
}

function topicHeading(text: string, style?: string) {
  const normalized = normalizeSpace(text)
  const numbered = normalized.match(/^([0-9０-９]+)[　 ]+(.+)$/u)
  if (
    numbered
    && normalized.length <= 56
    && !/[。！？【】=≦≧<>]/.test(numbered[2])
  ) return numbered[2].trim()
  if (/^第\s*[0-9０-９]+\s*節\s*節末問題/u.test(normalized)) return normalized.replace(/^第\s*[0-9０-９]+\s*節\s*/u, '').trim()
  if (/^(章末問題|章末確認|思考力を養う|思考力)/u.test(normalized)) return normalized
  if (style && /heading|見出し/i.test(style) && !/^第\s*[0-9０-９]+\s*節/u.test(normalized)) return normalized
  return undefined
}

function isAnswersMarker(text: string) {
  return /^解答(?:一覧|例|集)?/u.test(normalizeSpace(text))
}

function parseAnswerRow(row: string[]) {
  const entries: Array<[string, string]> = []
  for (const cell of row) {
    const normalized = normalizeSpace(cell)
    const match = normalized.match(/^【?([0-9０-９]+)】?\s*[=＝]\s*(.+)$/u)
    if (match) entries.push([toAsciiDigits(match[1]), match[2].trim()])
  }
  if (entries.length) return entries

  for (let index = 0; index + 1 < row.length; index += 2) {
    const number = normalizeSpace(row[index]).match(/^【?([0-9０-９]+)】?$/u)?.[1]
    const answer = normalizeSpace(row[index + 1])
    if (number && answer) entries.push([toAsciiDigits(number), answer])
  }
  return entries
}

function parseAnswerGroups(elements: DocElement[]) {
  const groups: AnswerGroup[] = []
  let label = ''
  let entries = new Map<string, string>()

  const flush = () => {
    if (!entries.size) return
    groups.push({ label, entries })
    entries = new Map()
  }

  for (const element of elements) {
    if (element.kind === 'p') {
      const text = normalizeSpace(element.text)
      if (!text) continue
      if (entries.size) flush()
      label = text
      continue
    }

    for (const row of element.rows) {
      const parsed = parseAnswerRow(row)
      if (parsed.length) {
        for (const [number, answer] of parsed) entries.set(number, answer)
        continue
      }
      const rowLabel = normalizeSpace(row.filter(Boolean).join(' '))
      if (rowLabel) {
        if (entries.size) flush()
        label = rowLabel
      }
    }
  }
  flush()
  return groups
}

function ensureSection(sections: RawSection[], fallbackTitle: string) {
  if (sections.length) return sections[sections.length - 1]
  const section: RawSection = { number: '1', title: fallbackTitle, topics: [], pending: [] }
  sections.push(section)
  return section
}

function ensureTopic(section: RawSection) {
  if (section.topics.length) return section.topics[section.topics.length - 1]
  const topic: RawTopic = { title: section.title, elements: section.pending.splice(0) }
  section.topics.push(topic)
  return topic
}

function pushContentElement(section: RawSection, element: DocElement) {
  if (!section.topics.length) section.pending.push(element)
  else section.topics[section.topics.length - 1].elements.push(element)
}

function parseRawSections(elements: DocElement[], fallbackTitle: string) {
  const sections: RawSection[] = []
  let current: RawSection | undefined

  for (const element of elements) {
    if (element.kind === 'table') {
      current = current ?? ensureSection(sections, fallbackTitle)
      pushContentElement(current, element)
      continue
    }

    const text = normalizeSpace(element.text)
    if (!text || isAuthoringMeta(text)) continue
    if (/^塾[　\s]/u.test(text)) continue

    const sectionMentions = text.match(/第\s*[0-9０-９]+\s*節/gu) ?? []
    if (sectionMentions.length > 1) continue

    const section = sectionHeading(text)
    if (section) {
      current = { number: section.number, title: section.title, topics: [], pending: [] }
      sections.push(current)
      continue
    }

    if (/^第\s*[0-9０-９]+\s*章/u.test(text) && !current) continue

    current = current ?? ensureSection(sections, fallbackTitle)
    const topic = topicHeading(text, element.style)
    if (topic) {
      const next: RawTopic = { title: topic, elements: current.pending.splice(0) }
      current.topics.push(next)
      continue
    }

    pushContentElement(current, element)
  }

  for (const section of sections) {
    if (!section.topics.length) ensureTopic(section)
    else if (section.pending.length) section.topics[0].elements.unshift(...section.pending.splice(0))
  }
  return sections
}

function groupScore(topicTitle: string, groupLabel: string) {
  const topic = normalizeHeading(topicTitle)
  const label = normalizeHeading(groupLabel)
  if (!topic || !label) return 0
  if (topic === label) return 100
  if (label.includes(topic) || topic.includes(label)) return 70
  const tokens = [...topic].filter((char) => label.includes(char))
  return Math.min(50, tokens.length)
}

function assignAnswerGroups(topics: RawTopic[], groups: AnswerGroup[]) {
  const assigned = new Map<RawTopic, AnswerGroup>()
  const unused = new Set(groups)

  for (const topic of topics) {
    const blankNumbers = new Set<string>()
    for (const element of topic.elements) {
      if (element.kind === 'p') {
        for (const match of element.text.matchAll(/【([0-9０-９]+)】/g)) blankNumbers.add(toAsciiDigits(match[1]))
      } else {
        for (const row of element.rows) {
          for (const cell of row) {
            for (const match of cell.matchAll(/【([0-9０-９]+)】/g)) blankNumbers.add(toAsciiDigits(match[1]))
          }
        }
      }
    }
    if (!blankNumbers.size) continue

    let best: AnswerGroup | undefined
    let bestScore = -1
    for (const group of unused) {
      const coverage = [...blankNumbers].filter((number) => group.entries.has(number)).length
      if (!coverage) continue
      const score = coverage * 100 + groupScore(topic.title, group.label)
      if (score > bestScore) {
        best = group
        bestScore = score
      }
    }

    if (!best) {
      best = [...unused].find((group) => [...blankNumbers].every((number) => group.entries.has(number)))
        ?? [...unused].find((group) => [...blankNumbers].some((number) => group.entries.has(number)))
    }
    if (best) {
      assigned.set(topic, best)
      unused.delete(best)
    }
  }

  return assigned
}

function answerType(answer: string): TextbookItem['answerType'] {
  const normalized = answer.trim()
  if (/^[+−-]?\d+(?:\.\d+)?$/.test(normalized)) return 'number'
  if (/[=≦≧<>⇒⇔⊂⊃∩∪√²³^!\/]|\\frac|\\sqrt|[a-zA-Z]\^?\d/u.test(normalized)) return 'formula'
  return 'text'
}

function validator(answer: string): TextbookAnswerEntry['validator'] {
  return answerType(answer) === 'number' ? 'number' : 'normalized-text'
}

function textParts(text: string, itemIdFor: (displayNumber: string) => string): TextbookReadingPart[] {
  const parts: TextbookReadingPart[] = []
  let cursor = 0
  for (const match of text.matchAll(/【([0-9０-９]+)】/g)) {
    const index = match.index ?? 0
    if (index > cursor) parts.push({ type: 'text', text: text.slice(cursor, index) })
    parts.push({ type: 'choice', itemId: itemIdFor(toAsciiDigits(match[1])) })
    cursor = index + match[0].length
  }
  if (cursor < text.length) parts.push({ type: 'text', text: text.slice(cursor) })
  return parts.filter((part) => part.type !== 'text' || part.text.length > 0)
}

function safeIdPart(value: string) {
  const ascii = toAsciiDigits(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return ascii || 'x'
}

function noteText(text: string) {
  const normalized = normalizeSpace(text)
  return NOTE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}

function headingText(text: string) {
  const normalized = normalizeSpace(text)
  return /^(教科書\s*(?:問|例|例題)|例題|問[0-9０-９]+|研究|節末|章末|思考力)/u.test(normalized)
}

function mimeExtension(path: string) {
  const match = path.match(/\.([a-zA-Z0-9]+)$/)
  return match?.[1]?.toLowerCase() ?? 'png'
}

function buildSource(
  sourcePath: string,
  sourceIndex: number,
  unitId: string,
  fallbackSectionTitle: string,
) : ImportedSource {
  const zip = readZipEntries(readFileSync(sourcePath))
  const elements = readDocElements(zip)
  const answerMarker = elements.findIndex((element) => element.kind === 'p' && isAnswersMarker(element.text))
  const contentElements = answerMarker >= 0 ? elements.slice(0, answerMarker) : elements
  const answerElements = answerMarker >= 0 ? elements.slice(answerMarker + 1) : []
  const answerGroups = parseAnswerGroups(answerElements)
  const rawSections = parseRawSections(contentElements, fallbackSectionTitle)
  const rawTopics = rawSections.flatMap((section) => section.topics)
  const assignedGroups = assignAnswerGroups(rawTopics, answerGroups)

  const answers: TextbookAnswerBook['answers'] = {}
  const assets = new Map<string, Buffer>()
  const warnings: string[] = []
  const sections: TextbookSection[] = []
  const sourcePrefix = `d${sourceIndex + 1}`

  for (const [sectionIndex, rawSection] of rawSections.entries()) {
    const sectionId = `s${safeIdPart(rawSection.number)}-${sourcePrefix}`
    const figures = new Map<string, TextbookSection['figures'][number]>()
    const readingFlow: TextbookReadingBlock[] = []
    const items = new Map<string, TextbookItem>()

    for (const [topicIndex, topic] of rawSection.topics.entries()) {
      const topicNumber = `${rawSection.number}.${topicIndex + 1}`
      const topicId = `${sectionId}-t${topicIndex + 1}`
      readingFlow.push({ id: `${topicId}-topic`, type: 'topic', text: `${topicNumber} ${topic.title}` })
      const group = assignedGroups.get(topic)

      const itemIdFor = (displayNumber: string) => {
        const id = `${unitId}-${sourcePrefix}-s${safeIdPart(rawSection.number)}-t${topicIndex + 1}-b${safeIdPart(displayNumber)}`
        if (!items.has(id)) {
          let answer = group?.entries.get(displayNumber)
          if (!answer) {
            const candidates = answerGroups.map((candidate) => candidate.entries.get(displayNumber)).filter((value): value is string => Boolean(value))
            const distinct = [...new Set(candidates)]
            if (distinct.length === 1) answer = distinct[0]
          }
          if (!answer) {
            warnings.push(`${unitId}: answer missing for ${rawSection.title} / ${topic.title} 【${displayNumber}】`)
            answer = `[未設定:${displayNumber}]`
          }
          items.set(id, {
            id,
            label: displayNumber,
            prompt: `${topic.title} 【${displayNumber}】`,
            answerType: answerType(answer),
            acceptedAnswers: [],
          })
          answers[id] = { validator: validator(answer), answer, acceptedAnswers: [] }
        }
        return id
      }

      let blockIndex = 1
      for (const element of topic.elements) {
        if (element.kind === 'table') {
          for (const row of element.rows) {
            const text = row.filter(Boolean).join(' ｜ ')
            if (!text) continue
            const parts = textParts(text, itemIdFor)
            if (parts.length) readingFlow.push({ id: `${topicId}-table-${blockIndex++}`, type: 'paragraph', parts })
          }
          continue
        }

        const rawText = element.text.trim()
        const imageMatches = [...rawText.matchAll(/\[\[IMAGE:([^\]]+)\]\]/g)]
        const textWithoutImages = normalizeSpace(rawText.replace(/\[\[IMAGE:[^\]]+\]\]/g, ''))

        for (const imageMatch of imageMatches) {
          const imagePath = imageMatch[1]
          const image = zip.get(imagePath)
          if (!image) {
            warnings.push(`${unitId}: image missing in DOCX: ${imagePath}`)
            continue
          }
          const ext = mimeExtension(imagePath)
          const assetName = `${sourcePrefix}-${basename(imagePath, `.${ext}`).replace(/[^a-zA-Z0-9_-]/g, '-')}.${ext}`
          const figureId = `${topicId}-fig-${figures.size + 1}`
          assets.set(assetName, image)
          figures.set(figureId, { id: figureId, src: `assets/${assetName}`, alt: `${topic.title} の図`, caption: topic.title })
          readingFlow.push({ id: `${topicId}-figure-${blockIndex++}`, type: 'figure', figureId })
        }

        if (!textWithoutImages || isAuthoringMeta(textWithoutImages)) continue
        if (headingText(textWithoutImages)) {
          readingFlow.push({ id: `${topicId}-h-${blockIndex++}`, type: 'heading', text: textWithoutImages })
          continue
        }
        if (noteText(textWithoutImages)) {
          readingFlow.push({ id: `${topicId}-n-${blockIndex++}`, type: 'note', text: textWithoutImages })
          continue
        }
        const parts = textParts(textWithoutImages, itemIdFor)
        if (parts.length) readingFlow.push({ id: `${topicId}-p-${blockIndex++}`, type: 'paragraph', parts })
      }
    }

    if (!items.size) {
      warnings.push(`${unitId}: section has no blanks and was skipped: ${rawSection.title}`)
      continue
    }
    sections.push({
      id: sectionId,
      number: rawSection.number,
      title: rawSection.title,
      figures: [...figures.values()],
      readingFlow,
      items: [...items.values()],
    })
  }

  return { sections, answers, assets, warnings }
}

export const mathDocxUnitConfigs: MathDocxUnitConfig[] = [
  {
    unitId: 'math-1a-numbers-expressions',
    title: '数学I 数と式',
    sourceFiles: ['塾_数学I_第1章_数と式_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx'],
    defaultSectionTitle: '数と式',
  },
  {
    unitId: 'math-1a-quadratic-functions',
    title: '数学I 2次関数',
    sourceFiles: ['塾_数学I_第2章_2次関数_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx'],
    defaultSectionTitle: '2次関数',
  },
  {
    unitId: 'math-1a-geometry-measurement',
    title: '数学I 図形と計量',
    sourceFiles: ['塾_数学I_第4章_図形と計量_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx'],
    defaultSectionTitle: '図形と計量',
  },
  {
    unitId: 'math-1a-data-analysis',
    title: '数学I データの分析',
    sourceFiles: ['塾_数学I_第5章_データの分析_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx'],
    defaultSectionTitle: 'データの分析',
  },
  {
    unitId: 'math-1a-math-a-sets',
    title: '数学A 集合',
    sourceFiles: ['塾_数学A_序章_集合_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx'],
    defaultSectionTitle: '集合',
  },
  {
    unitId: 'math-1a-counting-probability',
    title: '数学A 場合の数と確率',
    sourceFiles: [
      '塾_数学A_教科書学習モード_第1節・第2節_完全版.docx',
      '塾_数学A_第1章_第3節・第4節_確率_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx',
    ],
    defaultSectionTitle: '場合の数と確率',
  },
  {
    unitId: 'math-1a-geometric-properties',
    title: '数学A 図形の性質',
    sourceFiles: ['塾_数学A_第2章_図形の性質_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx'],
    defaultSectionTitle: '図形の性質',
  },
  {
    unitId: 'math-1a-human-activities',
    title: '数学A 数学と人間の活動',
    sourceFiles: ['塾_数学A_第3章_数学と人間の活動_教科書学習モード_完全版_厳格誘導_母本準拠_v8.docx'],
    defaultSectionTitle: '数学と人間の活動',
  },
]

export function loadMathDocxTextbooks(sourceRoot: string) {
  const imported: ImportedMathTextbook[] = []
  const diagnostics: string[] = []

  for (const config of mathDocxUnitConfigs) {
    try {
      const sources = config.sourceFiles.map((fileName, sourceIndex) => {
        const path = join(sourceRoot, fileName)
        if (!existsSync(path)) throw new Error(`source DOCX not found: ${fileName}`)
        return buildSource(path, sourceIndex, config.unitId, config.defaultSectionTitle ?? config.title.replace(/^数学[IA]+\s*/u, ''))
      })
      const sections = sources.flatMap((source) => source.sections)
      const answers = Object.assign({}, ...sources.map((source) => source.answers))
      const assets = new Map<string, Buffer>()
      for (const source of sources) for (const [name, data] of source.assets) assets.set(name, data)
      const warnings = sources.flatMap((source) => source.warnings)

      if (!sections.length) throw new Error('no importable sections')
      if (warnings.some((warning) => warning.includes('answer missing'))) {
        throw new Error(warnings.filter((warning) => warning.includes('answer missing')).slice(0, 5).join('; '))
      }

      const unit = TextbookUnitSchema.parse({
        schemaVersion: '1.0',
        unitId: config.unitId,
        revision: 1,
        status: 'published',
        subject: 'math-1a',
        title: config.title,
        ...(config.subtitle ? { subtitle: config.subtitle } : {}),
        source: {
          type: 'reference',
          label: config.sourceFiles.join(' + '),
          rightsNote: 'ユーザー提供の教科書学習モードWord母本からバックエンド起動時に構造化。',
        },
        objectives: sections.map((section) => `「${section.title}」を、本文・空欄・例題の流れに沿って確認する。`),
        sections,
      })
      const answerBook = TextbookAnswerBookSchema.parse({ unitId: unit.unitId, answers })
      imported.push({ unit, answerBook, assets, warnings })
      diagnostics.push(...warnings)
    } catch (error) {
      diagnostics.push(`${config.unitId}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return { imported, diagnostics }
}
