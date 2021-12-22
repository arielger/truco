import R from "ramda";

declare module "ramda" {
  interface Filter {
    <T>(fn: (value: T) => boolean): (list: ReadonlyArray<T>) => T[];
    <T>(fn: (value: T) => boolean, list: ReadonlyArray<T>): T[];
  }
}
