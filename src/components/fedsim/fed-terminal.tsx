// src/components/fedsim/fed-terminal.tsx

'use client'

import { EconomicState, FedAction } from './fedsim-engine'

const ACTION_LABELS: Record<FedAction, string> = {
  raise: 'Raise Rates',
  cut: 'Cut Rates',
  qe: 'Quantitative Easing (QE)',
  qt: 'Quantitative Tightening (QT)',
}

export function FedTerminal({ state }: { state: EconomicState }) {
  const lastAction = state.history.at(-1)

  return (
    <div className="bg-[#1a1a1a] border border-zinc-800 rounded p-4 text-sm font-mono space-y-3">
      <h2 className="text-xs text-gray-400 uppercase">📰 Fed Terminal</h2>

      <p>
        🧭 <span className="text-gray-400">Scenario:</span>{' '}
        <strong className="text-blue-400">
          {state.objectives.length === 1 ? 'Custom Scenario' : 'Default Campaign'}
        </strong>
      </p>

      {lastAction ? (
        <div>
          <p>
            ⏱️ <span className="text-gray-400">Last Action:</span>{' '}
            <strong className="text-yellow-400">{ACTION_LABELS[lastAction.action]}</strong>
          </p>
          <ul className="text-xs text-gray-300 ml-4 list-disc">
            <li>Inflation: {lastAction.inflation.toFixed(1)}%</li>
            <li>Unemployment: {lastAction.unemployment.toFixed(1)}%</li>
            <li>Trust: {lastAction.trust.toFixed(0)}</li>
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 italic">No policy actions taken yet.</p>
      )}

      <p className="text-xs text-gray-500">
        📚 Curious about monetary tools?{' '}
        <a
          href="https://www.federalreserve.gov/monetarypolicy.htm"
          target="_blank"
          rel="noreferrer"
          className="underline text-blue-300"
        >
          Learn more
        </a>
      </p>
    </div>
  )
}
