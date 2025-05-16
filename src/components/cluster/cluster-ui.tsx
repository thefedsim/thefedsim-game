'use client'

import { useQuery } from '@tanstack/react-query'
import * as web3 from '@solana/web3.js'
import { ReactNode, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/app-alert'
import { getExplorerLink, GetExplorerLinkArgs } from 'gill'

export function ExplorerLink({
  className,
  label = '',
  ...link
}: GetExplorerLinkArgs & {
  className?: string
  label: string
}) {
  return (
    <a
      href={getExplorerLink(link)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  )
}

export function ClusterChecker({ children }: { children: ReactNode }) {
  // Hardcoded to devnet for now — adjust if needed
  const connection = useMemo(
    () => new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed'),
    []
  )

  const query = useQuery({
    queryKey: ['version'],
    queryFn: () => connection.getVersion(),
    retry: 1,
  })

  if (query.isLoading) return null

  if (query.isError || !query.data) {
    return (
      <AppAlert
        action={
          <Button variant="outline" onClick={() => query.refetch()}>
            Refresh
          </Button>
        }
      >
        Error connecting to <span className="font-bold">Solana Devnet</span>.
      </AppAlert>
    )
  }

  return <>{children}</>
}
