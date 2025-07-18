export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<U>
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};
