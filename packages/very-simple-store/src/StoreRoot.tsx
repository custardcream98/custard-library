import { getNodeValue } from "./utils/value";
import type { Store, StoreNodeKey, StoreRef } from "./types";

import React from "react";

const DEFAULT_STORE: Store = {
  _getNode(key) {
    return this._nodes.get(key);
  },
  _getSelectorNode(key) {
    return this._selectors.get(key);
  },
  _global_subscribers: new Set(),
  _nodes: new Map(),
  _registerNode(node) {
    if (!this._nodes.has(node.key)) {
      this._nodes.set(node.key, node);
    }
  },
  _registerSelectorNode(selectorNode) {
    if (this._selectors.has(selectorNode.key)) {
      return;
    }
    const dependencies = new Set<StoreNodeKey>();
    this._selectors.set(selectorNode.key, selectorNode);

    selectorNode.value = selectorNode.selector({
      get: (node) => {
        dependencies.add(node.key);

        return getNodeValue(this, node);
      },
    });

    selectorNode._dependencies = dependencies;

    this._selectors.set(selectorNode.key, selectorNode);
  },
  _selectors: new Map(),
  _unregisterNode(key) {
    this._nodes.delete(key);
  },
  _unregisterSelectorNode(key) {
    this._selectors.delete(key);
  },
  emitChange() {
    this._global_subscribers.forEach((callback) => callback());
  },
  onChange(callback) {
    this._global_subscribers.add(callback);
    return () => this._global_subscribers.delete(callback);
  },
};

export const StoreRefContext = React.createContext<StoreRef>({
  current: DEFAULT_STORE,
});

export function StoreRoot({ children }: React.PropsWithChildren) {
  const storeRef = React.useRef<Store>(DEFAULT_STORE);

  return <StoreRefContext.Provider value={storeRef}>{children}</StoreRefContext.Provider>;
}
