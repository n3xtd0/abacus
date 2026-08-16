'use client'

import { Event, Level, LiveEvent, Tourney } from '@/payload-types'
import { useEffect, useState } from 'react'
import Logo from '@/components/Logo'
import { calculatePrizePool, calculatePrizes, getRemainingSeconds } from '@/lib/liveEvent'
import TimeDisplay from '../../clock/[structure]/TimeDisplay'
import { useSupabaseRealtime } from './useSupabaseRealtime'

interface LiveEventSupabaseProps {
  event: Event
  initialLiveEvent: LiveEvent
  tourney: Tourney
  levels: Level[]
}

const formatNumber = (value: number) => new Intl.NumberFormat('es-ES').format(Math.round(value))
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)

export function LiveEventSupabase({ event, initialLiveEvent, tourney, levels }: LiveEventSupabaseProps) {
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
  const currentLevelIndex = resolvedLevel ? levels.findIndex(({ id }) => id === resolvedLevel.id) : -1
  const nextLevel = currentLevelIndex >= 0 ? levels[currentLevelIndex + 1] : undefined
  const totalChips =
    tourney.stack_buyin * liveEvent.num_entries +
    (tourney.stack_rebuy ?? 0) * (liveEvent.num_rebuys ?? 0) +
    (tourney.stack_addon ?? 0) * (liveEvent.num_addons ?? 0)
  const remainingPlayers = Math.max(0, liveEvent.num_entries - (liveEvent.num_eliminated ?? 0))
  const averageStack = remainingPlayers ? totalChips / remainingPlayers : 0
  const prizePool = calculatePrizePool({
    entries: liveEvent.num_entries,
    rebuys: liveEvent.num_rebuys,
    addons: liveEvent.num_addons,
    buyin: tourney.buyin,
    costRebuy: tourney.cost_rebuy,
    costAddon: tourney.cost_addon,
    deductRebuyCosts: tourney.deduct_rebuy_costs,
    deductions: {
      feeType: tourney.fee_type,
      feeValue: tourney.fee_value,
      poolType: tourney.pool_type,
      poolValue: tourney.pool_value,
      orgType: tourney.org_type,
      orgValue: tourney.org_value,
    },
  })
  const prizes = calculatePrizes({ players: liveEvent.num_entries, prizePool })
  const minuteDisplay = String(Math.floor(remainingTime / 60)).padStart(2, '0')
  const secondDisplay = String(remainingTime % 60).padStart(2, '0')

  return (
    <main className="grid min-h-dvh grid-cols-[minmax(13rem,20vw)_minmax(0,1fr)_minmax(13rem,22vw)] grid-rows-[auto_1fr] bg-[#121414] text-[#e8ebea] [font-family:var(--font-gotham),system-ui,sans-serif] max-[800px]:grid-cols-1 max-[800px]:grid-rows-[auto_auto_auto_auto]">
      <header className="col-span-full flex min-h-[3.6rem] items-center gap-8 border-b border-[#31413f] bg-[linear-gradient(100deg,#123535,#2f2222)] px-9 py-[0.65rem] max-[800px]:gap-5 max-[800px]:px-5 max-[800px]:py-3">
        <Logo className="h-7 w-auto max-[800px]:h-8" height={28} isGray />
        <span className="font-bold text-[0.85rem] tracking-[0.2em] text-[#64d5c8] after:mt-[0.35rem] after:block after:w-13 after:border-b-2 after:border-[#64d5c8] max-[800px]:text-[0.95rem]">
          LEVEL {currentLevelIndex >= 0 ? currentLevelIndex + 1 : '-'}
        </span>
      </header>

      <aside className="border-r border-[#31413f] px-5 py-[1.6rem] max-[800px]:row-start-3 max-[800px]:border-x-0 max-[800px]:border-b max-[800px]:px-5 max-[800px]:py-7">
        <h1 className="mb-5 text-[clamp(1.45rem,2.2vw,2.1rem)] font-bold tracking-[-0.025em] text-[#f2f2f2] max-[800px]:mb-6 max-[800px]:text-[2rem]">
          {tourney.name}
        </h1>
        <p className="m-0 flex items-baseline justify-between gap-3 border-b border-[#303333] py-3 text-[0.85rem] text-[#b9c2c0] max-[800px]:py-4 max-[800px]:text-[1.25rem]">
          Jugadores:
          <span className="text-[clamp(1.35rem,2.3vw,2.1rem)] font-bold text-[#55d6c8] max-[800px]:text-[1.8rem]">
            {remainingPlayers}/{liveEvent.num_entries}
          </span>
        </p>
        <p className="m-0 flex items-baseline justify-between gap-3 border-b border-[#303333] py-3 text-[0.85rem] text-[#b9c2c0] max-[800px]:py-4 max-[800px]:text-[1.25rem]">
          Rebuys:
          <span className="text-[clamp(1.35rem,2.3vw,2.1rem)] font-bold text-[#f0f2f1] max-[800px]:text-[1.8rem]">
            {liveEvent.num_rebuys ?? 0}
          </span>
        </p>
        <p className="m-0 flex items-baseline justify-between gap-3 border-b border-[#303333] py-3 text-[0.85rem] text-[#b9c2c0] max-[800px]:py-4 max-[800px]:text-[1.25rem]">
          Addons:
          <span className="text-[clamp(1.35rem,2.3vw,2.1rem)] font-bold text-[#f0f2f1] max-[800px]:text-[1.8rem]">
            {liveEvent.num_addons ?? 0}
          </span>
        </p>
        <p className="m-0 flex items-baseline justify-between gap-3 border-b border-[#303333] py-3 text-[0.85rem] text-[#b9c2c0] max-[800px]:py-4 max-[800px]:text-[1.25rem]">
          Media fichas:
          <span className="text-[clamp(1.35rem,2.3vw,2.1rem)] font-bold text-[#f0f2f1] max-[800px]:text-[1.8rem]">
            {formatNumber(averageStack)}
          </span>
        </p>
      </aside>

      <section
        className="flex min-w-0 flex-col items-center justify-center px-[2vw] pb-10 pt-6 max-[800px]:row-start-2 max-[800px]:min-h-0 max-[800px]:justify-start max-[800px]:px-5 max-[800px]:pb-8 max-[800px]:pt-8"
        aria-label={`${event.name} live clock`}
      >
        <div className="origin-center scale-[0.92] [--clock-font-size:16vw] max-[800px]:scale-100 max-[800px]:[--clock-font-size:35vw]">
          <TimeDisplay mins={minuteDisplay} secs={secondDisplay} fontSize="var(--clock-font-size)" />
        </div>
        <div className="mt-3 flex items-baseline justify-center gap-[clamp(0.7rem,1.5vw,1.5rem)] whitespace-nowrap text-[clamp(1.8rem,4vw,4rem)] max-[800px]:mt-5 max-[800px]:gap-3 max-[800px]:text-[1.75rem]">
          <span className="font-light text-[#c5ccca]">SB</span>
          <span className="font-bold text-[#f5f5f5]">{resolvedLevel?.sb ?? '-'}</span>
          <span className="font-light text-[#59706c]">|</span>
          <span className="font-light text-[#c5ccca]">BB/ANTE</span>
          <span className="font-bold text-[#f5f5f5]">{resolvedLevel?.bb ?? '-'}</span>
        </div>
        <div className="mt-[1.3rem] flex w-[min(100%,42rem)] justify-center gap-3 bg-[#343535] px-4 py-2 text-[clamp(0.85rem,1.4vw,1.2rem)] tracking-[0.12em] text-[#c9d0ce] max-[800px]:mt-5 max-[800px]:py-3 max-[800px]:text-[1.05rem]">
          <span>NEXT LEVEL:</span>
          <span className="font-bold tracking-normal text-[#f0f3f1]">{nextLevel ? `${nextLevel.sb}/${nextLevel.bb}` : '-'}</span>
        </div>
      </section>

      <aside className="border-l border-[#31413f] px-5 py-[1.6rem] max-[800px]:row-start-4 max-[800px]:border-x-0 max-[800px]:border-b max-[800px]:px-5 max-[800px]:py-7">
        <h2 className="mb-5 text-[clamp(1.45rem,2.2vw,2.1rem)] font-bold tracking-[-0.025em] text-[#f2f2f2] max-[800px]:mb-6 max-[800px]:text-[2rem]">
          PREMIOS
        </h2>
        {prizes.length ? (
          prizes.map((prize, index) => (
            <p
              className="m-0 flex items-baseline justify-between gap-3 border-b border-[#303333] py-3 text-[0.9rem] text-[#b9c2c0] max-[800px]:py-4 max-[800px]:text-[1.25rem]"
              key={index}
            >
              <span className={index === 0 ? 'text-[#55d6c8]' : undefined}>{index + 1}º</span>
              <span className="text-[clamp(1.05rem,1.75vw,1.55rem)] font-bold text-[#f0f2f1] max-[800px]:text-[1.4rem]">
                {formatCurrency(prize)}
              </span>
            </p>
          ))
        ) : (
          <p className="m-0 flex items-baseline justify-between gap-3 border-b border-[#303333] py-3 text-[0.9rem] text-[#b9c2c0] max-[800px]:py-4 max-[800px]:text-[1.25rem]">
            Los premios aparecerán cuando haya participantes.
          </p>
        )}
      </aside>
    </main>
  )
}
