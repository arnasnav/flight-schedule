import Link from "next/link"
import { Plane } from "lucide-react"

export function NavLogo() {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <div className="flex gap-x-2">
        <Plane className="h-8 w-8 stroke-orange-700" />
        <div className="text-2xl text-orange-700 font-bold">
          Lėktuvų tvarkaraštis
        </div>
      </div>
    </Link>
  )
}
