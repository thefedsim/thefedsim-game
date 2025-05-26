'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ClaimFedButton({ amount }: { amount: number }) {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)
  const [tx, setTx] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [wasEligible, setWasEligible] = useState(false)

  const eligible = publicKey && amount > 0

  useEffect(() => {
    if (eligible) {
      setWasEligible(true)
    }
  }, [eligible])

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
        }),
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
    <div className="flex flex-col items-end space-y-2 mt-6">
      <AnimatePresence>
        {eligible && wasEligible && !loading && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-full"
          >
            <Button
              onClick={handleClaim}
              className="w-full bg-green-500 hover:bg-green-600 text-black"
            >
              {loading ? 'Claiming...' : `Claim ${amount} $FED`}
            </Button>
          </motion.div>
        )}
        {!eligible && (
          <Button
            disabled
            className="w-full bg-zinc-700 text-gray-400 cursor-not-allowed"
          >
            Claim $FED
          </Button>
        )}
      </AnimatePresence>

      {!publicKey && (
        <p className="text-xs text-gray-400">🔌 Connect your wallet to claim $FED</p>
      )}

      {tx && (
        <p className="text-green-500 text-sm">
          ✅ Claimed!{' '}
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

      {error && (
        <p className="text-red-500 text-sm">⚠️ {error}</p>
      )}
    </div>
  )
}
