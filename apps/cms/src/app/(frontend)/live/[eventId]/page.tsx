import { getPayload } from 'payload'
import config from '@/payload.config'
import { Event, Level, LiveEvent, Tourney } from '@/payload-types'
import { LiveEventSupabase } from './LiveEventSSE'

export default async function LivePage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params
  const payload = await getPayload({ config })
  const event = await payload.findByID({ collection: 'event', id: eventId, depth: 1 })
  const tourney = await payload.findByID({ collection: 'tourney', id: (event.tourney as Tourney).id, depth: 3 })
  const liveEventResult = await payload.find({
    collection: 'live-event',
    where: {
      event: {
        equals: event.id,
      },
    },
    depth: 1,
    limit: 1,
  })
  const liveEvent = liveEventResult.docs[0]

  if (!liveEvent) {
    return <div>Live state has not been initialized for this event.</div>
  }

  const currentLevel =
    typeof liveEvent.current_level === 'number'
      ? await payload.findByID({ collection: 'level', id: liveEvent.current_level })
      : liveEvent.current_level
  const hydratedLiveEvent = {
    ...liveEvent,
    current_level: currentLevel as Level,
  }

  return (
    <LiveEventSupabase
      event={event as Event}
      initialLiveEvent={hydratedLiveEvent as LiveEvent}
      tourney={tourney}
    />
  )
}