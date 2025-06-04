// src/components/fedsim/fed-liquidity-ops-log.tsx

'use client'

import { EconomicState } from './fedsim-engine'

export function FedLiquidityOpsLog({ state }: { state: EconomicState }) {
  const ops = [...state.customOps].sort((a, b) => b.turn - a.turn) // recent first

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono">
      <h2 className="text-xs text-gray-400 uppercase mb-3">💧 Liquidity Operations Log</h2>
      {ops.length === 0 ? (
        <p className="text-gray-500 italic">No liquidity ops yet.</p>
      ) : (
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {ops.map((op, i) => (
            <div key={i} className="flex justify-between text-xs border-b border-zinc-800 py-1">
              <span className="text-gray-400">
                Turn {op.turn} — {op.type === 'repo' ? 'Repo' : 'Reverse Repo'}
              </span>
              <span>
                {op.counterparty} · <strong>${op.amount}B</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
