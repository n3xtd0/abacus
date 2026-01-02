'use client'

import { useState, useEffect, useCallback } from 'react'
import useTimer from './useTimer'
import { ClockLevel } from './types'

function timeFormat(num: number) {
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
}

export default function Clock({ levels }: { levels: ClockLevel[] }) {
  
  const [tourneyLvl, setTourneyLvl] = useState(0)
  const [isPaused, setIsPaused] = useState(true)
  const [levelTime, setLevelTime] = useState(levels[tourneyLvl].time)
  const { secs, mins, setMins, setSecs } = useTimer(levelTime, isPaused)

  const sb = levels[tourneyLvl].sb
  const bb = levels[tourneyLvl].bb

  const nextSb = levels[tourneyLvl + 1] ?.sb ?? '-'
  const nextBb = levels[tourneyLvl + 1] ?.bb ?? '-'

  useEffect(() => {
    if (mins === -1) goNextLvl()
  }, [mins])

  useEffect(() => {
    setMins(levelTime - 1)
    setSecs(59)
  }, [tourneyLvl])

  const goPrevLvl = useCallback(() => {
    if (tourneyLvl === 0) return

    setTourneyLvl((prev) => prev - 1)
    setLevelTime(levels[tourneyLvl-1].time)
  }, [tourneyLvl, setTourneyLvl, levels])

  const goNextLvl = useCallback(() => {
    if (tourneyLvl === levels.length - 1) return

    setTourneyLvl((prev) => prev + 1)
    setLevelTime(levels[tourneyLvl+1].time)
  }, [tourneyLvl, setTourneyLvl, levels])

  
// Logo, nivel
// min:sec
// SB:xxxxx BB: xxxxxxx
// proximo nivel: SB/BB

  return (
    <div className="App bg-red-500">
      <div className="text-9xl">{`${timeFormat(mins)}:${timeFormat(secs)}`}</div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="text-2xl">
            <label>SB: </label>
            <span className="text-4xl">{sb ?? '--'}</span>
          </div>
          <div className="text-2xl">
            <label>BB+ANTE: </label>
            <span className="text-4xl">{bb ?? '--'}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-2xl">
            <label>Next SB: </label>
            <span className="text-4xl">{nextSb ?? '--'}</span>
          </div>
          <div className="text-2xl">
            <label>Next BB+ANTE: </label>
            <span className="text-4xl">{nextBb ?? '--'}</span>
          </div>
        </div>
      </div>
      <button className="prev" onClick={goPrevLvl}>
        ⏮︎
      </button>
      <button className="play" onClick={() => setIsPaused(false)} style={{ display: isPaused ? '' : 'none' }}>
        ⏵︎
      </button>
      <button className="pause" onClick={() => setIsPaused(true)} style={{ display: !isPaused ? '' : 'none' }}>
        ⏸︎
      </button>
      <button className="prev" onClick={goNextLvl}>
        ⏭︎
      </button>
    </div>
  )
}
