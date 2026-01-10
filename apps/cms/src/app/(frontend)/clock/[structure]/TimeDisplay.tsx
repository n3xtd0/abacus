'use client'

import { useEffect, useState } from 'react'
import FlipCard from './FlipCard'

export default function TimeDisplay({ mins, secs, fontSize = '18vh' }: { mins: string, secs: string, fontSize?: string }) {
  const [prevMins, setPrevMins] = useState(mins)
  const [prevSecs, setPrevSecs] = useState(secs)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevMins(mins)
      setPrevSecs(secs)
    }, 300)
    return () => clearTimeout(timer)
  }, [mins, secs])

  const unit = fontSize.replace(/[\d.]/g, '') || 'vh'
  const separatorHeight = `${parseFloat(fontSize) * 1.4}${unit}`

  return (
    <div className="flex items-center justify-center">
      <FlipCard value={mins} prevValue={prevMins} fontSize={fontSize} />
      
      {/* Vertical line separator */}
      <div 
        className="w-[0.4vh] bg-black/80 mx-[0.5vw]" 
        style={{ height: separatorHeight }}
      />
      
      <FlipCard value={secs} prevValue={prevSecs} fontSize={fontSize} />
    </div>
  )
}
