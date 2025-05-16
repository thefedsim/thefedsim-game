import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { claimTokens } from '@/lib/solana/claim'

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json()

    if (!wallet) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 })
    }

    const recipient = new PublicKey(wallet)
    const sig = await claimTokens(recipient)

    return NextResponse.json({ success: true, signature: sig })
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Claim Error:', err.message)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }

    console.error('Unknown error during claim:', err)
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 })
  }
}
