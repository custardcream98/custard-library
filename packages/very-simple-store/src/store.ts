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
      this.emitChange();
    }
  },
  async _registerSelectorNode(selectorNode, onReady) {
    if (this._selectors.has(selectorNode.key)) {
      return;
    }
    const dependencies = new Set<StoreNodeKey>();
    this._selectors.set(selectorNode.key, selectorNode);

    const initialValue = selectorNode.selector({
      get: (node) => {
        dependencies.add(node.key);

        return getNodeValue(this, node);
      },
    });

    if (initialValue instanceof Promise) {
      const value = await initialValue;

      selectorNode.value = value;
      selectorNode._dependencies = dependencies;
      selectorNode.isLoading = false;

      this._selectors.set(selectorNode.key, selectorNode);

      this.emitChange();
      onReady();
      return;
    }

    selectorNode.value = initialValue;
    selectorNode._dependencies = dependencies;
    selectorNode.isLoading = false;

    this._selectors.set(selectorNode.key, selectorNode);
    onReady();
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

      if (resolvedValue instanceof Promise) {
        selectorNode.isLoading = true;
        selectorNode.currentlyLoadingCount += 1;

        selectorNode.emitChange();
        this.emitChange();

        resolvedValue.then((value) => {
          selectorNode.value = value;
          selectorNode.currentlyLoadingCount -= 1;
          selectorNode.isLoading = selectorNode.currentlyLoadingCount !== 0;

          selectorNode.emitChange();
          this.emitChange();
        });

        return;
      }

      selectorNode.value = resolvedValue;
      selectorNode.isLoading = false;

      selectorNode.emitChange();
    });
  },
  onChange(callback) {
    this._global_subscribers.add(callback);
    return () => this._global_subscribers.delete(callback);
  },
});
