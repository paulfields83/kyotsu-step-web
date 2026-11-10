// Imported unchanged from rrikunagasige-dot/kyotsu-step-web at e4c4d3bda282523521d4f8f2d44a71aa277e82f7 (ZIP practice authority).
export type MathPracticeSectionId = 'sets' | 'propositions' | 'proofs' | 'functions'

export type MathPracticeCatalogEntry = {
  problemNo: number
  section: MathPracticeSectionId
  sectionTitle: string
  title: string
  pilot: boolean
}

export const mathPractice87To120Catalog: MathPracticeCatalogEntry[] = [
  { problemNo: 87, section: 'sets', sectionTitle: '集合', title: '素数と集合', pilot: true },
  { problemNo: 88, section: 'sets', sectionTitle: '集合', title: '集合の表し方', pilot: true },
  { problemNo: 89, section: 'sets', sectionTitle: '集合', title: '部分集合', pilot: true },
  { problemNo: 90, section: 'sets', sectionTitle: '集合', title: '集合の包含関係', pilot: true },
  { problemNo: 91, section: 'sets', sectionTitle: '集合', title: '部分集合をすべて求める', pilot: true },
  { problemNo: 92, section: 'sets', sectionTitle: '集合', title: '共通部分と和集合', pilot: true },
  { problemNo: 93, section: 'sets', sectionTitle: '集合', title: '3つの集合', pilot: true },
  { problemNo: 94, section: 'sets', sectionTitle: '集合', title: '補集合', pilot: true },
  { problemNo: 95, section: 'sets', sectionTitle: '集合', title: '集合を復元する', pilot: true },
  { problemNo: 96, section: 'sets', sectionTitle: '集合', title: '3集合の複合演算', pilot: true },
  { problemNo: 97, section: 'sets', sectionTitle: '集合', title: '共通部分から定数を決める', pilot: true },

  { problemNo: 98, section: 'propositions', sectionTitle: '命題と条件', title: '命題と真偽', pilot: true },
  { problemNo: 99, section: 'propositions', sectionTitle: '命題と条件', title: '含意の真偽', pilot: true },
  { problemNo: 100, section: 'propositions', sectionTitle: '命題と条件', title: '反例', pilot: true },
  { problemNo: 101, section: 'propositions', sectionTitle: '命題と条件', title: '条件の否定', pilot: true },
  { problemNo: 102, section: 'propositions', sectionTitle: '命題と条件', title: '「かつ」と「または」', pilot: true },
  { problemNo: 103, section: 'propositions', sectionTitle: '命題と条件', title: '複合条件の否定', pilot: true },
  { problemNo: 104, section: 'propositions', sectionTitle: '命題と条件', title: '必要条件・十分条件', pilot: true },
  { problemNo: 105, section: 'propositions', sectionTitle: '命題と条件', title: '命題の真偽', pilot: true },
  { problemNo: 106, section: 'propositions', sectionTitle: '命題と条件', title: '集合で条件を表す', pilot: true },
  { problemNo: 107, section: 'propositions', sectionTitle: '命題と条件', title: '必要・十分条件の判定', pilot: true },
  { problemNo: 108, section: 'proofs', sectionTitle: '命題と証明', title: '同値の証明', pilot: true },
  { problemNo: 109, section: 'propositions', sectionTitle: '命題と条件', title: '「すべて」と「ある」の否定', pilot: true },

  { problemNo: 110, section: 'proofs', sectionTitle: '命題と証明', title: '逆・対偶・裏', pilot: true },
  { problemNo: 111, section: 'proofs', sectionTitle: '命題と証明', title: '対偶による証明', pilot: true },
  { problemNo: 112, section: 'proofs', sectionTitle: '命題と証明', title: '無理数の証明', pilot: true },
  { problemNo: 113, section: 'proofs', sectionTitle: '命題と証明', title: '平方根と無理数', pilot: true },
  { problemNo: 114, section: 'proofs', sectionTitle: '命題と証明', title: '倍数の証明', pilot: true },
  { problemNo: 115, section: 'proofs', sectionTitle: '命題と証明', title: '背理法', pilot: true },
  { problemNo: 116, section: 'proofs', sectionTitle: '命題と証明', title: '有理数と無理数', pilot: true },
  { problemNo: 117, section: 'proofs', sectionTitle: '命題と証明', title: '無理数を含む等式', pilot: true },

  { problemNo: 118, section: 'functions', sectionTitle: '関数', title: '関数とは何か', pilot: true },
  { problemNo: 119, section: 'functions', sectionTitle: '関数', title: '関数の値', pilot: true },
  { problemNo: 120, section: 'functions', sectionTitle: '関数', title: '文章から関数を作る', pilot: true },
]

export const mathPracticePilotCatalog = mathPractice87To120Catalog.filter((entry) => entry.pilot)
