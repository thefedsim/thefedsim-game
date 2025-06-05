// src/components/fedsim/fedsim-engine.ts
'use client'

import { useEffect, useState } from 'react'
import { CandlestickData } from 'lightweight-charts'
import type { Objective } from './objectives'
import { defaultObjectives } from './objectives'
import { simulateTurn as computeNextTurn } from './economic-model'
import { Shock } from './shocks'
import { applyShock as computeShock } from './economic-model'

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
  outputGap: number
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
  outputGap: 0, // neutral baseline
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
    setState((prev) => computeNextTurn(prev, action))
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

  const applyShock = (shock: Shock) => {
    setState((prev) => computeShock(prev, shock))
  }

  return { state, simulateTurn, executeCustomOp, loadScenario, applyShock }
}

