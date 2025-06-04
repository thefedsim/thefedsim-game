// src/components/fedsim/fed-balance-chart.tsx

'use client'

import { EconomicState } from './fedsim-engine'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

export function FedBalanceChart({ state }: { state: EconomicState }) {
  const data = useMemo(() => {
    let treasuries = 800
    let reserves = 500
    let reverseRepos = 0

    const history = state.history.map(entry => {
      switch (entry.action) {
        case 'qe':
          treasuries += 50
          reserves += 50
          break
        case 'qt':
          treasuries = Math.max(treasuries - 50, 0)
          reserves = Math.max(reserves - 50, 0)
          break
        case 'raise':
          reverseRepos += 20
          reserves = Math.max(reserves - 20, 0)
          break
        case 'cut':
          reserves += 20
          reverseRepos = Math.max(reverseRepos - 20, 0)
          break
      }

      return {
        turn: entry.turn,
        treasuries,
        reserves,
        reverseRepos,
      }
    })

    for (const op of state.customOps) {
      if (op.type === 'repo') {
        treasuries += op.amount
        reserves += op.amount
      } else {
        reverseRepos += op.amount
        reserves = Math.max(reserves - op.amount, 0)
      }
    }

    return history
  }, [state.history, state.customOps])

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono h-[250px]">
      <h2 className="text-xs text-gray-400 uppercase mb-3">📈 Balance Sheet Evolution</h2>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
          <XAxis dataKey="turn" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip contentStyle={{ background: '#1a1a1a', borderColor: '#333', color: '#fff' }} />
          <Area type="monotone" dataKey="treasuries" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Treasuries" />
          <Area type="monotone" dataKey="reserves" stackId="1" stroke="#10b981" fill="#10b981" name="Reserves" />
          <Area type="monotone" dataKey="reverseRepos" stackId="1" stroke="#facc15" fill="#facc15" name="Reverse Repos" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
