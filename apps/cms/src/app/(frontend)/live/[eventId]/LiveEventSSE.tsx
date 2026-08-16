'use client'

import { Event, Level, LiveEvent, Tourney } from '@/payload-types'
import { useEffect, useState } from 'react'
import { getRemainingSeconds } from '@/lib/liveEvent'
import { useSupabaseRealtime } from './useSupabaseRealtime'

interface LiveEventSupabaseProps {
  event: Event
  initialLiveEvent: LiveEvent
  tourney: Tourney
}

const formatTime = (totalSeconds: number) =>
  `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`

export function LiveEventSupabase({ event, initialLiveEvent, tourney }: LiveEventSupabaseProps) {
  const { liveEvent } = useSupabaseRealtime(initialLiveEvent.id, initialLiveEvent)
  const [now, setNow] = useState(Date.now())
  const [resolvedLevel, setResolvedLevel] = useState<Level>()

  const currentLevelID =
    typeof liveEvent.current_level === 'number'
      ? liveEvent.current_level
      : liveEvent.current_level && typeof liveEvent.current_level === 'object'
        ? liveEvent.current_level.id
        : undefined

  useEffect(() => {
    if (liveEvent.status !== 'running') return

    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [liveEvent.status, liveEvent.current_time, liveEvent.clock_started_at])

  useEffect(() => {
    if (liveEvent.current_level && typeof liveEvent.current_level === 'object' && 'sb' in liveEvent.current_level) {
      setResolvedLevel(liveEvent.current_level as Level)
      return
    }
    if (!currentLevelID) {
      setResolvedLevel(undefined)
      return
    }

    void fetch(`/api/level?where[id][equals]=${currentLevelID}&limit=1&depth=0`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load the current level.')
        return (await response.json()) as { docs: Level[] }
      })
      .then(({ docs }) => setResolvedLevel(docs[0]))
      .catch(() => setResolvedLevel(undefined))
  }, [currentLevelID, liveEvent.current_level])

  const remainingTime = getRemainingSeconds({
    currentTime: liveEvent.current_time,
    clockStartedAt: liveEvent.clock_started_at,
    status: liveEvent.status,
    now,
  })
  const levelLabel = resolvedLevel ? `${resolvedLevel.sb} / ${resolvedLevel.bb}` : '-'

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
        <h2 style={{ marginTop: 0, fontSize: '24px' }}>Inscritos: {liveEvent.num_entries}</h2>
        <h2 style={{ marginTop: 0, fontSize: '24px' }}>Rebuys: {liveEvent.num_rebuys}</h2>
        <h2 style={{ marginTop: 0, fontSize: '24px' }}>Add-ons: {liveEvent.num_addons}</h2>
        <h2 style={{ marginTop: 0, fontSize: '24px' }}>
          Media fichas:{' '}
          {tourney.stack_buyin * liveEvent.num_entries +
            (tourney.stack_rebuy ?? 0) * (liveEvent.num_rebuys ?? 0) +
            (tourney.stack_addon ?? 0) * (liveEvent.num_addons ?? 0)}
        </h2>
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
        <h2 style={{ marginTop: 0, fontSize: '20px' }}>🏆 Tournament: {event.name}</h2>
        <h2 style={{ marginTop: 0, fontSize: '20px' }}>
          Level: {levelLabel} · {formatTime(remainingTime)}{' '}
          ({liveEvent.status})
        </h2>
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
