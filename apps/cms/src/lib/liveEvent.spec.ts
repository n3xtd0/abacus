import { describe, expect, it } from 'vitest'
import type { Structure } from '@/payload-types'
import { getLevelDurationSeconds, getRemainingSeconds } from './liveEvent'

const structure = {
  mainTime: 20,
  levelDurations: [{ level: 2, time: 15 }],
} as Structure

describe('live event clock helpers', () => {
  it('uses a per-level duration before the structure default', () => {
    expect(getLevelDurationSeconds(structure, 2)).toBe(900)
    expect(getLevelDurationSeconds(structure, 1)).toBe(1200)
  })

  it('counts down only while the clock is running', () => {
    expect(
      getRemainingSeconds({
        currentTime: 120,
        clockStartedAt: '2026-08-16T08:00:00.000Z',
        status: 'running',
        now: new Date('2026-08-16T08:00:15.900Z').getTime(),
      }),
    ).toBe(105)
    expect(getRemainingSeconds({ currentTime: 120, status: 'paused' })).toBe(120)
  })
})
