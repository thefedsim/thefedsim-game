import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token'
import bs58 from 'bs58'

const connection = new Connection(process.env.SOLANA_RPC!, 'confirmed')
const mint = new PublicKey(process.env.FED_TOKEN_MINT!)
const treasury = Keypair.fromSecretKey(bs58.decode(process.env.FED_SECRET_KEY!))

export async function claimTokens(recipient: PublicKey, amount: number = 1) {
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    treasury,
    mint,
    treasury.publicKey
  )

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    treasury,
    mint,
    recipient
  )

  const sig = await transfer(
    connection,
    treasury,
    fromTokenAccount.address,
    toTokenAccount.address,
    treasury.publicKey,
    amount * 1_000_000_000 // Adjust decimals
  )

  return sig
}
