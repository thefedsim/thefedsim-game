'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type TickerItem = {
  label: string
  value: number
  delta: number
  unit?: string
}

// 🎯 Realistic starting prices (May 2025 baseline)
const INITIAL_VALUES: Record<string, number> = {
  SPY: 581.57,
  VIX: 20.42,
  '10Y Yield': 4.44,
  DXY: 104.5,
  BTC: 105398,
  ETH: 2558,
  GOLD: 3228,
  OIL: 62.66,
  TLT: 86.36,
  'USD/JPY': 147.80,
}

// 💥 Volatility per asset (roughly 1s resolution)
const VOLATILITY: Record<string, number> = {
  SPY: 1.5,
  VIX: 0.8,
  '10Y Yield': 0.03,
  DXY: 0.15,
  BTC: 1200,
  ETH: 80,
  GOLD: 25,
  OIL: 1.8,
  TLT: 1.2,
  'USD/JPY': 0.4,
}

// 🧠 Per-asset response to Fed actions
const IMPACT_MATRIX: Record<string, Partial<Record<string, number>>> = {
  raise: {
    SPY: -1,
    BTC: -2,
    ETH: -2,
    GOLD: -0.5,
    TLT: -2,
    'USD/JPY': 0.5,
    '10Y Yield': 1,
    VIX: 0.8,
  },
  cut: {
    SPY: 1,
    BTC: 2,
    ETH: 2,
    GOLD: 1,
    TLT: 1.2,
    'USD/JPY': -0.5,
    '10Y Yield': -1,
    VIX: -0.5,
  },
  qe: {
    BTC: 3,
    ETH: 2,
    SPY: 1.5,
    GOLD: 1.2,
    TLT: 0.5,
  },
  qt: {
    BTC: -2,
    ETH: -1.5,
    SPY: -1,
    TLT: 1,
    '10Y Yield': 1,
    VIX: 1,
  },
}

// 💬 Format large numbers cleanly
const formatValue = (label: string, value: number) => {
  const decimals = value >= 10000 ? 0 : 2
  return Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value)
}

export function FedSimTicker({ action }: { action: string }) {
  const [tickers, setTickers] = useState<Record<string, TickerItem>>(() => {
    return Object.entries(INITIAL_VALUES).reduce((acc, [label, base]) => {
      acc[label] = {
        label,
        value: base,
        delta: 0,
        unit: label.includes('Yield') || label === 'USD/JPY' ? '%' : '',
      }
      return acc
    }, {} as Record<string, TickerItem>)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) => {
        const updated: Record<string, TickerItem> = {}

        for (const [label, { value }] of Object.entries(prev)) {
          const vol = VOLATILITY[label] ?? 1
          const tickerImpact = IMPACT_MATRIX[action]?.[label] ?? 0
          const random = (Math.random() - 0.5) * vol + tickerImpact * 0.5
          const newValue = value + random

          updated[label] = {
            label,
            value: newValue,
            delta: random,
            unit: label.includes('Yield') || label === 'USD/JPY' ? '%' : '',
          }
        }

        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [action])

  return (
    <div className="w-full bg-black text-white font-mono text-sm py-2 px-4 overflow-x-auto whitespace-nowrap flex gap-6 border-b border-neutral-800">
      {Object.values(tickers).map(({ label, value, delta, unit }) => {
        const color = delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-gray-300'
        const arrow = delta > 0 ? '▲' : delta < 0 ? '▼' : ''
        return (
          <span key={label} className="flex gap-1 items-center min-w-fit">
            <span className="text-gray-400">{label}:</span>
            <span className={cn('font-semibold', color)}>
              {formatValue(label, value)} {unit} {arrow}
            </span>
          </span>
        )
      })}
    </div>
  )
}
