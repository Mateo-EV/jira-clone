type EnumValues<T> = T[keyof T]

type ColumnsSelection<T> = Partial<Record<keyof T, boolean>>

type Undefine<T> = {
  [K in keyof T]?: T[K]
}
