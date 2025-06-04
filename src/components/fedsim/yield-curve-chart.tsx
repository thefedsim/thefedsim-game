'use client'

import { EconomicState } from './fedsim-engine'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

export function YieldCurveChart({ state }: { state: EconomicState }) {
  if (!state.yieldCurve || state.yieldCurve.length === 0) {
    return (
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono h-[250px] flex items-center justify-center text-gray-500">
        Waiting for yield data...
      </div>
    )
  }

  const data = state.yieldCurve.map((point, i) => ({
    turn: i + 1,
    'Short Rate': point.shortRate,
    'Long Rate': point.longRate,
    'Curve Slope': point.longRate - point.shortRate,
  }))

  const latest = state.yieldCurve[state.yieldCurve.length - 1]
  const latestSlope = latest.longRate - latest.shortRate

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono h-[250px]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs text-gray-400 uppercase">🪙 Yield Curve</h2>
        <div className="text-xs text-gray-300 flex gap-4">
          <span>
            <span className="text-blue-400">Short:</span> {latest.shortRate.toFixed(2)}%
          </span>
          <span>
            <span className="text-green-400">Long:</span> {latest.longRate.toFixed(2)}%
          </span>
          <span>
            <span className="text-yellow-400">Slope:</span> {latestSlope.toFixed(2)}%
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="turn" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#444', color: '#fff' }} />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#aaa' }} />
          <Line type="monotone" dataKey="Short Rate" stroke="#60a5fa" dot={false} />
          <Line type="monotone" dataKey="Long Rate" stroke="#34d399" dot={false} />
          <Line type="monotone" dataKey="Curve Slope" stroke="#facc15" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
