'use client'

import { useEffect, useState } from 'react'

export interface FlipCardProps {
  value: string
  prevValue: string
  fontSize?: string
}

export default function FlipCard({ value, prevValue, fontSize = '18vh' }: FlipCardProps) {
  const [isFlipping, setIsFlipping] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)
  const [flipValue, setFlipValue] = useState(prevValue)

  useEffect(() => {
    if (value !== prevValue) {
      setFlipValue(prevValue)
      setIsFlipping(true)

      const timer = setTimeout(() => {
        setIsFlipping(false)
        setDisplayValue(value)
        setFlipValue(value)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setDisplayValue(value)
    }
  }, [value, prevValue])

  // Calculate card dimensions based on fontSize
  // fontSize is like "18vh", we extract the number and use it for proportional sizing
  const fontNum = parseFloat(fontSize)
  const unit = fontSize.replace(/[\d.]/g, '') || 'vh'
  const cardWidth = `${fontNum * 1.1}${unit}`
  const cardHeight = `${fontNum * 1.5}${unit}`

  const panelBase = 'absolute inset-x-0 flex items-center justify-center overflow-hidden tracking-tighter font-gotham font-bold'
  const topPanelBase = `${panelBase} top-0 h-1/2 rounded-t-[0.5vh] bg-gradient-to-b from-[#5a5a5a] to-[#4a4a4a] border-b-[0.2vh] border-black/40`
  const bottomPanelBase = `${panelBase} bottom-0 h-1/2 rounded-b-[0.5vh] bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a] border-t-[0.2vh] border-white/[0.05]`

  return (
    <div className="inline-block mx-[0.5vw]" style={{ perspective: '1000px' }}>
      <div
        className={`flip-card relative rounded-[0.5vh] shadow-[0_1vh_2vh_rgba(0,0,0,0.5)] ${isFlipping ? 'flipping' : ''}`}
        style={{ width: cardWidth, height: cardHeight }}
      >
        <div className={`${topPanelBase} backface-hidden`} style={{ fontSize }}>
          <span className="relative top-1/2 text-[#b0b0b0] drop-shadow-[0_0.1vh_0.2vh_rgba(0,0,0,0.4)]">
            {displayValue}
          </span>
        </div>

        <div className={`${bottomPanelBase} backface-hidden`} style={{ fontSize }}>
          <span className="relative -top-1/2 text-white drop-shadow-[0_0.2vh_0.3vh_rgba(0,0,0,0.5)]">
            {displayValue}
          </span>
        </div>

        <div 
          className={`flip-card__back ${topPanelBase} z-5 backface-hidden origin-bottom`} 
          style={{ fontSize }}
        >
          <span className="relative top-1/2 text-[#b0b0b0] drop-shadow-[0_0.1vh_0.2vh_rgba(0,0,0,0.4)]">
            {flipValue}
          </span>
        </div>

        <div
          className={`flip-card__back-bottom ${bottomPanelBase} z-4 backface-hidden origin-top`}
          style={{ fontSize, transform: 'rotateX(180deg)' }}
        >
          <span className="relative -top-1/2 text-white drop-shadow-[0_0.2vh_0.3vh_rgba(0,0,0,0.5)]">
            {value}
          </span>
        </div>
      </div>

      {/* Minimal CSS for animations and pseudo-elements */}
      <style jsx>{`
        .flip-card::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 0.4vh;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);
          transform: translateY(-50%);
          z-index: 10;
        }

        .flip-card.flipping .flip-card__back {
          animation: flipTop 0.3s ease-in forwards;
          z-index: 6;
        }

        .flip-card.flipping .flip-card__back-bottom {
          animation: flipBottom 0.3s ease-out forwards;
          animation-delay: 0.3s;
          z-index: 6;
        }

        @keyframes flipTop {
          0% {
            transform: rotateX(0deg);
            z-index: 2;
          }
          0%, 99% {
            opacity: 1;
          }
          100% {
            transform: rotateX(-90deg);
            opacity: 0;
          }
        }

        @keyframes flipBottom {
          0%, 50% {
            z-index: -1;
            transform: rotateX(90deg);
            opacity: 0;
          }
          51% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: rotateX(0deg);
            z-index: 5;
          }
        }
      `}</style>
    </div>
  )
}
