'use client'

import { useState, useEffect, useCallback } from 'react'
import useTimer from './useTimer'
import { ClockLevel } from './types'
import Logo from '@/components/Logo'

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
    <div className="App mx-auto h-screen max-h-screen overflow-hidden flex flex-col items-center py-[2vh]">
      {/* Logo - 20% of viewport height */}
      <Logo className="h-[20vh] w-auto mx-auto"/>

      {/* Main Timer - takes ~35% of viewport height */}
      <div className="text-[40vh] mb-[5vh] font-bold text-center leading-none tracking-tight">
        {`${timeFormat(mins)}:${timeFormat(secs)}`}
      </div>

      {/* Blinds Info - aligned grid layout ~25% */}
      <div className="flex flex-col gap-[1vh] w-full max-w-xl px-8">
        {/* Current Level */}
        <div className="grid grid-cols-2 mb-[1vh]">
          <div className="flex items-baseline gap-2">
            <span className="text-[6vh]">SB:</span>
            <span className="text-[9vh] font-semibold">{levels[tourneyLvl]?.sb ?? '-'}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[6vh]">BB+ANTE:</span>
            <span className="text-[9vh] font-semibold">{levels[tourneyLvl]?.bb ?? '-'}</span>
          </div>
        </div>

        {/* Next Level - 2/3 size, same alignment */}
        <div className="opacity-70 mt-[1vh]">
          <div className="text-[3vh] mb-[1vh]">Próximo nivel</div>
          <div className="grid grid-cols-2 ">
            <div className="flex items-baseline gap-1">
              <span className="text-[3.5vh]">SB:</span>
              <span className="text-[6vh] font-semibold">{levels[tourneyLvl + 1]?.sb ?? '-'}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[2vh]">BB+ANTE:</span>
              <span className="text-[6vh] font-semibold">{levels[tourneyLvl + 1]?.bb ?? '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls - 8% of viewport */}
      <div className="flex justify-center gap-[2vw] mx-auto h-[8vh] items-center"> 
        <button className="text-[4vh] px-4 hover:opacity-70 transition-opacity" onClick={goPrevLvl}>
          ⏮︎
        </button>
        <button className="text-[5vh] px-4 hover:opacity-70 transition-opacity" onClick={() => setIsPaused(false)} style={{ display: isPaused ? '' : 'none' }}>
          ⏵︎
        </button>
        <button className="text-[5vh] px-4 hover:opacity-70 transition-opacity" onClick={() => setIsPaused(true)} style={{ display: !isPaused ? '' : 'none' }}>
          ⏸︎
        </button>
        <button className="text-[4vh] px-4 hover:opacity-70 transition-opacity" onClick={goNextLvl}>
          ⏭︎
        </button>
      </div>
    </div>
  )
}
