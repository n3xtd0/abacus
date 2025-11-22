import type { Level } from '@/payload-types'
import { useFormFields } from '@payloadcms/ui'
import { useLevelsChecked } from './useLevelsChecked'
import { reconstructLevelTimes, updateLevelTimes } from './levelTime.utils'

export interface LevelTime {
  levelId: Level['id']
  time: number
}

export const useLevelTimeValues = ({ path, levels }: { path: string; levels: Level[] }) => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => {
    return { fields, dispatch }
  })

  const breakDurations: LevelTime[] = !fields ? [] : reconstructLevelTimes('breakDurations', fields)
  const levelDurations: LevelTime[] = !fields ? [] : reconstructLevelTimes('levelDurations', fields)

  const setBreakDurations = (breakDurations: LevelTime[]) => {
    const updatedFormState = updateLevelTimes('breakDurations', breakDurations, fields)
    dispatch({ type: 'UPDATE_MANY', formState: updatedFormState })
  }
  const setLevelDurations = (levelDurations: LevelTime[]) => {
    const updatedFormState = updateLevelTimes('levelDurations', levelDurations, fields)
    dispatch({ type: 'UPDATE_MANY', formState: updatedFormState })
  }
  const clearLevelDurations = (levelId: Level['id']) => {
    const updatedFormState = updateLevelTimes('breakDurations', breakDurations.filter((item) => item.levelId !== levelId), fields)
    const updatedFormState2 = updateLevelTimes('levelDurations', levelDurations.filter((item) => item.levelId !== levelId), updatedFormState)
    dispatch({ type: 'UPDATE_MANY', formState: updatedFormState2 })
  }

  const { levelsChecked, setLevelsChecked } = useLevelsChecked({
    breakDurations,
    levelDurations,
    path: path as string,
    levels,
  })

  const toggleLevel = (id: Level['id']) => {
    if (!!levelsChecked.includes(id)) {
      clearLevelDurations(id)
    } else {
      setLevelsChecked([...levelsChecked, id])
    }
  }

  return {
    breakDurations,
    levelDurations,
    levelsChecked,
    setBreakDurations,
    setLevelDurations,
    toggleLevel,
  }
}
