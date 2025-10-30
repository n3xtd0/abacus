'use client'

import { useState, useEffect, useCallback } from 'react'
import useTimer from './useTimer'
import { Level, Structure } from '@/payload-types'

function timeFormat(num: number) {
  return num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
}

// Logo, nivel
// min:sec
// SB:xxxxx BB: xxxxxxx
// proximo nivel: SB/BB

const getLevelTime = (tourneyLevel: number) => {
  if (tourneyLevel < 10) return 18
  return 20
}

export default function Clock({
  levels,
  breaks,
}: {
  levels: Level[]
  breaks: Structure['breaks']
}) {
  const [tourneyLvl, setTourneyLvl] = useState(0)
  const [isPaused, setIsPaused] = useState(true)
  const [levelTime, setLevelTime] = useState(18)
  const { secs, mins, setMins, setSecs } = useTimer(levelTime, isPaused)

  const sb = levels[tourneyLvl].sb
  const bb = levels[tourneyLvl].bb

  useEffect(() => {
    if (mins === -1) goNextLvl()
  }, [mins])

  useEffect(() => {
    setMins(levelTime - 1)
    setSecs(59)
  }, [tourneyLvl])

  const goPrevLvl = useCallback(() => {
    if (tourneyLvl === 0) return

    const breakTime = breaks?.find((b) => b.after_level === tourneyLvl - 1)?.time ?? 0
    if (breakTime) {
      setMins(breakTime)
      setLevelTime(breakTime)
    } else {
      setTourneyLvl((prev) => prev - 1)
      setLevelTime(getLevelTime(tourneyLvl))
    }
  }, [tourneyLvl, setTourneyLvl, breaks])

  const goNextLvl = useCallback(() => {
    if (tourneyLvl === levels.length - 1) return

    const breakTime = breaks?.find((b) => b.after_level === tourneyLvl)?.time ?? 0
    if (breakTime) {
      setMins(breakTime)
      setLevelTime(breakTime)
    } else {
      setTourneyLvl((prev) => prev + 1)
      setLevelTime(getLevelTime(tourneyLvl))
    }
  }, [tourneyLvl, setTourneyLvl, breaks])

  return (
    <div className="App">
      <div className="clock">{`${timeFormat(mins)}:${timeFormat(secs)}`}</div>
      <div className="structure">
        <div className="flex-container">
          <div className="sb">
            <label>SB</label>
            <span>{sb ?? '--'}</span>
          </div>
          <div className="bb">
            <label>BB+ANTE</label>
            <span>{bb ?? '--'}</span>
          </div>
        </div>
      </div>
      <button className="prev" onClick={goPrevLvl}>
        ⏮︎
      </button>
      <button
        className="play"
        onClick={() => setIsPaused(false)}
        style={{ display: isPaused ? '' : 'none' }}
      >
        ⏵︎
      </button>
      <button
        className="pause"
        onClick={() => setIsPaused(true)}
        style={{ display: !isPaused ? '' : 'none' }}
      >
        ⏸︎
      </button>
      <button className="prev" onClick={goNextLvl}>
        ⏭︎
      </button>
    </div>
  )
}
