// src/components/fedsim/objectives.ts

import type { FedAction } from './fedsim-engine'

export type Objective = {
  id: number
  title: string
  situation: string
  objective: string
  requiredTool: FedAction
  status: 'locked' | 'unlocked' | 'completed'
}

export const defaultObjectives: Objective[] = [
  {
    id: 1,
    title: 'Inflation Spike',
    situation: 'Inflation just surged to 6.5%. Panic is rising.',
    objective: 'Use “Raise Rates” to control inflation.',
    requiredTool: 'raise',
    status: 'unlocked',
  },
  {
    id: 2,
    title: 'Recession Risk',
    situation: 'GDP growth has stalled. Unemployment is creeping up.',
    objective: 'Use “Cut Rates” to stimulate the economy.',
    requiredTool: 'cut',
    status: 'locked',
  },
  {
    id: 3,
    title: 'Market Confidence Drop',
    situation: 'Markets lack liquidity. Trust in the Fed is falling.',
    objective: 'Use “QE” to restore confidence.',
    requiredTool: 'qe',
    status: 'locked',
  },
]
