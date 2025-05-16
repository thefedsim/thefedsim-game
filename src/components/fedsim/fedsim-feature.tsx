// src/components/fedsim/fedsim-feature.tsx

'use client'

import { FedAction, EconomicState } from './fedsim-engine'
import { Button } from '@/components/ui/button'
import { FedSimChart } from './fedsim-chart'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function FedSimFeature({
  state,
  simulateTurn,
}: {
  state: EconomicState
  simulateTurn: (action: FedAction) => void
}) {
  const [floatingAction, setFloatingAction] = useState<null | FedAction>(null)

  const handleAction = (action: FedAction) => {
    simulateTurn(action)
    setFloatingAction(action)
  }

  useEffect(() => {
    if (!floatingAction) return
    const timeout = setTimeout(() => setFloatingAction(null), 1000)
    return () => clearTimeout(timeout)
  }, [floatingAction])

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-center gap-4 bg-neutral-900 py-3 sticky top-0 z-20 border-b border-neutral-800">
        {(['raise', 'cut', 'qe', 'qt'] as FedAction[]).map((action) => (
          <div className="relative" key={action}>
            <Button
              variant={
                action === 'raise'
                  ? 'destructive'
                  : action === 'cut'
                  ? 'secondary'
                  : action === 'qe'
                  ? 'outline'
                  : 'secondary'
              }
              className={
                action === 'cut'
                  ? 'text-green-400 border-green-400'
                  : action === 'qe'
                  ? 'text-blue-400 border-blue-400'
                  : ''
              }
              onClick={() => handleAction(action)}
              disabled={state.status !== 'playing'}
            >
              {action.toUpperCase()}
            </Button>
            <AnimatePresence>
              {floatingAction === action && (
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -30 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute left-1/2 -translate-x-1/2 text-green-400 text-sm font-bold"
                >
                  +1 $FED
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Show current objective above the chart */}
      {state.currentObjective && (
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 p-3 rounded-md text-sm font-medium shadow-inner mb-2 text-center">
          <span className="font-semibold">Objective {state.currentObjective}:</span>{' '}
          {
            state.objectives.find((o) => o.id === state.currentObjective)?.situation
          }
        </div>
      )}

      {/* 📉 Chart */}
      <FedSimChart data={state.candles} />

      {/* 📊 Stats + Earned */}
      <div className="flex justify-center gap-6 text-sm text-muted-foreground px-4">
        <span>Inflation: {state.inflation.toFixed(1)}%</span>
        <span>Unemployment: {state.unemployment.toFixed(1)}%</span>
        <span>Rate: {state.interestRate.toFixed(2)}%</span>
        <span>GDP: {state.gdpGrowth.toFixed(2)}%</span>
        <span>Trust: {state.trust.toFixed(0)}</span>
        <span className="text-xs text-gray-500">Turn {state.turn}</span>
        <span className="text-green-400 font-mono">Earned: {state.earnedFed} $FED</span>
      </div>

      {state.status !== 'playing' && (
        <div className="text-center mt-6 space-y-2">
          {state.status === 'won' ? (
            <p className="text-green-400 text-xl font-bold">
              🎉 Victory! You stabilized the economy.
            </p>
          ) : (
            <p className="text-red-400 text-xl font-bold">
              💥 Game Over: The economy collapsed.
            </p>
          )}
          <p className="text-muted-foreground">Claim your rewards below.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Restart Simulation
          </Button>
        </div>
      )}
    </div>
  )
}
