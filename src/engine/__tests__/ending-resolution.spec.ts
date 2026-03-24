import { describe, expect, it } from 'vitest'
import { resolveEndingId, shouldUseObjectiveSystem } from '../ending-resolution'

describe('ending resolution', () => {
  it('prefers the objective ending when objective_complete is set', () => {
    const state = {
      karma: 10,
      flags: new Set(['objective_complete']),
    }

    const endingId = resolveEndingId(
      [
        { id: 'legend', req: (s) => s.karma >= 8 },
        { id: 'objective_complete', req: (s) => s.flags.has('objective_complete') },
      ],
      state,
    )

    expect(endingId).toBe('objective_complete')
  })

  it('disables objective flow in expedition mode', () => {
    expect(shouldUseObjectiveSystem('expedition', 'redeemer')).toBe(false)
  })

  it('keeps objective flow enabled in free roam when an objective is selected', () => {
    expect(shouldUseObjectiveSystem('free_roam', 'redeemer')).toBe(true)
  })
})
