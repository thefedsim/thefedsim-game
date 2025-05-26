'use client'
import * as Tooltip from '@radix-ui/react-tooltip'

export function FedToolButton({
  label,
  tooltip,
  onClick,
  color,
}: {
  label: string
  tooltip: string
  onClick: () => void
  color: string
}) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className={`w-full ${color} text-black font-bold px-4 py-2 rounded`}
            onClick={onClick}
          >
            {label}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="z-50 bg-zinc-800 text-white px-3 py-2 rounded text-xs shadow-lg">
            {tooltip}
            <Tooltip.Arrow className="fill-zinc-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}