import { StateCreator } from "zustand"
import { INavSlice } from "./store-t"

export const createNavigationSlice: StateCreator<INavSlice> = (set) => ({
  menu: [],
  setMenu: (menu) =>
    set((state) => ({
      menu,
    })),
})