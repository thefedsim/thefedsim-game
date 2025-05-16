// src/components/fedsim/fedsim-engine.ts
'use client'

import { useEffect, useState } from 'react'
import { CandlestickData, Time } from 'lightweight-charts'
import type { Objective } from './objectives'
import { defaultObjectives } from './objectives'

export type FedAction = 'raise' | 'cut' | 'qe' | 'qt'

export type EconomicState = {
  turn: number
  inflation: number
  unemployment: number
  interestRate: number
  trust: number
  gdpGrowth: number
  earnedFed: number
  lastAction: FedAction | null
  status: 'playing' | 'won' | 'lost'
  candles: CandlestickData[]
  history: {
    turn: number
    inflation: number
    unemployment: number
    interestRate: number
    trust: number
    gdpGrowth: number
    action: FedAction
    earnedFed: number
  }[]
  objectives: Objective[]
  currentObjective: number | null
}

const initialState: EconomicState = {
  turn: 0,
  inflation: 2.1,
  unemployment: 4.0,
  interestRate: 5.25,
  trust: 85,
  gdpGrowth: 2.0,
  earnedFed: 0,
  lastAction: null,
  status: 'playing',
  candles: [],
  history: [],
  objectives: defaultObjectives,
  currentObjective: 1,
}

export function useGameEngine() {
  const [state, setState] = useState<EconomicState>(initialState)

  useEffect(() => {
    async function load() {
      const res = await fetch('/btc-history.json')
      const candles = await res.json()
      setState((prev) => ({
        ...prev,
        candles,
      }))
    }
    load()
  }, [])

  const simulateTurn = (action: FedAction) => {
    setState((prev) => {
      if (prev.candles.length === 0) return prev

      const turn = prev.turn + 1
      const earnedFed = prev.earnedFed + 1

      let inflation = prev.inflation
      let unemployment = prev.unemployment
      let interestRate = prev.interestRate
      let trust = prev.trust
      let gdpGrowth = prev.gdpGrowth

      // Policy effect
      switch (action) {
        case 'raise':
          interestRate += 0.25
          inflation -= 0.3
          unemployment += 0.2
          trust -= 1
          break
        case 'cut':
          interestRate -= 0.25
          inflation += 0.3
          unemployment -= 0.1
          trust += 1
          break
        case 'qe':
          gdpGrowth += 0.25
          inflation += 0.2
          trust += 2
          break
        case 'qt':
          gdpGrowth -= 0.25
          inflation -= 0.2
          trust -= 2
          break
      }

      // Clamp values
      inflation = clamp(inflation, 0, 10)
      unemployment = clamp(unemployment, 0, 20)
      trust = clamp(trust, 0, 100)
      gdpGrowth = clamp(gdpGrowth, -10, 10)
      interestRate = clamp(interestRate, 0, 10)

      // Candlestick
      const last = prev.candles.at(-1)!
      const time: Time = ((last.time as number) + 86400) as Time
      const open = last.close
      const policyImpact = {
        raise: -3000,
        cut: 3000,
        qe: 5000,
        qt: -5000,
      } satisfies Record<FedAction, number>
      const delta = policyImpact[action] + (Math.random() - 0.5) * 2000
      const close = open + delta
      const high = Math.max(open, close) + Math.random() * 500
      const low = Math.min(open, close) - Math.random() * 500
      const newCandle: CandlestickData = { time, open, high, low, close }

      // Determine outcome
      let status: EconomicState['status'] = 'playing'
      if (inflation > 9 || gdpGrowth < -2.5 || trust < 30) {
        status = 'lost'
      } else if (turn >= 10) {
        const won =
          inflation <= 2.5 &&
          unemployment <= 5 &&
          gdpGrowth >= 1 &&
          trust >= 60
        status = won ? 'won' : 'lost'
      }

      // Build next state
      const next = {
        ...prev,
        turn,
        inflation,
        unemployment,
        interestRate,
        trust,
        gdpGrowth,
        earnedFed,
        lastAction: action,
        status,
        candles: [...prev.candles, newCandle],
        history: [
          ...prev.history,
          {
            turn,
            inflation,
            unemployment,
            interestRate,
            trust,
            gdpGrowth,
            action,
            earnedFed,
          },
        ],
      }

      const updatedObjectives = [...next.objectives]
      const current = updatedObjectives.find(o => o.id === next.currentObjective)
      if (current && action === current.requiredTool && current.status === 'unlocked') {
        current.status = 'completed'
        const nextObjective = updatedObjectives.find(o => o.id === current.id + 1)
        if (nextObjective) {
          nextObjective.status = 'unlocked'
          next.currentObjective = nextObjective.id
        } else {
          next.currentObjective = null // done
        }
      }
      next.objectives = updatedObjectives

      return next
    })
  }

  return { state, simulateTurn }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
