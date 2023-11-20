import {
  emitGlobalChange,
  emitSelectorChange,
  getNode,
  getSelectorNode,
  registerNode,
  registerSelectorNode,
  subscribeStore,
} from "./utils/store";
import type { InternalStore, Store, StoreNodeKey } from "./types";

const createInternalStore = (): InternalStore => ({
  _global_subscribers: new Set(),
  _nodes: new Map(),
  _selectors: new Map(),
});

export const createStore = (): Store => {
  const store = createInternalStore();

  return {
    ...store,
    emitChange: emitGlobalChange.bind(null, store),
    emitSelectorChange: emitSelectorChange.bind(null, store),
    getNode: <T>(key: StoreNodeKey) => getNode<T>(store, key),
    getSelectorNode: <T>(key: StoreNodeKey) => getSelectorNode<T>(store, key),
    onChange: subscribeStore.bind(null, store),
    registerNode: registerNode.bind(null, store),
    registerSelectorNode: registerSelectorNode.bind(null, store),
  };
};
