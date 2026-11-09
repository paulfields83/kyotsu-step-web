import { useState } from 'react'
import { useI18n } from '../../i18n/runtime'

type TableImage = { src: string; alt: string; caption?: string }

export function TrigonometryReferenceTable({ images }: { images: TableImage[] }) {
  const { text } = useI18n()
  const [range, setRange] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const image = images[range]
  if (!image) return null

  return (
    <details className="reading-note trigonometry-reference" data-testid="trig-reference-table">
      <summary>{text('三角比の表を開く', '打开三角比表')}</summary>
      <div className="segmented-control" role="group" aria-label={text('表の範囲', '表格范围')}>
        {images.map((entry, index) => (
          <button key={entry.src} type="button" aria-pressed={range === index} onClick={() => setRange(index)}>
            {entry.caption ?? entry.alt}
          </button>
        ))}
      </div>
      <button type="button" className="reading-hint-trigger" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
        {zoomed ? text('元の大きさ', '恢复大小') : text('表を拡大', '放大表格')}
      </button>
      <div className={'trigonometry-reference__scroll' + (zoomed ? ' is-zoomed' : '')}
        tabIndex={0} aria-label={text('原資料の三角比表', '原资料三角比表')}>
        <img src={image.src} alt={image.alt} />
      </div>
    </details>
  )
}
