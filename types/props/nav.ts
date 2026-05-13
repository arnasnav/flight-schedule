import type { INav } from "@/types/nav-t"

export type INavBarProps = {
  menu: INav[]
}

export type INavLinksProps = {
  menu: INav[]
  isVisible: boolean
}

export type INavMobileToggleProps = {
  isVisible: boolean
  onToggle: () => void
}

export type INavDropdownProps = {
  item: INav
}
