export type StoreNodeKey = string;

export type StoreNode<T> = {
  key: StoreNodeKey;
  value: T;
  subscribers: Set<() => void>;
};

export type Store = {
  _nodes: Map<StoreNodeKey, StoreNode<any>>;
  _selectors: Set<SelectorNode<any>>;
};
export type StoreRef = {
  current: Store;
};

export type SelectorGetter<T = any> = (node: StoreNode<T>) => T;
export type SelectorNode<T> = {
  key: StoreNodeKey;
  selector: ({ get }: { get: SelectorGetter }) => T;
  dependencies: Set<StoreNodeKey>;
  dependenciesPrevValues: Map<StoreNodeKey, StoreNode<any>>;
};
