import { Selector, SelectorNode, StoreNode } from "./types";

export const addStoreNode = <T>({ key, initialState }: { key: string; initialState: T }): StoreNode<T> => {
  return {
    _subscribers: new Set(),
    emitChange() {
      this._subscribers.forEach((callback) => {
        callback();
      });
    },
    key,
    onChange(callback) {
      this._subscribers.add(callback);

      return () => {
        this._subscribers.delete(callback);
      };
    },
    value: initialState,
  };
};

export const addStoreSelectorNode = <T>({ key, selector }: { key: string; selector: Selector<T> }): SelectorNode<T> => {
  return {
    _dependencies: new Set(),
    _subscribers: new Set(),
    emitChange() {
      this._subscribers.forEach((callback) => {
        callback();
      });
    },
    key,
    onChange(callback) {
      this._subscribers.add(callback);

      return () => {
        this._subscribers.delete(callback);
      };
    },
    selector,
    value: null as T,
  };
};
