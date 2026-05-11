import Link from "next/link"
import type { INav } from "@/types/nav-t"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

type IProps = {
  item: INav
}

export function NavDropdown(props: IProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent p-0 text-base font-medium">
            {props.item.title}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className="grid w-48 gap-1 p-2">
              {props.item.children?.map((child) => (
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
