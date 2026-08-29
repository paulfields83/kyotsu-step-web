import { builtInTextbookUnits } from '../data/textbookUnits'
import type { TextbookUnit } from '../domain/textbookSchema'

export interface TextbookRepository {
  listPublished(): Promise<TextbookUnit[]>
  getById(unitId: string): Promise<TextbookUnit | undefined>
}

class StaticTextbookRepository implements TextbookRepository {
  async listPublished() {
    return builtInTextbookUnits.filter((unit) => unit.status === 'published')
  }

  async getById(unitId: string) {
    return builtInTextbookUnits.find((unit) => unit.unitId === unitId)
  }
}

// UI depends on this repository contract rather than importing the static data directly.
// A future database implementation can replace this object without changing page components.
export const textbookRepository: TextbookRepository = new StaticTextbookRepository()
