import type { Question } from '../domain/questionSchema'
import type { AppLanguage } from './types'

const labels = {
  subject: {
    'math-1a': { ja: '数学 I・A', zh: '数学 I・A' },
    physics: { ja: '物理', zh: '物理' },
  },
  difficulty: {
    basic: { ja: '基礎', zh: '基础' },
    standard: { ja: '標準', zh: '标准' },
    advanced: { ja: '発展', zh: '进阶' },
    exam: { ja: '本番', zh: '实战' },
  },
} as const

const taxonomyLabels: Record<string, { ja: string; zh: string }> = {
  functions: { ja: '関数', zh: '函数' },
  quadratic: { ja: '二次関数', zh: '二次函数' },
  'data-analysis': { ja: 'データの分析', zh: '数据分析' },
  'frequency-table': { ja: '度数分布表', zh: '频数分布表' },
  mechanics: { ja: '力学', zh: '力学' },
  'motion-graph': { ja: '運動グラフ', zh: '运动图像' },
  electricity: { ja: '電気', zh: '电学' },
  'dc-circuit': { ja: '直流回路', zh: '直流电路' },
  'completing-square': { ja: '平方完成', zh: '配方法' },
  maximum: { ja: '最大値', zh: '最大值' },
  'weighted-mean': { ja: '加重平均', zh: '加权平均' },
  frequency: { ja: '度数', zh: '频数' },
  'velocity-time': { ja: '速度–時間', zh: '速度–时间' },
  displacement: { ja: '移動距離', zh: '位移与路程' },
  'ohms-law': { ja: 'オームの法則', zh: '欧姆定律' },
  'series-parallel': { ja: '直列・並列', zh: '串联与并联' },
  'electric-power': { ja: '電力', zh: '电功率' },
  reading: { ja: '読み取り', zh: '信息读取' },
  'condition-reading': { ja: '条件整理', zh: '条件整理' },
  'law-selection': { ja: '法則選択', zh: '规律选择' },
  'equation-building': { ja: '立式', zh: '列式' },
  calculation: { ja: '計算', zh: '计算' },
  'graph-reading': { ja: 'グラフ読解', zh: '图像读取' },
  'case-classification': { ja: '場合分け', zh: '分类讨论' },
  unit: { ja: '単位', zh: '单位' },
  conclusion: { ja: '結論', zh: '结论' },
}

export function subjectLabel(subject: Question['subject'], language: AppLanguage) {
  return labels.subject[subject][language]
}

export function difficultyLabel(difficulty: Question['difficulty'], language: AppLanguage) {
  return labels.difficulty[difficulty][language]
}

export function taxonomyLabel(tag: string, language: AppLanguage) {
  return language === 'ja' ? tag : taxonomyLabels[tag]?.zh ?? tag
}
