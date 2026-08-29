import { BlockMath, InlineMath } from 'react-katex'
import type { ContentBlock, QuestionAsset } from '../../domain/questionSchema'
import { useI18n } from '../../i18n/runtime'

function resolveAssetSrc(src: string) {
  if (/^(?:https?:|data:|blob:)/i.test(src)) return src

  const viteBase = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  const base = viteBase.endsWith('/') ? viteBase : `${viteBase}/`
  if (src.startsWith(base)) return src

  return `${base}${src.replace(/^\.?\/+/, '')}`
}

export function ContentRenderer({ blocks, assets = [] }: { blocks: ContentBlock[]; assets?: QuestionAsset[] }) {
  const { text } = useI18n()
  return (
    <div className="content-renderer">
      {blocks.map((block) => {
        if (block.type === 'text') return <p key={block.id}>{block.text}</p>
        if (block.type === 'latex') {
          return block.display === 'block'
            ? <div key={block.id} className="formula-scroll" data-testid="latex-block"><BlockMath math={block.latex} /></div>
            : <span key={block.id} className="formula-inline"><InlineMath math={block.latex} /></span>
        }
        if (block.type === 'image') {
          const asset = assets.find((candidate) => candidate.id === block.assetId)
          if (!asset) return <p key={block.id} className="content-error">{text('画像が見つかりません', '找不到图片')}: {block.assetId}</p>
          return <figure key={block.id} className="question-figure"><img src={resolveAssetSrc(asset.src)} alt={block.alt || asset.alt} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure>
        }
        return (
          <figure key={block.id} className="question-table-wrap">
            {block.caption && <figcaption>{block.caption}</figcaption>}
            <div className="table-scroll"><table><thead><tr>{block.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`${block.id}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${block.id}-${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div>
          </figure>
        )
      })}
    </div>
  )
}
