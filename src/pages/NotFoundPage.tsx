import { Link } from 'react-router-dom'
import { ErrorState } from '../components/ui/Primitives'
import { useI18n } from '../i18n/runtime'

export function NotFoundPage() {
  const { text } = useI18n()
  return <div className="page-stack"><header className="page-hero"><p className="eyebrow">404</p><h1>{text('ページが見つかりません', '找不到页面')}</h1></header><ErrorState title={text('無効な経路です', '页面地址无效')} body={text('URL を確認するか、問題ページからやり直してください。', '请检查网址，或从题目页重新进入。')} action={<Link className="raised-link" to="/problems">{text('問題ページへ', '返回题目页')}</Link>} /></div>
}
