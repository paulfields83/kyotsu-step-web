/**
 * Shared 物理 module headings for textbook and problem-practice entry points.
 * The screenshot specifies the learner-facing taxonomy, not exercise data.
 * A disabled module is a genuine placeholder, never a fabricated question.
 */
export const PHYSICS_MODULE_GROUPS = [
  {
    id: 'mechanics',
    title: '力学',
    modules: [
      { id: 'physics-1', title: '物体の運動' },
      { id: 'physics-2', title: '剛体のつり合い' },
      { id: 'physics-3', title: '運動量と力積' },
      { id: 'physics-4', title: '円運動と単振動' },
      { id: 'physics-5', title: '万有引力' },
    ],
  },
  {
    id: 'heat',
    title: '熱',
    modules: [{ id: 'physics-heat-gas-molecules', title: '気体分子の運動' }],
  },
  {
    id: 'waves',
    title: '波動',
    modules: [
      { id: 'physics-waves-properties', title: '波の性質' },
      { id: 'physics-waves-sound', title: '音' },
      { id: 'physics-waves-light', title: '光' },
    ],
  },
  {
    id: 'electromagnetism',
    title: '電磁気',
    modules: [
      { id: 'physics-em-electric-field-potential', title: '電界と電位' },
      { id: 'physics-em-current', title: '電流' },
      { id: 'physics-em-current-magnetism', title: '電流と磁界' },
      { id: 'physics-em-induction-waves', title: '電磁誘導と電磁波' },
    ],
  },
  {
    id: 'atomic',
    title: '原子',
    modules: [
      { id: 'physics-atomic-electrons-light', title: '電子と光' },
      { id: 'physics-atomic-nuclei-particles', title: '原子・原子核・素粒子' },
    ],
  },
] as const

export type PhysicsModuleId = (typeof PHYSICS_MODULE_GROUPS)[number]['modules'][number]['id']

type PickerProps = {
  mode: 'textbook' | 'practice'
  availableIds: ReadonlySet<string>
  selectedId?: string
  onSelect?: (id: string) => void
  isLoading?: boolean
}

export function PhysicsModulePicker({ mode, availableIds, selectedId, onSelect, isLoading = false }: PickerProps) {
  return (
    <section
      className="v2-physics-modules"
      data-testid={mode === 'textbook' ? 'physics-textbook-module-picker' : 'physics-practice-module-picker'}
      aria-label="物理の分野・単元"
    >
      <header className="v2-physics-modules__header">
        <h2>物理の分野・単元</h2>
        <p>{mode === 'textbook' ? '学習する単元を選ぶ' : '練習する単元を選ぶ'}</p>
      </header>
      {PHYSICS_MODULE_GROUPS.map(group => (
        <div className="v2-physics-module-group" key={group.id} data-testid={`physics-category-${group.id}`}>
          <h3>{group.title}</h3>
          <div className="v2-physics-module-grid">
            {group.modules.map(module => {
              const available = availableIds.has(module.id)
              const selected = available && module.id === selectedId
              return (
                <button
                  type="button"
                  className="v2-physics-module-button"
                  key={module.id}
                  data-testid={`physics-module-${mode}-${module.id}`}
                  disabled={!available || isLoading}
                  aria-pressed={selected}
                  onClick={() => onSelect?.(module.id)}
                >
                  <strong>{module.title}</strong>
                  {mode === 'textbook' && module.id === 'physics-1' && available && (
                    <span className="v2-physics-module-revised">改訂版</span>
                  )}
                  {!available && <small>{isLoading ? '読み込み中' : '準備中'}</small>}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}
