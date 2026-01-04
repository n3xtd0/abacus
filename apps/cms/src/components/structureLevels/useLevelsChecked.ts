import { Level } from '@/payload-types'
import { useField } from '@payloadcms/ui'
import { useEffect } from 'react'
import { buildLevelTimes } from './levelTime.utils'
import { FormState } from 'payload'

interface Props {
  fields: FormState
  path: string
  levels: Level[]
}
export const useLevelsChecked = ({ fields, path, levels }: Props) => {
  const { value: levelsChecked = [], setValue: setLevelsChecked } = useField<Level['id'][]>({ path })
  
  useEffect(() => {
    const breakDurationIds = buildLevelTimes('breakDurations', fields).map((item) => item.levelId)
    const levelDurationIds = buildLevelTimes('levelDurations', fields).map((item) => item.levelId)
    const filteredLevelIds = levels
      .map((level) => level.id)
      .filter((id) => breakDurationIds.includes(id) || levelDurationIds.includes(id))

    setLevelsChecked([...new Set([...levelsChecked, ...filteredLevelIds])])
  }, [levels])

  return { levelsChecked, setLevelsChecked }
}
