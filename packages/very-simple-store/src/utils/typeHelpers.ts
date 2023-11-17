export const isReducer = <T>(value: T | ((prev: T) => T)): value is (prev: T) => T => {
  return typeof value === "function";
};
