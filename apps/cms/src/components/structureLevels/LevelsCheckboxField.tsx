'use client'

import { useEffect } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'
import type { Level } from '@/payload-types'
import { useLevels } from './useLevels'
import { LabeledInput } from './LabeledInput'
import { useLevelTimeValues } from './useLevelTimeValues'
import { useLevelsChecked } from './useLevelsChecked'

export const LevelsCheckboxField: FieldClientComponent = ({ field: _field, path }) => {
  // const breakTimesField = useField<LevelTimeEntry[]>({
  //   path: 'breakTimes',
  // })
  // const timesValuesField = useField<LevelTimeEntry[]>({
  //   path: 'levelTime',
  // })

  const { breakTimes, levelTime: timesValues, setBreakTimes, setTimesValues } = useLevelTimeValues()
  const { levels, loading } = useLevels()
  const { levelsChecked, setLevelsChecked } = useLevelsChecked({
    breakTimes,
    timesValues,
    path: path as string,
    levels,
  })

  console.log('📊 Current values:', {
    breakTimes,
  })

  const handleLevelChange = (levelId: Level['id']) => {
    const currentValue = levelsChecked || []
    const newValue = currentValue.includes(levelId)
      ? currentValue.filter((id) => id !== levelId)
      : [...currentValue, levelId]
    setLevelsChecked(newValue)
  }

  const handleBreakChange = (levelId: Level['id'], time: number) => {
    console.log('🚀 ~ handleBreakChange ~ time:', time)
    const currentBreaks = breakTimes || []
    const existingBreak = currentBreaks.find((item) => item.level === levelId)

    if (existingBreak) {
      if (time === 0) {
        setBreakTimes(currentBreaks.filter((item) => item.level !== levelId))
      } else {
        setBreakTimes(currentBreaks.map((item) => (item.level === levelId ? { ...item, time } : item)))
      }
    } else {
      setBreakTimes([...currentBreaks, { level: levelId, time }])
    }
  }

  const handleTimeChange = (levelId: Level['id'], time: number) => {
    const currentTimes = timesValues || []
    const existingTime = currentTimes.find((item) => item.level === levelId)

    if (existingTime) {
      if (time === 0) {
        setTimesValues(currentTimes.filter((item) => item.level !== levelId))
      } else {
        setTimesValues(currentTimes.map((item) => (item.level === levelId ? { ...item, time } : item)))
      }
    } else {
      setTimesValues([...currentTimes, { level: levelId, time }])
    }
  }

  if (loading) {
    return <div>Loading levels...</div>
  }

  const numColumns = 3
  const numRows = Math.ceil(levels.length / numColumns)

  return (
    <div className="field-type">
      <FieldLabel label={'Levels'} required={false} />
      <div
        className="grid grid-flow-col gap-3 mt-3"
        style={{
          gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
        }}
      >
        {levels.map((level) => {
          const isLevelSelected = (levelsChecked || []).includes(level.id)
          const breakTime = Array.isArray(breakTimes) && breakTimes.find((item) => item.level === level.id)
          const timeEntry = Array.isArray(timesValues) && timesValues.find((item) => item.level === level.id)
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
                onChange={() => handleLevelChange(level.id)}
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
      </div>
    </div>
  )
}
