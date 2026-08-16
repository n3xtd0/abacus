import type { Level, Structure } from '@/payload-types'

type Related<T> = number | T

export const relatedID = <T extends { id: number }>(value: Related<T>) => (typeof value === 'number' ? value : value.id)

export const sortLevelsByBlinds = <T extends Pick<Level, 'sb' | 'bb'>>(levels: T[]) =>
  [...levels].sort((left, right) => left.bb - right.bb || left.sb - right.sb)

export const getLevelDurationSeconds = (structure: Structure, levelID: number) => {
  const configuredDuration = structure.levelDurations?.find(({ level }) => relatedID(level as Related<Level>) === levelID)

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

type DeductionType = 'fixed' | 'percentage' | null | undefined

export type PrizeDeductions = {
  feeType?: DeductionType
  feeValue?: number | null
  poolType?: DeductionType
  poolValue?: number | null
  orgType?: DeductionType
  orgValue?: number | null
}

const getDeductionAmount = (amount: number, type: DeductionType, value: number | null | undefined) => {
  if (!value || !type) return 0
  return type === 'percentage' ? (amount * value) / 100 : value
}

export const getNetContribution = (amount: number, deductions: PrizeDeductions) =>
  Math.max(
    0,
    amount -
      getDeductionAmount(amount, deductions.feeType, deductions.feeValue) -
      getDeductionAmount(amount, deductions.poolType, deductions.poolValue) -
      getDeductionAmount(amount, deductions.orgType, deductions.orgValue),
  )

export const getPlayersInTheMoney = (players: number, percentage?: number | null) => {
  const playerCount = Math.max(0, Math.floor(players))
  if (!playerCount) return 0

  const places =
    percentage != null
      ? Math.round((playerCount * percentage) / 100)
      : playerCount < 14
        ? Math.round(playerCount / 3)
        : playerCount < 20
          ? Math.round(playerCount / 4)
          : playerCount < 24
            ? playerCount / 5 + 1
            : playerCount / 6 + 1

  return Math.min(playerCount, Math.max(1, Math.floor(places)))
}

export const calculatePrizes = ({
  players,
  prizePool,
  playersInTheMoney,
  percentage,
}: {
  players: number
  prizePool: number
  playersInTheMoney?: number | null
  percentage?: number | null
}) => {
  const playerCount = Math.max(0, Math.floor(players))
  const places =
    playersInTheMoney == null
      ? getPlayersInTheMoney(playerCount, percentage)
      : Math.min(playerCount, Math.max(1, Math.floor(playersInTheMoney)))
  if (!places || prizePool <= 0) return []

  const relativeValues = [100]
  for (let position = 2; position <= places; position++) {
    relativeValues.push((relativeValues[position - 2] * (position + 2)) / (position + 4))
  }
  const totalRelative = relativeValues.reduce((total, value) => total + value, 0)
  const poolInCents = Math.round(prizePool * 100)
  const prizes = relativeValues.map((value) => Math.round((value / totalRelative) * poolInCents))
  const roundingDifference = poolInCents - prizes.reduce((total, prize) => total + prize, 0)

  prizes[0] += roundingDifference
  return prizes.map((prize) => prize / 100)
}

export const calculatePrizePool = ({
  entries,
  rebuys = 0,
  addons = 0,
  buyin,
  costRebuy,
  costAddon,
  deductRebuyCosts = false,
  deductions,
}: {
  entries: number
  rebuys?: number | null
  addons?: number | null
  buyin: number
  costRebuy?: number | null
  costAddon?: number | null
  deductRebuyCosts?: boolean | null
  deductions: PrizeDeductions
}) =>
  Math.max(0, entries) * getNetContribution(buyin, deductions) +
  Math.max(0, rebuys ?? 0) * (deductRebuyCosts ? getNetContribution(costRebuy ?? 0, deductions) : (costRebuy ?? 0)) +
  Math.max(0, addons ?? 0) * (costAddon ?? 0)
