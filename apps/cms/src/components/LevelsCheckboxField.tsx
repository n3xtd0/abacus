'use client'

import React, { useEffect, useState } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import type { FieldClientComponent } from 'payload'
import type { Level } from '../payload-types'

export const LevelsCheckboxField: FieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<Level["id"][]>({ path: path as string })
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/level?limit=100')
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

  const handleChange = (levelId: Level["id"]) => {
    const currentValue = value || []
    const newValue = currentValue.includes(levelId)
      ? currentValue.filter((id) => id !== levelId)
      : [...currentValue, levelId]
    setValue(newValue)
  }

  if (loading) {
    return <div>Loading levels...</div>
  }

  return (
    <div className="field-type">
      <FieldLabel label={'Levels'} required={false} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        {levels.map((level) => (
          <label
            key={level.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={(value || []).includes(level.id)}
              onChange={() => handleChange(level.id)}
              style={{ cursor: 'pointer' }}
            />
            <span>{`${level.sb} / ${level.bb}`}</span>
          </label>  
        ))}
      </div>
    </div>
  )
}

