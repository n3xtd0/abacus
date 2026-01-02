import { getPayload } from 'payload'
import config from '@/payload.config'
import Clock from './Clock'
import { Level } from '@/payload-types'
import { mixLevelWithBreakDurations } from './utils'

async function Page() {
  const payload = await getPayload({ config })
  const structureDoc = await payload.find({
    collection: 'structure',
    where: { name: { equals: 'test-structure' } },
  })

  const structure = structureDoc.docs[0]

  if (!structure) return <div>No structure found</div>
  const sortedLevels = structure.levels.filter((level): level is Level => typeof level === 'object').sort((a, b) => a.bb - b.bb)

  const clockLevelsWithBreaks = mixLevelWithBreakDurations(sortedLevels, structure.breakDurations)
  
  const clockLevels = clockLevelsWithBreaks.map((level) => {
    const levelDuration = structure.levelDurations?.find((duration) => level.id && duration.level.id === level.id)
    return ({ sb: level.sb, bb: level.bb, time: levelDuration?.time ?? level.time ?? structure.mainTime })
  })

  return (
    <div className="App">
      <Clock levels={clockLevels} />
    </div>
  )
}

export default Page
