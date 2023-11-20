import { isReducer } from "./typeHelpers";

export const getReducerValue = <T>(value: T | ((prev: T) => T), prevValue: T): T => {
  return isReducer(value) ? value(prevValue) : value;
};
