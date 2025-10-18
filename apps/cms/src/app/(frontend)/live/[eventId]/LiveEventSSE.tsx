'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Event, Tourney } from '@/payload-types'

interface LiveEventSupabaseProps {
  initialEvent: Event
  tourney: Tourney
  eventId: string
}

export function LiveEventSupabase({
  initialEvent,
  tourney,
  eventId,
}: LiveEventSupabaseProps) {
  const [event, setEvent] = useState(initialEvent)
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      ),
    [],
  )

  useEffect(() => {
    console.log('🔄 Connecting to Supabase Realtime for event:', eventId)
    setStatus('connecting')

    const channel = supabase
      .channel(`event-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'event',
          filter: `id=eq.${eventId}`,
        },
        async (payload) => {
          console.log('📨 Supabase change detected:', payload)

          setEvent(payload.new as unknown as Event)
         
        },
      )
      .subscribe((status) => {
        console.log('Supabase subscription status:', status)
        if (status === 'SUBSCRIBED') {
          setStatus('connected')
        } else if (status === 'CLOSED') {
          setStatus('disconnected')
        }
      })

    return () => {
      console.log('🛑 Unsubscribing from Supabase channels')
      supabase.removeChannel(channel)
    }
  }, [eventId, supabase])

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
        <h2 style={{ marginTop: 0, fontSize: '24px' }}>{event.name}</h2>
        {event.name_short && (
          <p style={{ color: '#666', fontSize: '14px' }}>({event.name_short})</p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          <div>
            <strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}
          </div>
          <div>
            <strong>🕒 Time:</strong> {event.time}
          </div>
          <div>
            <strong>👥 Max Players:</strong> {event.max_players}
          </div>
          <div>
            <strong>🎫 Entries:</strong> {event.num_entries}
          </div>
        </div>
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
