import { INavSlice, INotificationSlice } from "./store-t"
import { createNotificationSlice } from "./notification-slice"
import { createStore } from "zustand"
import { createNavigationSlice } from "./navigation-slice"

export type IStoreState = INotificationSlice & INavSlice

export const appStore = () =>
  createStore<IStoreState>()((...a) => ({
    ...createNotificationSlice(...a),
    ...createNavigationSlice(...a)
  }))