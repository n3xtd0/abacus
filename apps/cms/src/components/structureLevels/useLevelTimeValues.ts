import type { Level } from '@/payload-types'
import { useFormFields } from '@payloadcms/ui'
import { FormState } from 'payload'
import { useMemo } from 'react'

export interface LevelTimeEntry {
  level: Level['id']
  time: number
}

const reconstructLevelTimes = (basePath: string, rowCount: number, formData: FormState): LevelTimeEntry[] => {
  const result: LevelTimeEntry[] = []
  for (let i = 0; i < rowCount; i++) {
    const levelField = formData?.[`${basePath}.${i}.level`]
    const timeField = formData?.[`${basePath}.${i}.time`]

    const levelValue = levelField?.value
    const timeValue = timeField?.value

    if (levelValue !== undefined && levelValue !== null && timeValue !== undefined && timeValue !== null) {
      result.push({
        level: levelValue as Level['id'],
        time: Number(timeValue),
      })
    }
  }
  return result
}

export const useLevelTimeValues = () => {
  const { fields, dispatch } = useFormFields(([fields, dispatch]) => {
    return { fields, dispatch }
  })

  const breakTimesCount = fields ? Object.keys(fields).filter((key) => key.startsWith('breakTimes.')).length / 2 : 0
  const levelTimeCount = fields ? Object.keys(fields).filter((key) => key.startsWith('levelTime.')).length / 2 : 0

  const breakTimes = useMemo(() => {
    return !fields ? [] : reconstructLevelTimes('breakTimes', breakTimesCount, fields)
  }, [breakTimesCount, fields])
  
  const levelTime = useMemo(() => {
    return !fields ? [] : reconstructLevelTimes('levelTime', levelTimeCount, fields)
  }, [levelTimeCount, fields])

  return {
    breakTimes,
    levelTime,
    setBreakTimes: (value: LevelTimeEntry[]) =>{

      const basePath = 'breakTimes'
      const newFormState = { ...fields }
      value.forEach((item, index) => {
        newFormState[`${basePath}.${index}.level`] = { value: item.level }
        newFormState[`${basePath}.${index}.time`] = { value: item.time }
      })
      dispatch({
        type: 'UPDATE_MANY',
        formState: newFormState,
      })
    },
    setTimesValues: (value: LevelTimeEntry[]) => {
      const basePath = 'levelTime'
      const newFormState = { ...fields }
      value.forEach((item, index) => {
        newFormState[`${basePath}.${index}.level`] = { value: item.level }
        newFormState[`${basePath}.${index}.time`] = { value: item.time }
      })
      dispatch({
        type: 'UPDATE_MANY',
        formState: newFormState,
      })
    },
  }
  // const setBreakTimes = (value: LevelTimeEntry[]) => {
  //   dispatch({
  //     type: 'UPDATE',
  //     path: 'breakTimes',
  //     value: value,
  //   })
  // }
  // const setTimesValues = (value: LevelTimeEntry[]) => {
  //   dispatch({
  //     type: 'UPDATE',
  //     path: 'levelTime',
  //     value: value,
  //   })
  // }

  // const breakTimes = reconstructLevelTimes('breakTimes', breakTimesRowCount)
  // const timesValues = reconstructLevelTimes('levelTime', timesValuesRowCount)
}
