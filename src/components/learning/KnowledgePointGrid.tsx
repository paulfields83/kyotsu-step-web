type KnowledgePoint = {
  id: string
  title: string
  detail: string
}

export function KnowledgePointGrid({ label, points, selectedId, onSelect }: {
  label: string
  points: KnowledgePoint[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <nav className="textbook-section-nav knowledge-point-grid" aria-label={label} data-testid="knowledge-point-grid">
      {points.map((point, index) => (
        <button key={point.id} type="button" aria-pressed={selectedId === point.id} onClick={() => onSelect(point.id)}>
          <span>{index + 1}</span>
          <strong>{point.title}</strong>
          <small>{point.detail}</small>
        </button>
      ))}
    </nav>
  )
}
