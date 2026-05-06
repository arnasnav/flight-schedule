import Link from "next/link"
import { INav } from "@/types/nav-t"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

type Props = {
  item: INav
}

export function NavDropdown({ item }: Props) {
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
