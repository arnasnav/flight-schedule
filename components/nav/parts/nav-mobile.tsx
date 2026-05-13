import { Menu } from "lucide-react"

import type { INavMobileToggleProps } from "@/types/props/nav"

export function NavMobileToggle(props: INavMobileToggleProps) {
  const { onToggle } = props
  return (
    <button
      onClick={onToggle}
      type="button"
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100"
    >
      <Menu className="h-7 w-7 stroke-gray-800" />
    </button>
  )
}
