import React from 'react'

export function AppFooter() {
  return (
    <footer className="text-center p-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 text-xs">
      
      <a
        className="link hover:text-neutral-500 dark:hover:text-white"
        href="https://github.com/solana-developers/create-solana-dapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github |
      </a>
      <a
        className="link hover:text-neutral-500 dark:hover:text-white"
        href="https://twitter.com/thefedsimulator"
        target="_blank"
        rel="noopener noreferrer"
      >
      {' '}  X |
      </a>
      <a
        className="link hover:text-neutral-500 dark:hover:text-white"
        href="https://dexscreener.com/solana/bo4ob94mrp9bmxnyjbptqpf4sau7usu7j8noqb59fgbz"
        target="_blank"
        rel="noopener noreferrer"
      >
      {' '}  DexScreener
      </a>
    </footer>
  )
}
