// src/app/fedsim/page.tsx
'use client'

import { useGameEngine } from '@/components/fedsim/fedsim-engine'
import { FedSimFeature } from '@/components/fedsim/fedsim-feature'

export default function Page() {
  const { state, simulateTurn } = useGameEngine()

  return (
    <div className="flex flex-col gap-4 p-8">
      <FedSimFeature state={state} simulateTurn={simulateTurn} />
    </div>
  )
}
