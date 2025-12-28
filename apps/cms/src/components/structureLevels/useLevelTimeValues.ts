import { useMemo } from 'react'
import type { Level } from '@/payload-types'
import { useFormFields } from '@payloadcms/ui'
import { useLevelsChecked } from './useLevelsChecked'
import { fieldRawValuesToLevelTimeArray, keyWithoutLast } from './utils'

export interface LevelTime {
  levelId: Level['id']
  time: number
}

export const useLevelTimeValues = ({ path, levels }: { path: string; levels: Level[] }) => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => {
    return { fields, dispatch }
  })

  const handleBreakChange = (levelId: Level['id'], time: number) => {
    const existingBreakKey = Object.keys(fields).find(
      (key) => key.startsWith('breakDurations.') && key.endsWith('.level') && fields[key].value === levelId,
    )

    if (existingBreakKey) {
      if (time === 0) {
        const rowIndex = Number(existingBreakKey.split('.')[1])
        dispatch({ type: 'REMOVE_ROW', path: 'breakDurations', rowIndex })
      } else {
        dispatch({ type: 'UPDATE', path: `${keyWithoutLast(existingBreakKey)}.time`, value: time })
      }
    } else {
      dispatch({
        type: 'ADD_ROW',
        path: 'breakDurations',
        subFieldState: {
          level: { value: levelId },
          time: { value: time },
        },
      })
    }
  }

  const handleTimeChange = (levelId: Level['id'], time: number) => {
    const existingTimeKey = Object.keys(fields).find(
      (key) => key.startsWith('levelDurations.') && key.endsWith('.level') && fields[key].value === levelId,
    )
    if (existingTimeKey) {
      if (time === 0) {
        const rowIndex = Number(existingTimeKey.split('.')[1])
        dispatch({ type: 'REMOVE_ROW', path: 'levelDurations', rowIndex })
      } else {
        dispatch({ type: 'UPDATE', path: `${keyWithoutLast(existingTimeKey)}.time`, value: time })
      }
    } else {
      dispatch({
        type: 'ADD_ROW',
        path: 'levelDurations',
        subFieldState: {
          level: { value: levelId },
          time: { value: time },
        },
      })
    }
  }

  const { levelsChecked, setLevelsChecked } = useLevelsChecked({
    fields,
    path: path as string,
    levels,
  })

  const toggleLevel = (id: Level['id']) => {
    if (!!levelsChecked.includes(id)) {
      setLevelsChecked(levelsChecked.filter((item) => item !== id))
    } else {
      setLevelsChecked([...levelsChecked, id])
    }
  }

  const breakDurations = useMemo(() => fieldRawValuesToLevelTimeArray(fields, 'breakDurations'), [fields])
  const levelDurations = useMemo(() => fieldRawValuesToLevelTimeArray(fields, 'levelDurations'), [fields])

  return {
    breakDurations,
    levelDurations,
    levelsChecked,
    handleBreakChange,
    handleTimeChange,
    toggleLevel,
  }
}
