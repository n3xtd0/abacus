import { useState, useMemo, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Event } from '@/payload-types'

export function useSupabaseRealtime(eventId: string, initialEvent: Event) {
  const [event, setEvent] = useState<Event>(initialEvent)

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
          console.log('🟢 Supabase connected')
        } else if (status === 'CLOSED') {
          console.log('🔴 Supabase disconnected')
        }
      })

    return () => {
      console.log('🛑 Unsubscribing from Supabase channels')
      supabase.removeChannel(channel)
    }
  }, [eventId, supabase])

  return { event }
}
