// src/components/fedsim/fed-trade-history.tsx

'use client'

import { EconomicState } from './fedsim-engine'

export function FedTradeHistory({ state }: { state: EconomicState }) {
  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono">
      <h2 className="text-xs text-gray-400 uppercase mb-3">🕒 Trade History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-zinc-700">
              <th className="px-2 py-1 text-left">Turn</th>
              <th className="px-2 py-1 text-left">Action</th>
              <th className="px-2 py-1">Rate</th>
              <th className="px-2 py-1">Inflation</th>
              <th className="px-2 py-1">Unemployment</th>
              <th className="px-2 py-1">GDP</th>
              <th className="px-2 py-1">Trust</th>
            </tr>
          </thead>
          <tbody>
            {state.history.map((entry) => (
              <tr key={entry.turn} className="border-b border-zinc-800">
                <td className="px-2 py-1">{entry.turn}</td>
                <td className="px-2 py-1 capitalize text-blue-400">{entry.action}</td>
                <td className="px-2 py-1 text-center">{entry.interestRate.toFixed(2)}%</td>
                <td className="px-2 py-1 text-center">{entry.inflation.toFixed(1)}%</td>
                <td className="px-2 py-1 text-center">{entry.unemployment.toFixed(1)}%</td>
                <td className="px-2 py-1 text-center">{entry.gdpGrowth.toFixed(1)}%</td>
                <td className="px-2 py-1 text-center">{entry.trust.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
