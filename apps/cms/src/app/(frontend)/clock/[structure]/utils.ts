import { Level } from '@/payload-types'
import { Break, PopulatedStructure } from './types'

export function mixLevelWithBreakDurations(levels: Level[], breakDurations: PopulatedStructure['breakDurations']) {
  return levels.reduce((acc: (Level | Break)[], level: Level) => {
    const breakDuration = breakDurations?.find((duration) => duration.level.id === level.id)
    if (!breakDuration) return [...acc, level]
    else return [...acc, level, { sb: 0, bb: 0, time: breakDuration.time } as Break]
  }, [])
}
