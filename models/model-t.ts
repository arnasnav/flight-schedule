export type WithStringId<T> = Omit<T, "id"> & { id: string }
