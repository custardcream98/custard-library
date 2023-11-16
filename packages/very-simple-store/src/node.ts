import { StoreNode } from "./types";

export const addStoreNode = <T>({ key, initialState }: { key: string; initialState: T }): StoreNode<T> => {
  return {
    key,
    subscribers: new Set(),
    value: initialState,
  };
};
