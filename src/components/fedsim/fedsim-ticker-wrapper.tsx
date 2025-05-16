'use client'

import { usePathname } from 'next/navigation'
import { useGameEngine } from './fedsim-engine'
import { FedSimTicker } from './fedsim-ticker'

export function FedSimTickerWrapper() {
  const pathname = usePathname()
  const enabled = pathname === '/' || pathname.startsWith('/fedsim')

  const { state } = useGameEngine()

  if (!enabled) return null

  return (
    <FedSimTicker action={state.history.at(-1)?.action ?? 'init'} />

  )
}
