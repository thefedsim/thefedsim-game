//src/components/fedsim/fedsim-claim-fed.tsx
'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function ClaimFedButton({ amount }: { amount: number }) {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)
  const [tx, setTx] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClaim = async () => {
    if (!publicKey) {
      setError('Connect your wallet first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          amount,
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Claim failed')

      setTx(data.signature)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleClaim} disabled={loading || !publicKey || amount <= 0}>
        {loading ? 'Claiming...' : `Claim ${amount} $FED`}
      </Button>
      {tx && (
        <p className="text-green-500 text-sm">
          ✅ Success!{' '}
          <a
            href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Explorer
          </a>
        </p>
      )}
      {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}
    </div>
  )
}
