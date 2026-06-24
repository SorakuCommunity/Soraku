'use client'

import { useEffect, useState } from 'react'

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate).getTime()
  const [remaining, setRemaining] = useState(target - Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(target - Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [target])

  if (remaining <= 0) return <span className="text-green-400 font-bold text-xs">✓ Started</span>

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wide">
      {days > 0 && <><span className="text-foreground">{days}d</span><span className="text-muted-foreground/40">:</span></>}
      <span className="text-foreground">{String(hours).padStart(2, '0')}h</span>
      <span className="text-muted-foreground/40">:</span>
      <span className="text-primary">{String(mins).padStart(2, '0')}m</span>
    </div>
  )
}
