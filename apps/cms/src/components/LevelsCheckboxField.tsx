'use client'

import React, { useEffect, useState } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'
import type { Level } from '../payload-types'

export const LevelsCheckboxField: FieldClientComponent = ({ field: _field, path }) => {
  const { value, setValue } = useField<Level["id"][]>({ path: path as string })
  const { value: breakValue, setValue: setBreakValue } = useField<Level["id"][]>({ path: 'levelBreaks' })
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/level?limit=1000&sort=bb')
        const data = await response.json()
        setLevels(data.docs || [])
      } catch (error) {
        console.error('Error fetching levels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLevels()
  }, [])

  const handleLevelChange = (levelId: Level["id"]) => {
    const currentValue = value || []
    const newValue = currentValue.includes(levelId)
      ? currentValue.filter((id) => id !== levelId)
      : [...currentValue, levelId]
    setValue(newValue)
  }

  const handleBreakChange = (levelId: Level["id"]) => {
    const currentBreaks = breakValue || []
    const newBreaks = currentBreaks.includes(levelId)
      ? currentBreaks.filter((id) => id !== levelId)
      : [...currentBreaks, levelId]
    
    setBreakValue(newBreaks)
  }

  if (loading) {
    return <div>Loading levels...</div>
  }

  // Calculate number of rows needed for column-first ordering
  const numColumns = 3
  const numRows = Math.ceil(levels.length / numColumns)

  return (
    <div className="field-type">
      <FieldLabel label={'Levels'} required={false} />
      <div 
        className="grid grid-flow-col gap-3 mt-3"
        style={{
          gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`
        }}
      >
        {levels.map((level) => {
          const isLevelSelected = (value || []).includes(level.id)
          const hasBreakAfter = (breakValue || []).includes(level.id)
          
          return (
            <div
              key={level.id}
              className={`flex flex-col gap-2 p-3 rounded-md border-2 transition-all duration-200 ${
                isLevelSelected 
                  ? 'bg-zinc-900 border-blue-600' 
                  : 'bg-zinc-800 border-zinc-700'
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer text-white font-medium">
                <input
                  type="checkbox"
                  checked={isLevelSelected}
                  onChange={() => handleLevelChange(level.id)}
                  className="cursor-pointer w-4 h-4 accent-blue-600"
                />
                <span>{`${level.sb} / ${level.bb}`}</span>
              </label>
              
              {isLevelSelected && (
                <label
                  className={`flex items-center gap-2 cursor-pointer text-sm pl-6 ${
                    hasBreakAfter ? 'text-green-400' : 'text-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hasBreakAfter}
                    onChange={() => handleBreakChange(level.id)}
                    className="cursor-pointer w-3.5 h-3.5 accent-green-400"
                  />
                  <span>Break after this level</span>
                </label>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

