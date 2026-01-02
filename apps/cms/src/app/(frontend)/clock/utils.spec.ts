import { mixLevelWithBreakDurations } from "./utils"
import { Level, Structure } from "@/payload-types"

describe('Clock utils', () => {
  it('should mix levels with break durations', () => {
    const mockDate = new Date().toISOString()
    const levels: Level[] = [
      { id: 1, sb: 100, bb: 200, updatedAt: mockDate, createdAt: mockDate },
      { id: 2, sb: 200, bb: 300, updatedAt: mockDate, createdAt: mockDate },
      { id: 3, sb: 300, bb: 400, updatedAt: mockDate, createdAt: mockDate },
    ]
    const breakDurations: Structure['breakDurations'] = [
      { level: 1, time: 10 },
      { level: 2, time: 20 },
    ]
    expect(mixLevelWithBreakDurations(levels, breakDurations)).toEqual([
      { id: 1, sb: 100, bb: 200, updatedAt: mockDate, createdAt: mockDate },
      { sb: 0, bb: 0, time: 10 },
      { id: 2, sb: 200, bb: 300, updatedAt: mockDate, createdAt: mockDate },
      { sb: 0, bb: 0, time: 20 },
      { id: 3, sb: 300, bb: 400, updatedAt: mockDate, createdAt: mockDate },
    ])
  })
})