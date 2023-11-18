export type StoreNodeKey = string;

export type SubscribeCallback = () => void;
export type SubscribeCleanup = () => void;
export type OnChangeHandler = (callback: SubscribeCallback) => SubscribeCleanup;

export type EmitChangeHandler = () => void;

export type StoreNode<T> = {
  key: StoreNodeKey;
  value: T;
  _subscribers: Set<SubscribeCallback>;
  onChange: OnChangeHandler;
  emitChange: EmitChangeHandler;
};

export type Store = {
  onChange: OnChangeHandler;
  emitChange: EmitChangeHandler;
  _registerNode: <T>(node: StoreNode<T>) => void;
  _registerSelectorNode: <T>(selectorNode: SelectorNode<T>) => void;
  _unregisterNode: (key: StoreNodeKey) => void;
  _unregisterSelectorNode: (key: StoreNodeKey) => void;
  _getNode: <T>(key: StoreNodeKey) => StoreNode<T> | undefined;
  _getSelectorNode: <T>(key: StoreNodeKey) => SelectorNode<T> | undefined;
  _global_subscribers: Set<SubscribeCallback>;
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
  _dependencies: Set<StoreNodeKey>;
  _subscribers: Set<SubscribeCallback>;
  onChange: OnChangeHandler;
  emitChange: EmitChangeHandler;
};
