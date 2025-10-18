'use client'

import { Event, Tourney } from '@/payload-types'
import { useSupabaseRealtime } from './useSupabaseRealtime'

interface LiveEventSupabaseProps {
  initialEvent: Event
  tourney: Tourney
  eventId: string
}

export function LiveEventSupabase({ initialEvent, tourney, eventId }: LiveEventSupabaseProps) {
  const { event } = useSupabaseRealtime(eventId, initialEvent)

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div
        style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: 8,
          marginBottom: '20px',
          border: '2px solid #e0e0e0',
          color: 'black',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '24px' }}>Inscritos: {event.num_entries}</h2>
        <h2 style={{ marginTop: 0, fontSize: '24px' }}>Rebuys: {event.num_rebuys}</h2>

        <h2 style={{ marginTop: 0, fontSize: '24px' }}>Restantes: {event.num_entries}</h2>
        <h2 style={{ marginTop: 0, fontSize: '24px' }}>Media fichas: {tourney.stack_buyin * event.num_entries + (tourney.stack_rebuy ?? 0) * (event.num_rebuys ?? 0)}</h2>
      </div>

      <div
        style={{
          background: '#e3f2fd',
          padding: '20px',
          borderRadius: 8,
          border: '2px solid #90caf9',
          color: 'black',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '20px' }}>🏆 Tournament: {tourney.name}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          {tourney.format && (
            <div>
              <strong>🎮 Format:</strong> {tourney.format}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
