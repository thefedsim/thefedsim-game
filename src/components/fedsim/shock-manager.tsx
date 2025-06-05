// src/components/fedsim/shock-manager.tsx

'use client'

import { Shock, predefinedShocks } from './shocks'

export function ShockManager({ onApply }: { onApply: (shock: Shock) => void }) {
  return (
    <div className="bg-[#1a1a1a] border border-red-800 rounded p-4 text-sm font-mono space-y-3">
      <h2 className="text-xs text-red-400 uppercase mb-1">⚠️ Shock Events</h2>
      {predefinedShocks.map((shock) => (
        <div key={shock.id} className="border border-zinc-700 rounded p-2">
          <p className="text-red-300 font-bold">{shock.name}</p>
          <p className="text-xs text-gray-400">{shock.description}</p>
          <button
            onClick={() => onApply(shock)}
            className="mt-2 w-full text-black bg-red-600 hover:bg-red-700 font-bold py-1 text-xs rounded"
          >
            Inject Shock
          </button>
        </div>
      ))}
    </div>
  )
}
