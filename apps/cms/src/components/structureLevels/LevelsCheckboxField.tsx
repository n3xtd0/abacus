'use client'

import { FieldLabel } from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'
import type { Level } from '@/payload-types'
import { useLevels } from './useLevels'
import { LabeledInput } from './LabeledInput'
import { useLevelTimeValues } from './useLevelTimeValues'
import { ResponsiveGrid } from './ResponsiveGrid'

export const LevelsCheckboxField: FieldClientComponent = ({ field: _field, path }) => {
  const { levels, loading } = useLevels()

  const {
    breakDurations,
    levelDurations,
    setBreakDurations,
    setLevelDurations,
    levelsChecked,
    toggleLevel,
  } = useLevelTimeValues({ path: path as string, levels })

  const handleBreakChange = (levelId: Level['id'], time: number) => {
    const currentBreaks = breakDurations || []
    const existingBreak = currentBreaks.find((item) => item.levelId === levelId)

    if (existingBreak) {
      if (time === 0) {
        setBreakDurations(currentBreaks.filter((item) => item.levelId !== levelId))
      } else {
        setBreakDurations(currentBreaks.map((item) => (item.levelId === levelId ? { ...item, time } : item)))
      }
    } else {
      setBreakDurations([...currentBreaks, { levelId: levelId, time }])
    }
  }

  const handleTimeChange = (levelId: Level['id'], time: number) => {
    const currentTimes = levelDurations || []
    const existingTime = currentTimes.find((item) => item.levelId === levelId)

    if (existingTime) {
      if (time === 0) {
        setLevelDurations(currentTimes.filter((item) => item.levelId !== levelId))
      } else {
        setLevelDurations(currentTimes.map((item) => (item.levelId === levelId ? { ...item, time } : item)))
      }
    } else {
      setLevelDurations([...currentTimes, { levelId: levelId, time }])
    }
  }

  if (loading) {
    return <div>Loading levels...</div>
  }

  return (
    <div className="field-type">
      <FieldLabel label={'Levels'} required={false} />

      <ResponsiveGrid itemCount={levels.length}>
        {levels.map((level) => {
          const isLevelSelected = (levelsChecked || []).includes(level.id)
          const breakTime = Array.isArray(breakDurations) && breakDurations.find((item) => item.levelId === level.id)
          const timeEntry = Array.isArray(levelDurations) && levelDurations.find((item) => item.levelId === level.id)
          return (
            <div
              key={level.id}
              className={`flex flex-col gap-2 p-3 rounded-md border-2 transition-all duration-200 ${
                isLevelSelected ? 'bg-zinc-900 border-blue-600' : 'bg-zinc-800 border-zinc-700'
              }`}
            >
              <LabeledInput
                label={`${level.sb} / ${level.bb}`}
                value={isLevelSelected ? 'true' : 'false'}
                onChange={() => toggleLevel(level.id)}
                className="w-4 h-4 accent-blue-600"
                labelClassName="text-white font-medium"
              />
              {isLevelSelected && (
                <LabeledInput
                  type="number"
                  label="Break time after this level"
                  value={breakTime ? breakTime.time.toString() : ''}
                  onChange={(e) => handleBreakChange(level.id, Number(e.target.value))}
                  className=""
                  labelClassName={`${breakTime ? 'text-green-400' : 'text-gray-400'}`}
                />
              )}
              {isLevelSelected && (
                <LabeledInput
                  label="Custom time for this level"
                  value={timeEntry ? timeEntry.time.toString() : ''}
                  onChange={(e) => handleTimeChange(level.id, Number(e.target.value))}
                  type="number"
                  className="text-white"
                />
              )}
            </div>
          )
        })}
      </ResponsiveGrid>
    </div>
  )
}
