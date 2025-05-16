
// src/app/page.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-6">
      <div className="max-w-xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          🏛️ The Fed Simulator
        </h1>
        <p className="text-muted-foreground text-lg">
          Experience life as Jerome Powell. Raise interest rates, print money, and balance the economy.
        </p>
        <p className="text-sm text-muted-foreground">
          Learn monetary policy through simulation and earn $FED tokens.
        </p>
        <Button asChild size="lg">
          <Link href="/fedsim">Launch Simulation</Link>
        </Button>
      </div>
    </main>
  )
}
