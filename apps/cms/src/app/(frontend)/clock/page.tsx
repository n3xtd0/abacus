import { getPayload } from 'payload'
import config from '@/payload.config'
import Clock from './Clock'
import { Level } from '@/payload-types'

async function Page() {
  const payload = await getPayload({ config })
  const structureDoc = await payload.find({
    collection: 'structure',
    where: {
      name: {
        equals: 'inauguracion',
      },
    },
  })

  const structure = structureDoc.docs[0]
  const sortedLevels = structure.levels.filter((level): level is Level => typeof level === 'object').sort((a, b) => a.bb - b.bb)

  return (
    <div className="App">
      <Clock levels={sortedLevels} breaks={structure.breaks} />
    </div>
  )
}

export default Page
