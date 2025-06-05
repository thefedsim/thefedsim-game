// src/components/fedsim/fomc-vote-panel.tsx

'use client'

import { CommitteeMember, FedVote } from './fomc-model'
import { FedAction } from './fedsim-engine'

export function FomcVotePanel({
  committee,
  votes,
  finalDecision,
  votedAction,
  simulateTurn,
}: {
  committee: CommitteeMember[]
  votes: Record<string, FedVote>
  finalDecision: FedVote
  votedAction: FedAction | 'hold'
  simulateTurn: (action: FedAction) => void
}) {
  return (
    <div className="bg-[#1a1a1a] border border-zinc-700 rounded p-4 text-sm font-mono space-y-2">
      <h2 className="text-xs text-gray-400 uppercase">🗳️ FOMC Votes</h2>
      <div className="divide-y divide-zinc-800">
        {committee.map((member) => (
          <div key={member.id} className="flex justify-between py-1">
            <span>{member.id}</span>
            <span className="text-blue-400 font-semibold">{votes[member.id]}</span>
          </div>
        ))}
      </div>
      <div className="pt-2 text-xs text-gray-300">
        Final Decision:{' '}
        <span className="text-green-400 font-bold uppercase">{finalDecision}</span>
      </div>
      {votedAction !== 'hold' && (
        <button
          className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-black font-bold px-4 py-2 rounded"
          onClick={() => simulateTurn(votedAction)}
        >
          Execute: {votedAction.toUpperCase()}
        </button>
      )}
    </div>
  )
}
