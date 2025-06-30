// src/components/fedsim/fed-balance-sheet.tsx

'use client'

import { EconomicState } from './fedsim-engine'
import { useMemo } from 'react'
import { computeBalanceSheet } from './economic-model'

export function FedBalanceSheet({ state }: { state: EconomicState }) {
  const summary = useMemo(() => computeBalanceSheet(state), [state])

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono">
      <h2 className="text-xs text-gray-400 uppercase mb-3">🏛️ Fed Balance Sheet</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-green-400 mb-1">Assets</h3>
          <div className="flex justify-between py-1 border-b border-zinc-700">
            <span>Treasuries & MBS</span>
            <span>{summary.assets.treasuries}B</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Repo Loans</span>
            <span>{summary.assets.repoLoans}B</span>
          </div>
        </div>

        <div>
          <h3 className="text-red-400 mb-1">Liabilities</h3>
          <div className="flex justify-between py-1 border-b border-zinc-700">
            <span>Bank Reserves</span>
            <span>{summary.liabilities.reserves}B</span>
          </div>
          <div className="flex justify-between py-1">
            <span>ON RRP</span>
            <span>{summary.liabilities.reverseRepos}B</span>
          </div>
        </div>
      </div>
    </div>
  )
}
