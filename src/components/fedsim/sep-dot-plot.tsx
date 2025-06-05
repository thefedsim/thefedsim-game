// src/components/fedsim/sep-dot-plot.tsx

'use client'

import { EconomicState } from './fedsim-engine'
import { CommitteeMember } from './fomc-model'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

export function SepDotPlot({ committee }: { committee: CommitteeMember[] }) {
  const years = ['2025', '2026', 'LongRun'] as const

  const data = years.flatMap((year) =>  
    committee.map((member) => ({
      year,
      rate: member.projectRates({} as EconomicState)[year],
      member: member.id,
    }))
  )

  return (
    <div className="bg-[#1a1a1a] border border-zinc-700 rounded p-4 text-sm font-mono h-[250px]">
      <h2 className="text-xs text-gray-400 uppercase mb-3">📍 SEP Dot Plot</h2>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            type="category"
            dataKey="year"
            stroke="#888"
            tick={{ fill: '#aaa', fontSize: 12 }}
          />
          <YAxis
            type="number"
            domain={[0, 6]}
            tick={{ fill: '#aaa', fontSize: 12 }}
            stroke="#888"
            label={{
              value: 'Rate (%)',
              angle: -90,
              position: 'insideLeft',
              fill: '#aaa',
              fontSize: 12,
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ background: '#1a1a1a', borderColor: '#444', color: '#fff' }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rate']}
            labelFormatter={(label: string) => `Year: ${label}`}
          />
          <Scatter name="Dot Plot" data={data} fill="#facc15" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
