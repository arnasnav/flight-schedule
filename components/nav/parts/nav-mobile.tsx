import { Bars4Icon } from "@heroicons/react/24/outline"

type Props = {
  isVisible: boolean
  onToggle: () => void
}

export function NavMobileToggle({ onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      type="button"
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100"
    >
      <Bars4Icon className="h-7 w-7 stroke-gray-800" />
    </button>
  )
}
