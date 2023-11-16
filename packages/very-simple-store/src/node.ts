import { Selector, SelectorNode, StoreNode } from "./types";

export const addStoreNode = <T>({ key, initialState }: { key: string; initialState: T }): StoreNode<T> => {
  return {
    key,
    subscribers: new Set(),
    value: initialState,
  };
};

export const addStoreSelectorNode = <T>({ key, selector }: { key: string; selector: Selector<T> }): SelectorNode<T> => {
  return {
    dependencies: new Set(),
    key,
    selector,
    subscribers: new Set(),
    value: null as T,
  };
};
