export type StoreNodeKey = string | number | symbol;

export type SubscribeCallback = () => void;
export type SubscribeCleanup = () => void;
export type OnChangeHandler = (callback: SubscribeCallback) => SubscribeCleanup;

export type ChangeEmitter = () => void;
export type ChangeEmitterWithKey = (key: StoreNodeKey) => void;

export type StoreNode<T> = {
  key: StoreNodeKey;
  value: T;
  _subscribers: Set<SubscribeCallback>;
  onChange: OnChangeHandler;
  emitChange: ChangeEmitter;
};

export type Store = {
  onChange: OnChangeHandler;
  emitChange: ChangeEmitter;
  emitSelectorChange: ChangeEmitterWithKey;
  registerNode: <T>(node: StoreNode<T>) => void;
  registerSelectorNode: <T>(selectorNode: SelectorNode<T>, onReady: () => void) => Promise<void>;
  getNode: <T>(key: StoreNodeKey) => StoreNode<T> | undefined;
  getSelectorNode: <T>(key: StoreNodeKey) => SelectorNode<T> | undefined;
  _global_subscribers: Set<SubscribeCallback>;
  _nodes: Map<StoreNodeKey, StoreNode<any>>;
  _selectors: Map<StoreNodeKey, SelectorNode<any>>;
};
export type InternalStore = Pick<Store, "_nodes" | "_selectors" | "_global_subscribers">;
export type StoreRef = {
  current: Store;
};

export type SelectorGetter<T> = (node: StoreNode<T>) => T;
export type Selector<T> = ({ get }: { get: <U>(node: StoreNode<U>) => U }) => T | Promise<T>;
export type SelectorNode<T> = {
  key: StoreNodeKey;
  selector: Selector<T>;
  value: T;
  currentlyLoadingCount: number;
  isLoading: boolean;
  _dependencies: Set<StoreNodeKey>;
  _subscribers: Set<SubscribeCallback>;
  onChange: OnChangeHandler;
  emitChange: ChangeEmitter;
};
