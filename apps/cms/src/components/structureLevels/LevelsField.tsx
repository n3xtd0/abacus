'use client'

import { FieldLabel } from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'
import { useLevels } from './useLevels'
import { useLevelTimeValues as useTimeValues } from './useLevelTimeValues'
import { ResponsiveGrid } from './ResponsiveGrid'
import { LevelInputs } from './LevelInputs'

export const LevelsField: FieldClientComponent = ({ field: _field, path }) => {
  const { levels, loading } = useLevels()

  const { levelsChecked, toggleLevel, breakDurations, levelDurations, handleBreakChange, handleTimeChange } = useTimeValues({
    path: path as string,
    levels,
  })
  console.log("🚀 ~ LevelsField ~ breakDurations:", breakDurations)

  if (loading) {
    return <div>Loading levels...</div>
  }

  return (
    <ul className="field-type">
      <FieldLabel label={'Levels'} required={false} />

      <ResponsiveGrid itemCount={levels.length}>
        {levels.map((level) => {
          const isLevelSelected = (levelsChecked || []).includes(level.id)
          const breakTime = Array.isArray(breakDurations) && breakDurations.find((item) => item.levelId === level.id)
          const timeEntry = Array.isArray(levelDurations) && levelDurations.find((item) => item.levelId === level.id)
          return (
            <LevelInputs
              key={level.id}
              level={level}
              selected={isLevelSelected}
              breakTime={breakTime || undefined}
              timeEntry={timeEntry || undefined}
              toggleLevel={toggleLevel}
              handleBreakChange={handleBreakChange}
              handleTimeChange={handleTimeChange}
            />
          )
        })}
      </ResponsiveGrid>
    </ul>
  )
}
