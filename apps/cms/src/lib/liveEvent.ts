import type { Level, Structure } from '@/payload-types'

type Related<T> = number | T

export const relatedID = <T extends { id: number }>(value: Related<T>) =>
  typeof value === 'number' ? value : value.id

export const getLevelDurationSeconds = (structure: Structure, levelID: number) => {
  const configuredDuration = structure.levelDurations?.find(
    ({ level }) => relatedID(level as Related<Level>) === levelID,
  )

  return (configuredDuration?.time ?? structure.mainTime) * 60
}

export const getRemainingSeconds = ({
  currentTime,
  clockStartedAt,
  status,
  now = Date.now(),
}: {
  currentTime: number
  clockStartedAt?: string | null
  status: 'paused' | 'running'
  now?: number
}) => {
  if (status !== 'running' || !clockStartedAt) return Math.max(0, currentTime)

  const elapsedSeconds = Math.floor((now - new Date(clockStartedAt).getTime()) / 1000)
  return Math.max(0, currentTime - elapsedSeconds)
}
