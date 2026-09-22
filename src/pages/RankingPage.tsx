import { Medal, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { NumberedSection, StatusBadge } from '../components/ui/Primitives'
import { buildLocalRanking } from '../domain/ranking'
import { useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'

export function RankingPage() {
  const learningAttempts = useAppStore((state) => state.learningAttempts)
  const simulationAttempts = useAppStore((state) => state.simulationAttempts)
  const displayName = useAppStore((state) => state.settings.displayName)
  const { language, text } = useI18n()
  const localizedName = language === 'zh' && displayName === '学習者' ? '学习者' : displayName
  const ranking = useMemo(() => buildLocalRanking(localizedName, learningAttempts, simulationAttempts), [localizedName, learningAttempts, simulationAttempts])
  const currentRank = ranking.findIndex((entry) => entry.isCurrentUser) + 1
  return <div className="page-stack"><header className="page-hero"><p className="eyebrow">LOCAL DEMO</p><h1>{text('ランキング', '排行榜')}</h1><p>{text('この端末の実績を固定の演示データと比較します。全国順位ではありません。', '把本设备上的学习成绩与固定演示数据比较，不代表全国排名。')}</p></header><div className="ranking-callout"><ShieldCheck aria-hidden="true" /><div><strong>{text('ローカル演示', '本地演示')}</strong><p>{text('送信、アカウント照合、他ユーザーとの通信は行いません。', '不会发送数据、核对账号或与其他用户通信。')}</p></div></div><div className="score-board"><span><strong>{currentRank}</strong><small>{text('現在位置', '当前位置')}</small></span><span><strong>{ranking.find((entry) => entry.isCurrentUser)?.points ?? 0}</strong><small>{text('実績ポイント', '学习积分')}</small></span><span><strong>{learningAttempts.length + simulationAttempts.length}</strong><small>{text('完了回数', '完成次数')}</small></span></div><NumberedSection number="01" title={text('演示比較', '演示比较')}><ol className="ranking-list">{ranking.map((entry, index) => <li className={entry.isCurrentUser ? 'ranking-list__me' : ''} key={`${entry.name}-${entry.isCurrentUser}`}><span className="rank-number">{index < 3 ? <Medal aria-hidden="true" /> : index + 1}</span><div><strong>{entry.isCurrentUser ? entry.name : `${text('演示', '演示')} ${entry.name.slice(-1)}`}</strong>{entry.isCurrentUser ? <StatusBadge tone="success">{text('あなた・実績値', '你・实际数据')}</StatusBadge> : <small>{text('固定演示データ', '固定演示数据')}</small>}</div><b>{entry.points} pt</b></li>)}</ol></NumberedSection></div>
}
