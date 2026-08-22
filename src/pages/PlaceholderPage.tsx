import { Link } from 'react-router-dom'
import { EmptyState, NumberedSection, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { useI18n } from '../i18n/runtime'

export function PlaceholderPage({ eyebrow, title, description, testId }: { eyebrow: string; title: string; description: string; testId?: string }) {
  const { text } = useI18n()
  const localizedTitle = title === '工程チェック' ? text('工程チェック', '工程检查') : title
  return (
    <div className="page-stack" data-testid={testId}>
      <header className="page-hero"><p className="eyebrow">{eyebrow}</p><h1>{localizedTitle}</h1><p>{description}</p></header>
      <NumberedSection number="01" title={text('準備状況', '准备状态')} description={text('機能は段階ゲートを通過してから有効になります。', '功能通过阶段门禁后才会启用。')}>
        <StatusBadge>{text('ページ経路は有効です', '页面路径可用')}</StatusBadge>
        <EmptyState title={text('実装を準備中', '功能准备中')} body={text('静的な完成扱いにはせず、後続段階でデータ・操作・テストを接続します。', '后续阶段会接入真实数据、交互与测试，不会用静态页面冒充完成。')} action={<RaisedButton type="button" disabled>{text('準備中', '准备中')}</RaisedButton>} />
      </NumberedSection>
      <Link className="inline-link" to="/problems">{text('問題ページへ戻る', '返回题目页')} →</Link>
    </div>
  )
}
