'use client'

import { useState, useEffect, useCallback } from 'react'
import useTimer from './useTimer'
import { ClockLevel } from './types'
import Logo from '@/components/Logo'
import TimeDisplay from './TimeDisplay'

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
    setLevelTime(levels[tourneyLvl - 1].time)
  }, [tourneyLvl, setTourneyLvl, levels])

  const goNextLvl = useCallback(() => {
    if (tourneyLvl === levels.length - 1) return

    setTourneyLvl((prev) => prev + 1)
    setLevelTime(levels[tourneyLvl + 1].time)
  }, [tourneyLvl, setTourneyLvl, levels])

  const currentLevel = levels[tourneyLvl]
  const nextLevel = levels[tourneyLvl + 1]

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col">
      {/* Header bar with level and logo */}
      <div
        className="flex items-center justify-between px-[3vw] py-[1.5vh] bg-[#2a2a2a]"
        style={{ background: 'var(--gradient-rainbow)' }}
      >
        <div className="flex items-baseline" style={{ fontFamily: 'var(--font-gotham)' }}>
          <span className="text-[5vh] font-light text-white/90 tracking-wide">LEVEL</span>
          <span className="text-[5vh] font-bold text-white ml-[0.5vw]">{tourneyLvl + 1}</span>
        </div>
        <Logo className="h-[3vh] w-auto" height={30} isGray />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Flip Clock */}
        <TimeDisplay mins={timeFormat(mins)} secs={timeFormat(secs)} fontSize="37vh" />

        {/* Blinds Info - horizontal layout */}
        <div className="flex items-baseline justify-center gap-[2vw] mt-[4vh]" style={{ fontFamily: 'var(--font-gotham)' }}>
          <div className="flex items-baseline gap-[0.5vw]" style={{ fontFamily: 'var(--font-gotham)' }}>
            <span className="text-[10vh] text-white/80 font-light">SB</span>
            <span className="text-[10vh] text-white font-bold">{currentLevel?.sb ?? '-'}</span>
          </div>

          <span className="text-[6vh] text-white/50 font-light">|</span>

          <div className="flex items-baseline gap-[0.5vw]" style={{ fontFamily: 'var(--font-gotham)' }}>
            <span className="text-[10vh] text-white/80 font-light">BB/ANTE</span>
            <span className="text-[10vh] text-white font-bold">{currentLevel?.bb ?? '-'}</span>
          </div>
        </div>

        {/* Next Level */}
        <div
          className="flex justify-center mt-[3vh] text-white/70 w-full self-stretch py-[2vh]"
          style={{ fontFamily: 'var(--font-gotham)', background: 'var(--gradient-gray)' }}
        >
          <span className="text-[5vh] font-light tracking-wide">NEXT LEVEL:</span>
          <span className="text-[7vh] font-medium ml-[1vw]">{nextLevel ? `${nextLevel.sb}/${nextLevel.bb}` : '-'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-[3vw] py-[1vh] bg-[#2a2a2a]">
        <button className="text-[4vh] px-6 py-2 text-white/80 hover:text-white transition-colors" onClick={goPrevLvl}>
          ⏮︎
        </button>
        <button
          className="text-[5vh] px-6 py-2 text-white/80 hover:text-white transition-colors"
          onClick={() => setIsPaused(false)}
          style={{ display: isPaused ? '' : 'none' }}
        >
          ⏵︎
        </button>
        <button
          className="text-[5vh] px-6 py-2 text-white/80 hover:text-white transition-colors"
          onClick={() => setIsPaused(true)}
          style={{ display: !isPaused ? '' : 'none' }}
        >
          ⏸︎
        </button>
        <button className="text-[4vh] px-6 py-2 text-white/80 hover:text-white transition-colors" onClick={goNextLvl}>
          ⏭︎
        </button>
      </div>
    </div>
  )
}
