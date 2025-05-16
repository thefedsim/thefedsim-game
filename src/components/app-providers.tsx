'use client'

import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from './react-query-provider'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
 // BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets'

import { clusterApiUrl } from '@solana/web3.js'

// Default styles required for `react-ui` components like <WalletMultiButton />
import '@solana/wallet-adapter-react-ui/styles.css'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const wallets = [new PhantomWalletAdapter()]

// add later: new BackpackWalletAdapter()

  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
