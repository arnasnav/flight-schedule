export type IWithStringId<T> = Omit<T, "id"> & { id: string }
