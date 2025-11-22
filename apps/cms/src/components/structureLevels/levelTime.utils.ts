import { Level } from '@/payload-types'
import { LevelTime } from './useLevelTimeValues'
import { FormState } from 'payload'

export const reconstructLevelTimes = (basePath: string, formData: FormState): LevelTime[] => {
  const rowCount = formData ? Object.keys(formData).filter((key) => key.startsWith(`${basePath}.`)).length / 2 : 0

  const result: LevelTime[] = []
  for (let i = 0; i < rowCount; i++) {
    const levelField = formData?.[`${basePath}.${i}.level`]
    const timeField = formData?.[`${basePath}.${i}.time`]

    const levelValue = levelField?.value
    const timeValue = timeField?.value

    if (levelValue !== undefined && levelValue !== null && timeValue !== undefined && timeValue !== null) {
      result.push({
        levelId: levelValue as Level['id'],
        time: Number(timeValue),
      })
    }
  }
  return result
}

const deleteEveryKeyStartingWith = (basePath: string, formData: FormState) => {
  const newFormState = { ...formData }
  Object.keys(newFormState).forEach((key) => {
    if (key.startsWith(basePath)) {
      delete newFormState[key]
    }
  })
  return newFormState
}

export const updateLevelTimes = (basePath: string, levelTimes: LevelTime[], formData: FormState) => {
  const newFormState = deleteEveryKeyStartingWith(basePath, formData)
  levelTimes.forEach((entry, index) => {
    newFormState[`${basePath}.${index}.level`] = { value: entry.levelId }
    newFormState[`${basePath}.${index}.time`] = { value: entry.time }
  })
  return newFormState
}