// src/components/fedsim/fed-order-book.tsx

'use client'

import { EconomicState } from './fedsim-engine'

export function FedOrderBook({  }: { state: EconomicState }) {
  const fakeLiquidityNeeds = [
    { institution: 'Primary Dealer A', amount: 120, type: 'repo' },
    { institution: 'Bank B', amount: 80, type: 'repo' },
    { institution: 'MMF C', amount: 150, type: 'reverse-repo' },
    { institution: 'Hedge Fund D', amount: 40, type: 'repo' },
  ]

  return (
    <div className="bg-[#1a1a1a] rounded border border-zinc-800 p-4 space-y-2 text-sm font-mono">
      <div className="text-xs text-gray-400 uppercase mb-2">Liquidity Order Book</div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-red-400 mb-1">🏦 Repo Demand (Need Liquidity)</p>
          {fakeLiquidityNeeds.filter(i => i.type === 'repo').map((order, i) => (
            <div key={i} className="flex justify-between border-b border-zinc-700 py-1">
              <span>{order.institution}</span>
              <span>{order.amount}B</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-green-400 mb-1">💵 Reverse Repo Offers (Excess Liquidity)</p>
          {fakeLiquidityNeeds.filter(i => i.type === 'reverse-repo').map((order, i) => (
            <div key={i} className="flex justify-between border-b border-zinc-700 py-1">
              <span>{order.institution}</span>
              <span>{order.amount}B</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
