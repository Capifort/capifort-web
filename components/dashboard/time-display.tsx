'use client'

import { useState, useEffect } from 'react'

export function TimeDisplay() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(new Date().toISOString().slice(11, 19) + ' UTC')
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="type-mono text-[var(--subtle)] tabular-nums">
      {time}
    </span>
  )
}
