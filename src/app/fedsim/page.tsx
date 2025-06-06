// src/app/fedsim/page.tsx
'use client'

import { FedSimFeature } from '@/components/fedsim/fedsim-feature'

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <FedSimFeature />
    </div>
  )
}
