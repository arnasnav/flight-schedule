import type { StateCreator } from "zustand"
import type { INotificationSlice } from "./store-t"

export const createNotificationSlice: StateCreator<
  INotificationSlice,
  [],
  [],
  INotificationSlice
> = (set) => ({
  messages: [],
  setMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message]
    }))
})