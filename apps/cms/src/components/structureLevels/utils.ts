import { FormState } from 'payload'
import { LevelTime } from './useLevelTimeValues'

export const fieldRawValuesToLevelTimeArray = (fields: FormState, basePath: string) => {
  const basePathKeys = [
    ...removeRepeatedKeys(
      Object.keys(fields)
        .filter((key) => key.startsWith(`${basePath}.`))
        .map(keyWithoutLast),
    ),
  ]
  return basePathKeys.reduce((acc: LevelTime[], key) => {
    const levelId = fields[`${key}.level`].value as number
    const time = fields[`${key}.time`].value as number
    return acc.find((lvlTime) => lvlTime.levelId === levelId) ? acc : [...acc, { levelId, time }]
  }, [])
}

export const removeRepeatedKeys = (keys: string[]) => {
  return [...new Set(keys)]
}
export const keyWithoutLast = (key: string) => key.split('.').slice(0, -1).join('.')
/* ​
breakDurations: { value: 2, initialValue: 2, disableFormData: true, … }
​​
"breakDurations.0.id": { value: "690f84ad0d88ef5700c82cb4", initialValue: "690f84ad0d88ef5700c82cb4", lastRenderedPath: "breakDurations.0.id", … }
"breakDurations.0.level": { value: 3, initialValue: 3, lastRenderedPath: "breakDurations.0.level", … }
"breakDurations.0.time": { value: 20, initialValue: 20, lastRenderedPath: "breakDurations.0.time", … }
"breakDurations.1.id": { value: "69120e0143256a44f8769d6b", initialValue: "69120e0143256a44f8769d6b", lastRenderedPath: "breakDurations.1.id", … }
"breakDurations.1.level": { value: 1, initialValue: 1, lastRenderedPath: "breakDurations.1.level", … }
"breakDurations.1.time": { value: 12, initialValue: 12, lastRenderedPath: "breakDurations.1.time", … }
​
createdAt: { value: "2025-11-08T17:22:19.033Z", initialValue: "2025-11-08T17:22:19.033Z", lastRenderedPath: "createdAt", … }
levelDurations: { value: 2, initialValue: 2, disableFormData: true, … }
"levelDurations.0.id": { value: "690f7c479ea675482423e744", initialValue: "690f7c479ea675482423e744", lastRenderedPath: "levelDurations.0.id", … }
"levelDurations.0.level": { value: 3, initialValue: 3, lastRenderedPath: "levelDurations.0.level", … }
"levelDurations.0.time": { value: 25, initialValue: 25, lastRenderedPath: "levelDurations.0.time", … }
"levelDurations.1.id": { value: "690f897d0d88ef5700c82cb6", initialValue: "690f897d0d88ef5700c82cb6", lastRenderedPath: "levelDurations.1.id", … }
"levelDurations.1.level": { value: 3, initialValue: 3, lastRenderedPath: "levelDurations.1.level", … }
"levelDurations.1.time": { value: 25, initialValue: 25, lastRenderedPath: "levelDurations.1.time", … }
​
levels: { lastRenderedPath: "levels", valid: true, passesCondition: true, … }
mainTime: { value: 18, initialValue: 18, lastRenderedPath: "mainTime", … }
name: { value: "test", initialValue: "test", lastRenderedPath: "name", … }
updatedAt: { value: "2025-11-22T15:17:00.483Z", initialValue: "2025-11-22T15:17:00.483Z", lastRenderedPath: "updatedAt", … }
​*/
