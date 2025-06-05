// src/components/fedsim/economic-model.ts

import type { EconomicState, FedAction } from './fedsim-engine'
import type { Shock } from './shocks'
import { Objective } from './objectives'
import { Time, CandlestickData } from 'lightweight-charts'
import { computeMacro } from './macro-model'
import { clamp } from './utils'

export function simulateTurn(prev: EconomicState, action: FedAction): EconomicState {
  const turn = prev.turn + 1
  const earnedFed = prev.earnedFed + 1

  let inflation = prev.inflation
  let unemployment = prev.unemployment
  let interestRate = prev.interestRate
  let trust = prev.trust
  let gdpGrowth = prev.gdpGrowth

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

  const outputGap = prev.gdpGrowth // simple proxy for now

  const macro = computeMacro({
    interestRate,
    inflation,
    outputGap: prev.outputGap,
    trust,
  })

  gdpGrowth = macro.gdpGrowth
  inflation = macro.inflation
  unemployment = macro.unemployment

  inflation = clamp(inflation, 0, 10)
  unemployment = clamp(unemployment, 0, 20)
  trust = clamp(trust, 0, 100)
  interestRate = clamp(interestRate, 0, 10)
  gdpGrowth = clamp(gdpGrowth, -10, 10)

  let newCandle: CandlestickData | undefined
  if (prev.candles.length > 0) {
    const last = prev.candles.at(-1)!
    const time: Time = ((last.time as number) + 86400) as Time
    const policyImpact = { raise: -3000, cut: 3000, qe: 5000, qt: -5000 }[action]
    const delta = policyImpact + (Math.random() - 0.5) * 2000
    const open = last.close
    const close = open + delta
    const high = Math.max(open, close) + Math.random() * 500
    const low = Math.min(open, close) - Math.random() * 500
    newCandle = { time, open, high, low, close }
  }

  let status: EconomicState['status'] = 'playing'
  if (inflation > 9 || gdpGrowth < -2.5 || trust < 30) {
    status = 'lost'
  } else if (turn >= 10) {
    const won = inflation <= 2.5 && unemployment <= 5 && gdpGrowth >= 1 && trust >= 60
    status = won ? 'won' : 'lost'
  }

  const longRateBase = interestRate + 0.5 + (Math.random() - 0.5) * 0.3
  const macroAdjustment = gdpGrowth * 0.1 - inflation * 0.05 + trust * 0.01
  const longRate = clamp(longRateBase + macroAdjustment, 0, 10)

  const yieldCurve = [...prev.yieldCurve, {
    shortRate: interestRate,
    longRate,
  }]

  const history = [...prev.history, {
    turn,
    inflation,
    unemployment,
    interestRate,
    trust,
    gdpGrowth,
    action,
    earnedFed,
    outputGap,
  }]

  const objectives = unlockObjectives(prev.objectives, prev.currentObjective, action)

  return {
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
    candles: newCandle ? [...prev.candles, newCandle] : prev.candles,
    history,
    yieldCurve,
    objectives: objectives.updated,
    currentObjective: objectives.current,
  }
}

function unlockObjectives(objectives: Objective[], currentId: number | null, action: FedAction) {
  const updated = [...objectives]
  const current = updated.find(o => o.id === currentId)

  if (current && current.status === 'unlocked' && current.requiredTool === action) {
    current.status = 'completed'
    const next = updated.find(o => o.id === current.id + 1)
    if (next) {
      next.status = 'unlocked'
      return { updated, current: next.id }
    }
    return { updated, current: null }
  }

  return { updated, current: currentId }
}

export function applyShock(prev: EconomicState, shock: Shock): EconomicState {
  const inflation = clamp(prev.inflation + shock.impact.inflationDelta, 0, 10)
  const unemployment = clamp(prev.unemployment + shock.impact.unemploymentDelta, 0, 20)
  const trust = clamp(prev.trust + shock.impact.trustDelta, 0, 100)
  const gdpGrowth = clamp(prev.gdpGrowth + shock.impact.gdpGrowthDelta, -10, 10)

  const turn = prev.turn + 1
  const earnedFed = prev.earnedFed
  const lastAction: FedAction | null = shock.impact.forcedAction ?? null

  const historyEntry = {
    turn,
    inflation,
    unemployment,
    interestRate: prev.interestRate,
    trust,
    gdpGrowth,
    action: lastAction ?? 'qt', // fallback dummy
    earnedFed,
    outputGap: prev.gdpGrowth,
  }

  return {
    ...prev,
    turn,
    inflation,
    unemployment,
    trust,
    gdpGrowth,
    history: [...prev.history, historyEntry],
  }
}
