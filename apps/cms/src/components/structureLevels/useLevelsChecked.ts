import { Level } from "@/payload-types"
import { LevelTimeEntry } from "./useLevelTimeValues"
import { useField } from "@payloadcms/ui"
import { useEffect, useMemo } from "react"

interface Props {
    breakTimes: LevelTimeEntry[]
    timesValues: LevelTimeEntry[]
    path: string
    levels: Level[]
}

export const useLevelsChecked = ({ breakTimes, timesValues, path, levels }: Props) => {
    const { value: levelsChecked, setValue: setLevelsChecked } = useField<Level['id'][]>({ path })

    const breakLevels = breakTimes.map((item) => item.level)
    const timeLevels = timesValues.map((item) => item.level)

    useEffect(() => {
      const filteredLevels = levels.filter((level) => breakLevels.includes(level.id) || timeLevels.includes(level.id))
      const newLevelIds = filteredLevels.map((level) => level.id)
      
      const currentIds = levelsChecked || []
      const hasChanged = newLevelIds.length !== currentIds.length || 
        newLevelIds.some((id, index) => id !== currentIds[index])
      
      if (hasChanged) {
        setLevelsChecked(newLevelIds)
      }
    }, [breakLevels, timeLevels, levels, levelsChecked, setLevelsChecked])

    return { levelsChecked, setLevelsChecked }
}