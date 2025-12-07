'use client'

import { FieldLabel } from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'
import { useLevels } from './useLevels'
import { LabeledInput } from './LabeledInput'
import { useLevelTimeValues as useTimeValues } from './useLevelTimeValues'
import { ResponsiveGrid } from './ResponsiveGrid'

export const LevelsField: FieldClientComponent = ({ field: _field, path }) => {
  const { levels, loading } = useLevels()

  const { levelsChecked, toggleLevel, breakDurations, levelDurations, handleBreakChange, handleTimeChange } = useTimeValues({
    path: path as string,
    levels,
  })

  if (loading) {
    return <div>Loading levels...</div>
  }

  return (
    <div className="field-type">
      <FieldLabel label={'Levels'} required={false} />

      <ResponsiveGrid itemCount={levels.length}>
        {levels.map((level) => {
          const isLevelSelected = (levelsChecked || []).includes(level.id)
          const breakTime = Array.isArray(breakDurations) && breakDurations.find((item) => item.level === level.id)
          const timeEntry = Array.isArray(levelDurations) && levelDurations.find((item) => item.level === level.id)
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
