export type StoreNodeKey = string;

export type StoreNode<T> = {
  key: StoreNodeKey;
  value: T;
  subscribers: Set<() => void>;
};

export type Store = {
  _nodes: Map<StoreNodeKey, StoreNode<any>>;
  _selectors: Map<StoreNodeKey, SelectorNode<any>>;
};
export type StoreRef = {
  current: Store;
};

export type SelectorGetter<T = any> = (node: StoreNode<T>) => T;
export type Selector<T> = ({ get }: { get: <U>(node: StoreNode<U>) => U }) => T;
export type SelectorNode<T> = {
  key: StoreNodeKey;
  selector: Selector<T>;
  value: T;
  dependencies: Set<StoreNodeKey>;
  subscribers: Set<() => void>;
};
