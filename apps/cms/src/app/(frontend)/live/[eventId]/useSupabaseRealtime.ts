import { useState, useMemo, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LiveEvent } from '@/payload-types'

export function useSupabaseRealtime(liveEventId: number, initialLiveEvent: LiveEvent) {
  const [liveEvent, setLiveEvent] = useState<LiveEvent>(initialLiveEvent)

  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      ),
    [],
  )

  useEffect(() => {
    const channel = supabase
      .channel(`live-event-${liveEventId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_event',
          filter: `id=eq.${liveEventId}`,
        },
        (payload) => {
          setLiveEvent((previousLiveEvent) => ({
            ...previousLiveEvent,
            ...(payload.new as Partial<LiveEvent>),
            current_level: payload.new.current_level_id ?? previousLiveEvent.current_level,
          }))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [liveEventId, supabase])

  return { liveEvent }
}
