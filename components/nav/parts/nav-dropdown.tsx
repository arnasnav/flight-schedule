import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import type { INavDropdownProps } from "@/types/props/nav"

export function NavDropdown(props: INavDropdownProps) {
  const { item } = props
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 text-base font-medium">
            {item.title}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid w-48 gap-1 p-2">
              {item.children?.map((child) => (
                <li key={child.slug}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={child.slug}
                      className="block rounded-md p-3 hover:bg-gray-100"
                    >
                      {child.title}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
