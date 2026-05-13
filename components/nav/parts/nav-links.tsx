import Link from "next/link"
import type { INavLinksProps } from "@/types/props/nav"

import { NavDropdown } from "./nav-dropdown"

export function NavLinks(props: INavLinksProps) {
  const { menu, isVisible } = props
  return (
    <div
      className={`w-full md:block md:w-auto ${isVisible ? "" : "hidden"}`}
    >
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border md:flex-row md:items-center md:space-x-8 md:mt-0 md:border-0 md:bg-white">
        {menu.map((item) => (
          <li key={item.slug}>
            {item.children?.length ? (
              <NavDropdown item={item} />
            ) : (
              <Link
                href={item.slug}
                className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded"
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
