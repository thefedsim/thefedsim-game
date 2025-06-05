export type Shock = {
    id: number
    name: string
    description: string
    impact: {
      inflationDelta: number
      unemploymentDelta: number
      trustDelta: number
      gdpGrowthDelta: number
      outputGapDelta?: number
      forcedAction?: 'qe' | 'qt' | 'raise' | 'cut'
    }
  }
  
  export const predefinedShocks: Shock[] = [
    {
      id: 1,
      name: 'Pandemic Surge',
      description: 'A new COVID variant disrupts global trade and labor markets.',
      impact: {
        inflationDelta: 0.8,
        unemploymentDelta: 2.5,
        trustDelta: -10,
        gdpGrowthDelta: -1.2,
        outputGapDelta: -2.0,
        forcedAction: 'qe',
      },
    },
    {
      id: 2,
      name: 'Oil Shock',
      description: 'OPEC cuts output sharply. Oil prices spike.',
      impact: {
        inflationDelta: 1.2,
        unemploymentDelta: 0.4,
        trustDelta: -3,
        gdpGrowthDelta: -0.3,
        outputGapDelta: -0.5,
      },
    },
    {
      id: 3,
      name: 'Debt Ceiling Standoff',
      description: 'Congress fails to agree on raising the debt ceiling. Markets panic.',
      impact: {
        inflationDelta: -0.3,
        unemploymentDelta: 1.0,
        trustDelta: -12,
        gdpGrowthDelta: -0.7,
        outputGapDelta: -1.0,
        forcedAction: 'qt',
      },
    },
  ]
  