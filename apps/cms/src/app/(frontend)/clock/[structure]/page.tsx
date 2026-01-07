import { getPayload } from 'payload'
import config from '@/payload.config'
import Clock from './Clock'
import { Level } from '@/payload-types'
import { mixLevelWithBreakDurations } from './utils'
import { PopulatedStructure } from './types'

async function Page({ params }: { params: Promise<{ structure: string }> }) {
  const { structure: structureName } = await params

  const payload = await getPayload({ config })
  const structureDoc = await payload.find({
    collection: 'structure',
    where: { name: { equals: structureName } },
  })

  const structure = structureDoc.docs[0] as PopulatedStructure

  if (!structure) return <div>No structure found</div>
  const sortedLevels = structure.levels.filter((level): level is Level => typeof level === 'object').sort((a, b) => a.bb - b.bb)

  const clockLevelsWithBreaks = mixLevelWithBreakDurations(sortedLevels, structure.breakDurations)

  const clockLevels = clockLevelsWithBreaks.map((level) => {
    // Check if level is a Level (has id) or a Break (no id)
    const isLevel = 'id' in level && typeof level.id === 'number'
    const levelDuration = isLevel
      ? structure.levelDurations?.find((duration) => {
          const durationLevelId = typeof duration.level === 'object' ? duration.level.id : duration.level
          return durationLevelId === level.id
        })
      : undefined
    return {
      sb: level.sb,
      bb: level.bb,
      time: levelDuration?.time ?? ('time' in level ? level.time : structure.mainTime),
    }
  })

  return <Clock levels={clockLevels} />
}

export default Page
