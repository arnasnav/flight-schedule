"use client"

import type { INav } from "@/types/nav-t"
import { useState } from "react"

import { NavLinks } from "@/components/nav/parts/nav-links"
import { NavMobileToggle } from "@/components/nav/parts/nav-mobile"
import { NavLogo } from "@/components/nav/parts/nav-logo"

type IProps = { menu: INav[] }

export function Nav(props: IProps) {
  const { menu } = props
  const [isVisible, setIsVisible] = useState(false)

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-7xl flex flex-wrap items-center gap-x-4 justify-between mx-auto p-4">
        <NavLogo />

        <NavMobileToggle
          isVisible={isVisible}
          onToggle={() => setIsVisible((v) => !v)}
        />

        <NavLinks menu={menu} isVisible={isVisible} />
      </div>
    </nav>
  )
}
