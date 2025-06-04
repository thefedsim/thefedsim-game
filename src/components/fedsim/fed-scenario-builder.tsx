// src/components/fedsim/fed-scenario-builder.tsx

'use client'

import { useState } from 'react'
import { EconomicState } from './fedsim-engine'
import type { Objective } from './objectives' 

type ScenarioPreset = {
  label: string
  inflation: number
  unemployment: number
  interestRate: number
  trust: number
}

const presets: ScenarioPreset[] = [
  {
    label: 'Volcker Shock (1980)',
    inflation: 13.5,
    unemployment: 7.5,
    interestRate: 19.0,
    trust: 60,
  },
  {
    label: 'Global Financial Crisis (2008)',
    inflation: 1.5,
    unemployment: 9.0,
    interestRate: 0.25,
    trust: 40,
  },
  {
    label: 'Pandemic Response (2020)',
    inflation: 0.3,
    unemployment: 14.7,
    interestRate: 0.1,
    trust: 55,
  },
]

export function FedScenarioBuilder({
  onLaunch,
}: {
  onLaunch: (params: Partial<EconomicState>) => void
}) {
  const [inflation, setInflation] = useState(3)
  const [unemployment, setUnemployment] = useState(5)
  const [interestRate, setInterestRate] = useState(4.5)
  const [trust, setTrust] = useState(80)

  const handleLaunch = () => {
    const customObjectives: Objective[] = [
      {
        id: 1,
        title: 'Custom Stabilization',
        situation: 'You are starting from a user-defined scenario.',
        objective: 'Try to meet healthy macro targets.',
        requiredTool: 'raise',
        status: 'unlocked',
      },
    ]

    onLaunch({
      inflation,
      unemployment,
      interestRate,
      trust,
      objectives: customObjectives,
    })
  }

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono space-y-4">
      <h2 className="text-xs text-gray-400 uppercase">🧪 Scenario Builder</h2>

      {/* Preset Selector */}
      <div className="flex items-center gap-2">
        <label className="text-gray-300 w-28 text-xs">Preset:</label>
        <select
          onChange={(e) => {
            const p = presets.find(p => p.label === e.target.value)
            if (p) {
              setInflation(p.inflation)
              setUnemployment(p.unemployment)
              setInterestRate(p.interestRate)
              setTrust(p.trust)
            }
          }}
          className="bg-zinc-900 border border-zinc-700 text-white px-2 py-1 rounded w-full text-xs"
        >
          <option value="">Custom</option>
          {presets.map(p => (
            <option key={p.label} value={p.label}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Slider label="Inflation (%)" value={inflation} setValue={setInflation} min={0} max={10} />
        <Slider label="Unemployment (%)" value={unemployment} setValue={setUnemployment} min={0} max={20} />
        <Slider label="Interest Rate (%)" value={interestRate} setValue={setInterestRate} min={0} max={10} />
        <Slider label="Trust Level" value={trust} setValue={setTrust} min={0} max={100} />
      </div>

      <button
        onClick={handleLaunch}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-black font-bold py-2 rounded"
      >
        Launch Scenario
      </button>
    </div>
  )
}

function Slider({
  label,
  value,
  setValue,
  min,
  max,
}: {
  label: string
  value: number
  setValue: (val: number) => void
  min: number
  max: number
}) {
  return (
    <div>
      <label className="block text-gray-300 text-xs mb-1">{label}: {value}</label>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step="0.1"
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  )
}
