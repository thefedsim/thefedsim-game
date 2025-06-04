// src/components/fedsim/fed-operations-panel.tsx

'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export function FedOperationsPanel({
  onExecute,
}: {
  onExecute: (type: 'repo' | 'reverse-repo', counterparty: string, amount: number) => void
}) {
  const [operation, setOperation] = useState<'repo' | 'reverse-repo'>('repo')
  const [counterparty, setCounterparty] = useState('Primary Dealer A')
  const [amount, setAmount] = useState(50)

  const handleExecute = () => {
    onExecute(operation, counterparty, amount)
    toast.success(
      `✅ Executed ${operation === 'repo' ? 'Repo' : 'Reverse Repo'} with ${counterparty} for $${amount}B`
    )

    // Placeholder logic: Here you'd dispatch an action to simulate the effect
    // In the future: push into state.history, affect reserves/assets, etc.
  }

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono space-y-2">
      <h2 className="text-xs text-gray-400 uppercase">⚙️ Fed Operations</h2>

      {/* Operation Type */}
      <div className="flex items-center gap-2">
        <label className="text-gray-300 w-28">Operation:</label>
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value as 'repo' | 'reverse-repo')}
          className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1 rounded w-full"
        >
          <option value="repo">Repo</option>
          <option value="reverse-repo">Reverse Repo</option>
        </select>
      </div>

      {/* Counterparty */}
      <div className="flex items-center gap-2">
        <label className="text-gray-300 w-28">Counterparty:</label>
        <input
          value={counterparty}
          onChange={(e) => setCounterparty(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1 rounded w-full"
        />
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2">
        <label className="text-gray-300 w-28">Amount ($B):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={1}
          max={500}
          className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1 rounded w-full"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleExecute}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-black font-bold py-2 rounded mt-2"
      >
        Execute Operation
      </button>
    </div>
  )
}
