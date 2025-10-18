import { getPayload } from 'payload'
import config from '@/payload.config'
import { Tourney } from '@/payload-types'
import { LiveEventSupabase } from './LiveEventSSE'

export default async function LivePage({ params }: { params: { eventId: string } }) {
  const { eventId } = await params
  const payload = await getPayload({ config })
  const event = await payload.findByID({ collection: 'event', id: eventId, depth: 3 })
  const tourney = await payload.findByID({ collection: 'tourney', id: (event.tourney as Tourney).id, depth: 3 })
  
  return <LiveEventSupabase initialEvent={event} tourney={tourney} eventId={eventId} />
}