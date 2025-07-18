/**
 * Makes all properties of T optional recursively.
 * Arrays become readonly arrays of their element type.
 * Objects have all their properties made optional recursively.
 *
 * @example
 * type User = {
 *   name: string;
 *   settings: {
 *     theme: string;
 *     notifications: boolean;
 *   };
 *   tags: string[];
 * }
 *
 * type PartialUser = DeepPartial<User>;
 * // Result: {
 * //   name?: string;
 * //   settings?: {
 * //     theme?: string;
 * //     notifications?: boolean;
 * //   };
 * //   tags?: ReadonlyArray<string>;
 * // }
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<U>
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};
