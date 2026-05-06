import Link from "next/link"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <div className="flex gap-x-2">
        <PaperAirplaneIcon className="h-8 w-8 stroke-orange-700" />
        <div className="text-2xl text-orange-700 font-bold">
          Lėktuvų tvarkaraštis
        </div>
      </div>
    </Link>
  )
}
