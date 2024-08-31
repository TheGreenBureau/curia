export type KeysOfValueType<T, K> = {
  [I in keyof T]: T[I] extends K ? I : never;
}[keyof T];

export type Never<T> = { [P in keyof T]?: never };
