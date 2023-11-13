export type StoreNode<T> = {
  key: string;
  value: T;
  subscribers: Set<() => void>;
  selectors: Set<(value: T) => any>;
};

export const addStoreNode = <T>({ key, initialState }: { key: string; initialState: T }): StoreNode<T> => {
  return {
    key,
    selectors: new Set(),
    subscribers: new Set(),
    value: initialState,
  };
};

export const addStoreNodeSelector = <T, R>(node: StoreNode<T>, selector: (value: T) => R) => {
  node.selectors.add(selector);
};
