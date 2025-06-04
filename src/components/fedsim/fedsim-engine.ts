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
  customOps: CustomOperation[],
  yieldCurve: {
    shortRate: number
    longRate: number
  }[]
}

export type CustomOperation = {
  turn: number
  type: 'repo' | 'reverse-repo'
  counterparty: string
  amount: number
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
  customOps: [],
  yieldCurve: [],
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

      // Trust effects
      const trustMultiplier = 1 + (trust - 50) / 100

      // Interest rate → investment channel
      const investment = Math.max(0, 100 - interestRate * 10) * trustMultiplier

      // GDP = investment-driven
      gdpGrowth = (investment / 100) * 2 - 0.5 + (Math.random() - 0.5)

      // Policy effects
      switch (action) {
        case 'raise':
          interestRate += 0.25
          trust -= 1
          break
        case 'cut':
          interestRate -= 0.25
          trust += 1
          break
        case 'qe':
          trust += 2
          break
        case 'qt':
          trust -= 2
          break
      }

      // Inflation tied to growth, rates
      inflation += gdpGrowth * 0.2 - interestRate * 0.05

      // Unemployment reacts to growth + rates
      unemployment += -gdpGrowth * 0.4 + interestRate * 0.2

      // Clamp values
      inflation = clamp(inflation, 0, 10)
      unemployment = clamp(unemployment, 0, 20)
      trust = clamp(trust, 0, 100)
      interestRate = clamp(interestRate, 0, 10)
      gdpGrowth = clamp(gdpGrowth, -10, 10)

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
        const won = inflation <= 2.5 && unemployment <= 5 && gdpGrowth >= 1 && trust >= 60
        status = won ? 'won' : 'lost'
      }

      // Yield curve logic
      const longRateBase = interestRate + 0.5 + (Math.random() - 0.5) * 0.3
      const macroAdjustment = gdpGrowth * 0.1 - inflation * 0.05 + trust * 0.01
      const longRate = clamp(longRateBase + macroAdjustment, 0, 10)

      const updatedYieldCurve = [...prev.yieldCurve, {
        shortRate: interestRate,
        longRate,
      }]

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
        yieldCurve: updatedYieldCurve,
      }

      const updatedObjectives = [...next.objectives]
      const current = updatedObjectives.find((o) => o.id === next.currentObjective)
      if (current && action === current.requiredTool && current.status === 'unlocked') {
        current.status = 'completed'
        const nextObjective = updatedObjectives.find((o) => o.id === current.id + 1)
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

  const executeCustomOp = (type: 'repo' | 'reverse-repo', counterparty: string, amount: number) => {
    setState((prev) => {
      const op: CustomOperation = {
        turn: prev.turn + 1,
        type,
        counterparty,
        amount,
      }

      return {
        ...prev,
        customOps: [...prev.customOps, op],
      }
    })
  }

  const loadScenario = (params: Partial<EconomicState>) => {
    setState((prev) => ({
      ...prev,
      ...params,
      turn: 0,
      earnedFed: 0,
      status: 'playing',
      candles: [],
      history: [],
      customOps: [],
      currentObjective: params.objectives?.[0]?.id ?? null,
    }))
  }

  return { state, simulateTurn, executeCustomOp, loadScenario }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
