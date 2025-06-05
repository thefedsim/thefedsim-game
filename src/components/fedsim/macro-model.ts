// src/components/fedsim/macro-model.ts

export type MacroInputs = {
    interestRate: number
    inflation: number
    outputGap: number
    trust: number
    shockInflation?: number
    shockUnemployment?: number
  }
  
  export type MacroOutputs = {
    gdpGrowth: number
    inflation: number
    unemployment: number
    outputGap: number
  }
  
  export function computeMacro(inputs: MacroInputs): MacroOutputs {
    const {
      interestRate,
      inflation,
      outputGap,
      trust,
      shockInflation = 0,
      shockUnemployment = 0,
    } = inputs
  
    // IS Curve: Output gap ↓ if rate ↑
    const newOutputGap = outputGap - (interestRate - 2) * 0.5 + trust * 0.01
  
    // Phillips Curve: inflation from output gap + lag
    const inflationDelta = newOutputGap * 0.4 - interestRate * 0.1 + shockInflation
  
    // Okun’s Law + monetary friction
    const unemploymentDelta = -newOutputGap * 0.5 + interestRate * 0.1 + shockUnemployment
  
    // GDP ≈ Output gap + trust-adjusted investment signal
    const gdpGrowth = newOutputGap * 1.5 + (trust - 50) * 0.02 + (Math.random() - 0.5) * 0.4
  
    return {
      gdpGrowth: clamp(gdpGrowth, -10, 10),
      inflation: clamp(inflation + inflationDelta, 0, 10),
      unemployment: clamp(5 + unemploymentDelta, 0, 20),
      outputGap: clamp(newOutputGap, -10, 10),
    }
  }
  
  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
  }
  