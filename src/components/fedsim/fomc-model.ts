// src/components/fedsim/fomc-model.ts
import type { EconomicState, FedAction } from './fedsim-engine'

export type FedVote = 'raise' | 'cut' | 'qe' | 'qt' | 'hold'

export type MemberBias = 'hawk' | 'dove' | 'neutral'

export type MemberProjection = {
  '2025': number
  '2026': number
  'LongRun': number
}

export type CommitteeMember = {
  id: string
  bias: MemberBias
  vote: (state: EconomicState) => FedVote
  projectRates: (state: EconomicState) => MemberProjection
}

export function defaultCommittee(): CommitteeMember[] {
  return [
    { id: 'Powell', bias: 'neutral', vote: neutralVote, projectRates: projectNeutral },
    { id: 'Waller', bias: 'hawk', vote: hawkishVote, projectRates: projectHawk },
    { id: 'Cook', bias: 'dove', vote: dovishVote, projectRates: projectDove },
    { id: 'Jefferson', bias: 'neutral', vote: neutralVote, projectRates: projectNeutral },
    { id: 'Mester', bias: 'hawk', vote: hawkishVote, projectRates: projectHawk },
  ]
}

function hawkishVote(state: EconomicState): FedVote {
  if (state.inflation > 3.5) return 'raise'
  if (state.trust < 40) return 'qt'
  return 'hold'
}

function dovishVote(state: EconomicState): FedVote {
  if (state.unemployment > 6.5) return 'cut'
  if (state.trust < 50) return 'qe'
  return 'hold'
}

function neutralVote(state: EconomicState): FedVote {
  if (state.inflation > 3 && state.unemployment < 5) return 'raise'
  if (state.unemployment > 6 && state.inflation < 2.5) return 'cut'
  return 'hold'
}

function projectHawk(state: EconomicState): MemberProjection {
  const baseRate = state.interestRate
  const inflationAdjustment = state.inflation > 3 ? 0.5 : 0
  const unemploymentAdjustment = state.unemployment < 5 ? 0.25 : 0
  
  return {
    '2025': baseRate + 0.75 + inflationAdjustment + unemploymentAdjustment,
    '2026': baseRate + 0.5 + inflationAdjustment,
    'LongRun': 2.5 + (state.inflation > 2.5 ? 0.25 : 0)
  }
}

function projectDove(state: EconomicState): MemberProjection {
  const baseRate = state.interestRate
  const inflationAdjustment = state.inflation > 3.5 ? 0.25 : 0
  const unemploymentAdjustment = state.unemployment > 5 ? -0.25 : 0
  
  return {
    '2025': baseRate + 0.25 + inflationAdjustment + unemploymentAdjustment,
    '2026': baseRate + 0.125 + inflationAdjustment,
    'LongRun': 2.0 + (state.inflation > 2.5 ? 0.125 : 0)
  }
}

function projectNeutral(state: EconomicState): MemberProjection {
  const baseRate = state.interestRate
  const inflationAdjustment = state.inflation > 3.25 ? 0.375 : 0
  const unemploymentAdjustment = state.unemployment > 5.5 ? -0.125 : 0
  
  return {
    '2025': baseRate + 0.5 + inflationAdjustment + unemploymentAdjustment,
    '2026': baseRate + 0.25 + inflationAdjustment,
    'LongRun': 2.25 + (state.inflation > 2.5 ? 0.1875 : 0)
  }
}

export function voteOnPolicy(state: EconomicState, committee: CommitteeMember[]): FedAction | 'hold' {
  const votes = committee.map(m => m.vote(state)).filter(v => v !== 'hold') as FedAction[]
  const tally = countVotes(votes)

  const ranked = ['raise', 'cut', 'qe', 'qt'] as FedAction[]
  for (const action of ranked) {
    if ((tally[action] ?? 0) >= Math.ceil(committee.length / 2)) {
      return action
    }
  }

  return 'hold'
}

function countVotes(votes: FedAction[]): Record<FedAction, number> {
  return votes.reduce((acc, vote) => {
    acc[vote] = (acc[vote] ?? 0) + 1
    return acc
  }, {} as Record<FedAction, number>)
}
