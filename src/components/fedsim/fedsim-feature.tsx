// src/components/fedsim/fedsim-feature.tsx

'use client'

import { FedAction, EconomicState } from './fedsim-engine'
import { FedSimChart } from './fedsim-chart'
import { useEffect, useState, useRef } from 'react'
import { ClaimFedButton } from './fedsim-claim-fed'
import { FedToolButton } from './FedToolButton'
import { Toaster } from 'react-hot-toast'
import { toast } from 'react-hot-toast'
export function FedSimFeature({
  state,
  simulateTurn,
}: {
  state: EconomicState
  simulateTurn: (action: FedAction) => void
}) {
  const [floatingAction, setFloatingAction] = useState<null | FedAction>(null)

  const prevObjective = useRef(state.currentObjective);

  const handleAction = (action: FedAction) => {
    // Find the current objective
    const currentObj = state.objectives.find((o) => o.id === state.currentObjective);
    if (currentObj && currentObj.requiredTool !== action) {
      toast.error('⚠️ That tool didn\'t help solve this objective');
    }
    simulateTurn(action);
    setFloatingAction(action);
  }

  useEffect(() => {
    if (!floatingAction) return
    const timeout = setTimeout(() => setFloatingAction(null), 1000)
    return () => clearTimeout(timeout)
  }, [floatingAction])

  useEffect(() => {
    // Objective completed
    if (
      prevObjective.current !== state.currentObjective &&
      prevObjective.current !== null
    ) {
      toast.success('✅ Objective Complete! +5 $FED');
      // If all objectives are done
      if (state.currentObjective === null && state.status === 'won') {
        toast.success('🎉 You completed all objectives!');
      }
    }
    prevObjective.current = state.currentObjective;
  }, [state.currentObjective, state.status]);

  return (
    <>
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-[#0c0c0f] text-white font-sans">
        {/* Left: Chart */}
        <section className="lg:col-span-8 border-r border-zinc-800 p-4">
          <div className="bg-[#121212] rounded-lg border border-zinc-800 h-[300px] overflow-hidden">
            <FedSimChart data={state.candles} />
          </div>
        </section>

        {/* Right: HUD + Tools + Objectives */}
        <aside className="lg:col-span-4 p-4 space-y-6 bg-[#0f0f12]">
          {/* Metrics HUD */}
          <div className="bg-[#1b1b20] rounded-lg border border-zinc-700 p-4 text-sm font-mono space-y-2">
            <div>🧠 Trust: {state.trust.toFixed(0)}</div>
            <div>📊 Inflation: {state.inflation.toFixed(1)}%</div>
            <div>📉 Unemployment: {state.unemployment.toFixed(1)}%</div>
            <div>🏦 Rate: {state.interestRate.toFixed(2)}%</div>
            <div>💰 Earned: {state.earnedFed} $FED</div>
          </div>

          {/* Objective Box */}
          {state.currentObjective && (
            <div className="bg-[#18181b] border border-yellow-500 p-4 rounded text-sm font-mono space-y-2">
              <p className="text-yellow-400 font-semibold">🎯 Objective</p>
              <p>{state.objectives.find(o => o.id === state.currentObjective)?.situation}</p>
              <p className="text-yellow-200 italic">
                Solve this using a policy tool effectively.
              </p>
            </div>
          )}

          {/* Tools */}
          <div className="space-y-2">
            <h2 className="text-xs text-gray-400 uppercase tracking-wide">Policy Tools</h2>
            <FedToolButton
              label="Raise"
              tooltip="Raise interest rates to fight inflation"
              color="bg-red-600 hover:bg-red-700"
              onClick={() => handleAction('raise')}
            />
            <FedToolButton
              label="Cut"
              tooltip="Cut interest rates to stimulate the economy"
              color="bg-green-600 hover:bg-green-700"
              onClick={() => handleAction('cut')}
            />
            <FedToolButton
              label="QE"
              tooltip="Inject liquidity to restore confidence"
              color="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleAction('qe')}
            />
            <FedToolButton
              label="QT"
              tooltip="Withdraw liquidity to cool inflation"
              color="bg-yellow-600 hover:bg-yellow-700"
              onClick={() => handleAction('qt')}
            />
          </div>

          {/* Claim Button */}
          <div className="pt-2 flex justify-end">
            <ClaimFedButton amount={state.earnedFed} />
          </div>
        </aside>
      </div>
    </>
  )
}
