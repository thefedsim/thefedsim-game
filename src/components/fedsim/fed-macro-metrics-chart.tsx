// src/components/fedsim/macro-metrics-chart.tsx

'use client'

import { EconomicState } from './fedsim-engine'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export function MacroMetricsChart({ state }: { state: EconomicState }) {
  const data = state.history.map((entry) => ({
    turn: entry.turn,
    inflation: entry.inflation,
    unemployment: entry.unemployment,
    trust: entry.trust,
  }))

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono h-[250px]">
      <h2 className="text-xs text-gray-400 uppercase mb-2">📉 Macro Trends</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="turn" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              borderColor: '#444',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#aaa' }} />
          <Line type="monotone" dataKey="inflation" stroke="#f87171" name="Inflation" dot={true} />
          <Line type="monotone" dataKey="unemployment" stroke="#60a5fa" name="Unemployment" dot={true} />
          <Line type="monotone" dataKey="trust" stroke="#10b981" name="Trust" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
