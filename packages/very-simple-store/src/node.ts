export type StoreNode<T> = {
  key: string;
  value: T;
  subscribers: Set<() => void>;
  selectors: Set<(value: T) => any>;
};

export const addStoreNode = <T>({ key, initialState }: { key: string; initialState: T }): StoreNode<T> => {
  return {
    key,
    value: initialState,
    subscribers: new Set(),
    selectors: new Set(),
  };
};

export const addStoreNodeSelector = <T, R>(node: StoreNode<T>, selector: (value: T) => R) => {
  node.selectors.add(selector);
};
