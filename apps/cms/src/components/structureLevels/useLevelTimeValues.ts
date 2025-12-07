import type { Level } from '@/payload-types'
import { useFormFields } from '@payloadcms/ui'
import { useLevelsChecked } from './useLevelsChecked'
// import { buildLevelTimes, updateFormState } from './levelTime.utils'

export interface LevelTime {
  levelId: Level['id']
  time: number
}

export const useLevelTimeValues = ({ path, levels }: { path: string; levels: Level[] }) => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => {
    return { fields, dispatch }
  })
  console.log('🚀 ~ useLevelTimeValues ~ fields:', fields)

  const handleBreakChange = (levelId: Level['id'], time: number) => {
    // const currentBreaks = buildLevelTimes('breakDurations', fields) || []
    const existingBreakKey = Object.keys(fields).find(
      (key) => key.startsWith('breakDurations.') && key.endsWith('.level') && fields[key].value === levelId,
    )

    if (existingBreakKey) {
      dispatch({ type: 'UPDATE', path: `${existingBreakKey}.time`, value: time })
    } else {
      dispatch({
        type: 'UPDATE',
        path: `breakDurations`,
        value: [...(fields.breakDurations as { level: Level['id']; time: number }[]), { level: levelId, time }],
      })
    }
  
    // dispatch({ type: 'UPDATE', path: `${path}.breakDurations.${existingBreakKey}.time`, value: time })
  }

  const handleTimeChange = (levelId: Level['id'], time: number) => {
    const existingTimeKey = Object.keys(fields).find(
      (key) => key.startsWith('levelDurations.') && key.endsWith('.level') && fields[key].value === levelId,
    )
    if (existingTimeKey) {
      dispatch({ type: 'UPDATE', path: `${existingTimeKey}.time`, value: time })
    }
    else {
      dispatch({
        type: 'UPDATE',
        path: `levelDurations`,
        value: [...(fields.levelDurations as { level: Level['id']; time: number }[]), { level: levelId, time }],
      })
    }
    // dispatch({ type: 'UPDATE', path: `${path}.levelDurations.${existingTimeKey}.time`, value: time })
  }


  // const breakDurations: LevelTime[] = !fields ? [] : buildLevelTimes('breakDurations', fields)
  // const levelDurations: LevelTime[] = !fields ? [] : buildLevelTimes('levelDurations', fields)

  // const setBreakDurations = (breakDurations: LevelTime[]) => {
  //   const updatedFormState = updateLevelTimes('breakDurations', breakDurations, fields)
  //   dispatch({ type: 'UPDATE_MANY', formState: updatedFormState })
  // }
  // const setLevelDurations = (levelDurations: LevelTime[]) => {
  //   const updatedFormState = updateLevelTimes('levelDurations', levelDurations, fields)
  //   dispatch({ type: 'UPDATE_MANY', formState: updatedFormState })
  // }
  // const clearLevelDurations = (levelId: Level['id']) => {
  //   // Read fresh values from fields to avoid stale closure values
  //   const currentBreakDurations = buildLevelTimes('breakDurations', fields)
  //   const currentLevelDurations = buildLevelTimes('levelDurations', fields)

  //   const updatedFormState = updateLevelTimes('breakDurations', currentBreakDurations.filter((item) => item.levelId !== levelId), fields)
  //   const updatedFormState2 = updateLevelTimes('levelDurations', currentLevelDurations.filter((item) => item.levelId !== levelId), updatedFormState)
  //   console.log("🚀 ~ clearLevelDurations ~ updatedFormState2:", updatedFormState2)
  //   dispatch({ type: 'UPDATE_MANY', formState: updatedFormState2 })
  // }

  const { levelsChecked, setLevelsChecked } = useLevelsChecked({
    fields,
    path: path as string,
    levels,
  })

  const toggleLevel = (id: Level['id']) => {
    if (!!levelsChecked.includes(id)) {
      // clearLevelDurations(id)
      setLevelsChecked(levelsChecked.filter((item) => item !== id))
    } else {
      setLevelsChecked([...levelsChecked, id])
    }
  }

  return {
    breakDurations: fields?.breakDurations as { level: Level['id']; time: number }[],
    levelDurations: fields?.levelDurations as { level: Level['id']; time: number }[],
    levelsChecked,
    handleBreakChange,
    handleTimeChange,
    toggleLevel,
  }
}
