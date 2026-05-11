import { NavPage } from "@/components/nav"
import type { INav } from "@/types/nav-t"

const menu: INav[] = [
  {
    title: "Tvarkaraštis",
    slug: "/schedule",
  },
  {
    title: "Atvykimai",
    slug: "/arrivals",
  },
  {
    title: "Klasifikatoriai",
    slug: "/classifiers",
    children: [
      { title: "Oro uostai", slug: "/airports" },
      { title: "Kompanijos", slug: "/companies" },
    ],
  },
]

export async function Header() {
  return (
    <header className="border-b border-gray-400 p-1 mb-5 grid grid-flow-col gap-x-4 justify-between items-center">
      <NavPage menu={menu} />
    </header>
  )
}
