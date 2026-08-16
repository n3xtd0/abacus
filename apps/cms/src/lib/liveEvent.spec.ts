import { describe, expect, it } from 'vitest'
import type { Structure } from '@/payload-types'
import {
  calculatePrizePool,
  calculatePrizes,
  getLevelDurationSeconds,
  getNetContribution,
  getPlayersInTheMoney,
  getRemainingSeconds,
  sortLevelsByBlinds,
} from './liveEvent'

const structure = {
  mainTime: 20,
  levelDurations: [{ level: 2, time: 15 }],
} as Structure

describe('live event clock helpers', () => {
  it('orders levels by big blind, then small blind', () => {
    const levels = sortLevelsByBlinds([
      { id: 4, sb: 1500, bb: 2500 },
      { id: 3, sb: 1000, bb: 2500 },
      { id: 2, sb: 500, bb: 1000 },
      { id: 1, sb: 250, bb: 500 },
    ])

    expect(levels.map(({ id }) => id)).toEqual([1, 2, 3, 4])
  })

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

describe('live event prize helpers', () => {
  it('uses the configured payout-place curve and keeps it within entrant bounds', () => {
    expect(getPlayersInTheMoney(1)).toBe(1)
    expect(getPlayersInTheMoney(13)).toBe(4)
    expect(getPlayersInTheMoney(14)).toBe(4)
    expect(getPlayersInTheMoney(20)).toBe(5)
    expect(getPlayersInTheMoney(24)).toBe(5)
    expect(getPlayersInTheMoney(10, 200)).toBe(10)
    expect(getPlayersInTheMoney(10, 0)).toBe(1)
  })

  it('deducts fixed and percentage costs from a contribution', () => {
    expect(
      getNetContribution(100, {
        feeType: 'percentage',
        feeValue: 10,
        poolType: 'fixed',
        poolValue: 5,
        orgType: 'fixed',
        orgValue: 3,
      }),
    ).toBe(82)
  })

  it('only deducts rebuy costs when configured', () => {
    const baseInput = {
      entries: 10,
      rebuys: 2,
      addons: 1,
      buyin: 100,
      costRebuy: 50,
      costAddon: 25,
      deductions: { feeType: 'percentage' as const, feeValue: 10 },
    }

    expect(calculatePrizePool(baseInput)).toBe(1025)
    expect(calculatePrizePool({ ...baseInput, deductRebuyCosts: true })).toBe(1015)
  })

  it('returns descending payouts that reconcile exactly to the prize pool', () => {
    const prizes = calculatePrizes({ players: 20, prizePool: 1234.56 })

    expect(prizes).toHaveLength(5)
    expect(prizes[0]).toBeGreaterThan(prizes[1])
    expect(prizes.reduce((total, prize) => total + prize, 0)).toBe(1234.56)
  })

  it('follows the supplied relative payout curve', () => {
    expect(calculatePrizes({ players: 2, prizePool: 100, playersInTheMoney: 2 })).toEqual([60, 40])
  })
})
