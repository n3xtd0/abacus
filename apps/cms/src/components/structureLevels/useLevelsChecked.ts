import { Level } from '@/payload-types'
import { LevelTime } from './useLevelTimeValues'
import { useField } from '@payloadcms/ui'
import { useEffect } from 'react'

interface Props {
  breakDurations: LevelTime[]
  levelDurations: LevelTime[]
  path: string
  levels: Level[]
}

export const useLevelsChecked = ({ breakDurations, levelDurations, path, levels }: Props) => {
  const { value: levelsChecked, setValue: setLevelsChecked } = useField<Level['id'][]>({ path })
  
  useEffect(() => {
    const breakDurationIds = breakDurations.map((item) => item.levelId)
    const levelDurationIds = levelDurations.map((item) => item.levelId)
    const filteredLevelIds = levels
      .map((level) => level.id)
      .filter((id) => breakDurationIds.includes(id) || levelDurationIds.includes(id))

    const currentIds = levelsChecked || []
    const hasChanged =
      filteredLevelIds.length !== currentIds.length || filteredLevelIds.some((id, index) => id !== currentIds[index])

    if (hasChanged) {
      setLevelsChecked(filteredLevelIds)
    }
  }, [breakDurations, levelDurations, levels, levelsChecked, setLevelsChecked])

  return { levelsChecked, setLevelsChecked }
}
