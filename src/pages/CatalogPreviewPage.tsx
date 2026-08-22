import { Download, FileJson, Import, Trash2 } from 'lucide-react'
import { useMemo, useState, type ChangeEvent } from 'react'
import { ZodError } from 'zod'
import { ContentRenderer } from '../components/question/ContentRenderer'
import { ConfirmDialog, EmptyState, NumberedSection, RaisedButton, StatusBadge } from '../components/ui/Primitives'
import { builtInQuestions } from '../data/questions'
import { formatQuestionIssues, validateQuestionCatalog } from '../domain/questionSchema'
import { getQuestionCatalog, useAppStore } from '../stores/useAppStore'
import { useI18n } from '../i18n/runtime'
import { subjectLabel } from '../i18n/labels'

function downloadJson(filename: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function CatalogPreviewPage() {
  const customQuestions = useAppStore((state) => state.customQuestions)
  const setCustomQuestions = useAppStore((state) => state.setCustomQuestions)
  const { language, text } = useI18n()
  const catalog = useMemo(() => getQuestionCatalog(customQuestions, language), [customQuestions, language])
  const [questionId, setQuestionId] = useState(catalog[0].questionId)
  const [jsonText, setJsonText] = useState('')
  const [issues, setIssues] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const question = catalog.find((item) => item.questionId === questionId) ?? catalog[0]
  const maxScore = question.simulation.items.reduce((total, item) => total + item.score, 0)
  const isCustom = customQuestions.some((item) => item.questionId === question.questionId)

  const importText = (sourceText = jsonText) => {
    setIssues([])
    setNotice('')
    try {
      const parsed: unknown = JSON.parse(sourceText)
      const candidates = Array.isArray(parsed) ? parsed : [parsed]
      const validated = validateQuestionCatalog([...builtInQuestions, ...candidates])
      const nextCustom = validated.slice(builtInQuestions.length)
      setCustomQuestions(nextCustom)
      setQuestionId(nextCustom[0]?.questionId ?? builtInQuestions[0].questionId)
      setNotice(text(`${nextCustom.length} 問の追加題庫を保存しました。`, `已保存包含 ${nextCustom.length} 道题的追加题库。`))
    } catch (error) {
      if (error instanceof ZodError) setIssues(formatQuestionIssues(error))
      else setIssues([error instanceof Error ? `JSON: ${error.message}` : text('JSON を読み取れませんでした', '无法读取 JSON')])
    }
  }
  const loadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const sourceText = await file.text()
    setJsonText(sourceText)
    importText(sourceText)
    event.target.value = ''
  }
  const removeCustom = () => {
    if (!deleteId) return
    const next = customQuestions.filter((item) => item.questionId !== deleteId)
    validateQuestionCatalog([...builtInQuestions, ...next])
    setCustomQuestions(next)
    setQuestionId(builtInQuestions[0].questionId)
    setDeleteId(null)
    setNotice(text('追加問題を削除しました。履歴の Attempt スナップショットは保持されます。', '追加题目已删除，历史记录中的作答快照会保留。'))
  }

  return (
    <div className="page-stack">
      <header className="page-hero"><p className="eyebrow">SCHEMA / LOCAL CONTENT</p><h1>{text('問題カタログ', '题库管理')}</h1><p>{text('同じ Schema と renderer を学習・模擬・管理プレビューで共有します。', '学习、模拟测试和管理预览共用同一套题目结构与渲染器。')}</p></header>
      <NumberedSection number="01" title={text('題庫一覧', '题库列表')} description={text(`内蔵 ${builtInQuestions.length} 問・追加 ${customQuestions.length} 問`, `内置 ${builtInQuestions.length} 题・追加 ${customQuestions.length} 题`)}>
        <label className="field-label" htmlFor="catalog-question">{text('プレビューする問題', '选择预览题目')}</label>
        <select id="catalog-question" className="select-control" value={question.questionId} onChange={(event) => setQuestionId(event.target.value)}>
          {catalog.map((item) => <option key={item.questionId} value={item.questionId}>{subjectLabel(item.subject, language)}｜{item.title}{customQuestions.some((custom) => custom.questionId === item.questionId) ? text('［追加］', '［追加］') : ''}</option>)}
        </select>
        <div className="tag-row"><StatusBadge tone="success">Schema v{question.schemaVersion} {text('検証済み', '已验证')}</StatusBadge><StatusBadge>{question.learning.variants.detailed.length} {text('空欄', '个填空')}</StatusBadge><StatusBadge>{maxScore} {text('点', '分')}</StatusBadge><StatusBadge tone={isCustom ? 'info' : 'muted'}>{isCustom ? text('追加問題', '追加题目') : text('内蔵・読取専用', '内置・只读')}</StatusBadge></div>
        {isCustom && <RaisedButton className="danger-button" onClick={() => setDeleteId(question.questionId)}><Trash2 aria-hidden="true" />{text('この追加問題を削除', '删除这道追加题')}</RaisedButton>}
      </NumberedSection>
      <NumberedSection number="02" title={text('JSON 導入・書き出し', 'JSON 导入与导出')} description={text('導入は追加題庫全体を置き換え、内蔵題庫と一緒に検証します。', '导入会替换全部追加题，并与内置题库一起进行结构校验。')}>
        <div className="button-row button-row--start"><RaisedButton onClick={() => setJsonText(JSON.stringify(question, null, 2))}><FileJson aria-hidden="true" />{text('選択中を編集欄へ', '把当前题目放入编辑区')}</RaisedButton><label className="raised-button file-button"><Import aria-hidden="true" />{text('JSON ファイルを導入', '导入 JSON 文件')}<input data-testid="catalog-file" type="file" accept="application/json,.json" onChange={loadFile} /></label></div>
        <label className="field-label">{text('JSON 編集欄', 'JSON 编辑区')}<textarea className="textarea-control json-editor" aria-label={text('JSON 編集欄', 'JSON 编辑区')} spellCheck={false} value={jsonText} onChange={(event) => setJsonText(event.target.value)} placeholder='[{ "schemaVersion": "1.0", ... }]' /></label>
        <RaisedButton className="primary-button" data-testid="import-json" disabled={!jsonText.trim()} onClick={() => importText()}><Import aria-hidden="true" />{text('検証して追加題庫を保存', '验证并保存追加题库')}</RaisedButton>
        {notice && <div className="notice-box" role="status">{notice}</div>}
        {issues.length > 0 && <div className="issue-box" role="alert"><strong>{text('導入を中止しました。次の箇所を修正してください。', '导入已停止，请修正以下问题。')}</strong><ol>{issues.map((issue, index) => <li key={`${issue}-${index}`}>{issue}</li>)}</ol></div>}
        <div className="button-row button-row--start"><RaisedButton onClick={() => downloadJson('kyotsu-step-custom-questions.json', customQuestions)} disabled={!customQuestions.length}><Download aria-hidden="true" />{text('追加題庫を書き出す', '导出追加题库')}</RaisedButton><RaisedButton onClick={() => downloadJson('kyotsu-step-full-catalog.json', catalog)}><Download aria-hidden="true" />{text('全題庫を書き出す', '导出全部题库')}</RaisedButton></div>
      </NumberedSection>
      <NumberedSection number="03" title={question.title} description={`${subjectLabel(question.subject, language)} / revision ${question.revision}`}>
        <article data-testid="question-preview"><ContentRenderer blocks={question.stem} assets={question.assets} /></article>
      </NumberedSection>
      <NumberedSection number="04" title={text('解答フローの構造', '解答流程结构')}>
        {question.learning.solutionFlow.length ? <ol className="structure-list">{question.learning.solutionFlow.map((block) => <li key={block.id}>{block.type === 'blank' ? `${text('空欄', '填空')}：${block.blankId}` : `${text('内容ブロック', '内容块')}：${block.content.length} ${text('件', '项')}`}</li>)}</ol> : <EmptyState title={text('フローがありません', '没有解答流程')} body={text('公開問題には最低 1 つのフローブロックが必要です。', '发布的题目至少需要一个流程块。')} />}
      </NumberedSection>
      <ConfirmDialog open={Boolean(deleteId)} title={text('追加問題を削除しますか？', '确定删除追加题目吗？')} body={text('利用中の session は再開できなくなる場合があります。完了済み履歴のスナップショットは残ります。', '正在进行的记录可能无法继续；已完成历史中的快照会保留。')} confirmLabel={text('追加問題を削除', '删除追加题目')} onCancel={() => setDeleteId(null)} onConfirm={removeCustom} />
    </div>
  )
}
