'use client'

import { useField, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import { getLevelDurationSeconds, getRemainingSeconds, relatedID } from '@/lib/liveEvent'
import { getID, useLiveEventStructure } from './useLiveEventStructure'

export const useLiveEventClockControls = (path: unknown) => {
  const { fields } = useFormFields(([fields]) => ({ fields }))
  const [now, setNow] = useState(Date.now())
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string>()
  const timePath = typeof path === 'string' ? path : 'current_time'
  const { setValue: setCurrentTime } = useField<number>({ path: timePath })
  const { setValue: setCurrentLevel } = useField<number>({ path: 'current_level' })
  const { setValue: setStatus } = useField<'paused' | 'running'>({ path: 'status' })
  const { setValue: setClockStartedAt } = useField<string | null>({ path: 'clock_started_at' })
  const eventID = getID(fields.event?.value)
  const currentLevelID = getID(fields.current_level?.value)
  const currentTime = Number(fields[timePath]?.value ?? 0)
  const status = fields.status?.value === 'running' ? 'running' : 'paused'
  const clockStartedAt = typeof fields.clock_started_at?.value === 'string' ? fields.clock_started_at.value : null
  const { structure, levels } = useLiveEventStructure(eventID)

  useEffect(() => {
    if (status !== 'running') return

    setNow(Date.now())
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [status, currentTime, clockStartedAt])

  const currentIndex = levels.findIndex((level) => level.id === currentLevelID)
  const remainingTime = getRemainingSeconds({ currentTime, clockStartedAt, status, now })
  const currentLevel = levels[currentIndex]

  const update = (fieldPath: string, value: unknown) => {
    if (fieldPath === timePath) setCurrentTime(value as number)
    if (fieldPath === 'current_level') setCurrentLevel(value as number)
    if (fieldPath === 'status') setStatus(value as 'paused' | 'running')
    if (fieldPath === 'clock_started_at') setClockStartedAt(value as string | null)
  }

  const saveLiveState = async (data: Record<string, unknown>) => {
    const documentID = window.location.pathname.split('/').at(-1)
    if (!documentID || documentID === 'create') return

    setIsSaving(true)
    setSaveError(undefined)
    try {
      const response = await fetch(`/api/live-event/${documentID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Unable to save the live event.')
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save the live event.')
    } finally {
      setIsSaving(false)
    }
  }

  const selectLevel = async (index: number) => {
    const level = levels[index]
    if (!level || !structure) return

    const nextTime = getLevelDurationSeconds(structure, relatedID(level))
    const nextStartedAt = status === 'running' ? new Date().toISOString() : null
    update('current_level', level.id)
    update(timePath, nextTime)
    if (nextStartedAt) update('clock_started_at', nextStartedAt)
    await saveLiveState({
      current_level: level.id,
      current_time: nextTime,
      ...(nextStartedAt ? { clock_started_at: nextStartedAt } : {}),
    })
  }

  const toggleClock = async () => {
    if (status === 'running') {
      update(timePath, remainingTime)
      update('status', 'paused')
      update('clock_started_at', null)
      await saveLiveState({ current_time: remainingTime, status: 'paused', clock_started_at: null })
      return
    }

    const nextStartedAt = new Date().toISOString()
    update('status', 'running')
    update('clock_started_at', nextStartedAt)
    await saveLiveState({ status: 'running', clock_started_at: nextStartedAt })
  }

  return {
    canGoNext: currentIndex >= 0 && currentIndex < levels.length - 1,
    currentIndex,
    currentLevel,
    isSaving,
    remainingTime,
    saveError,
    selectLevel,
    status,
    toggleClock,
  }
}
