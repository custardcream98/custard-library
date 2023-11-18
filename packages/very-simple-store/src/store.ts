import { getNodeValue } from "./utils/value";
import type { Store, StoreNodeKey } from "./types";

export const createStore = (): Store => ({
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
    // emit change to all subscribers
    this._global_subscribers.forEach((callback) => callback());
  },
  emitSelectorChange(key) {
    // emit change to all selector nodes
    this._selectors.forEach((selectorNode) => {
      if (!selectorNode._dependencies.has(key)) {
        return;
      }

      const resolvedValue = selectorNode.selector({
        get: (node) => {
          return getNodeValue(this, node);
        },
      });

      selectorNode.value = resolvedValue;

      selectorNode.emitChange();
    });
  },
  onChange(callback) {
    this._global_subscribers.add(callback);
    return () => this._global_subscribers.delete(callback);
  },
});
