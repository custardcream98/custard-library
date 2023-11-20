import type { InternalStore, SelectorNode, StoreNode, StoreNodeKey, SubscribeCleanup } from "../types";

const getNode = <T>(store: InternalStore, key: StoreNodeKey): StoreNode<T> | undefined => {
  return store._nodes.get(key);
};

const getSelectorNode = <T>(store: InternalStore, key: StoreNodeKey): SelectorNode<T> | undefined => {
  return store._selectors.get(key);
};

const getNodeValue = <T>(store: InternalStore, node: StoreNode<T>): T => {
  const storeNode = getNode(store, node.key);

  if (storeNode) {
    return storeNode.value as T;
  }

  registerNode(store, node);

  return node.value;
};

const emitGlobalChange = (store: InternalStore) => {
  store._global_subscribers.forEach((callback) => callback());
};

const registerNode = <T>(store: InternalStore, node: StoreNode<T>) => {
  if (!store._nodes.has(node.key)) {
    store._nodes.set(node.key, node);
    emitGlobalChange(store);
  }

  return () => store._nodes.delete(node.key);
};

const registerSelectorNode = async <T>(store: InternalStore, selectorNode: SelectorNode<T>, onReady: () => void) => {
  if (store._selectors.has(selectorNode.key)) {
    return;
  }
  const dependencies = new Set<StoreNodeKey>();
  store._selectors.set(selectorNode.key, selectorNode);

  const initialValue = selectorNode.selector({
    get: (node) => {
      dependencies.add(node.key);

      return getNodeValue(store, node);
    },
  });

  if (initialValue instanceof Promise) {
    const value = await initialValue;

    selectorNode.value = value;
    selectorNode._dependencies = dependencies;
    selectorNode.isLoading = false;

    store._selectors.set(selectorNode.key, selectorNode);

    emitGlobalChange(store);
    onReady();
    return;
  }

  selectorNode.value = initialValue;
  selectorNode._dependencies = dependencies;
  selectorNode.isLoading = false;

  store._selectors.set(selectorNode.key, selectorNode);
  onReady();
  return;
};

const emitSelectorChange = (store: InternalStore, key: StoreNodeKey) => {
  // emit change to all selector nodes
  store._selectors.forEach((selectorNode) => {
    if (!selectorNode._dependencies.has(key)) {
      return;
    }

    const resolvedValue = selectorNode.selector({
      get: (node) => {
        return getNodeValue(store, node);
      },
    });

    if (resolvedValue instanceof Promise) {
      selectorNode.isLoading = true;
      selectorNode.currentlyLoadingCount += 1;

      selectorNode.emitChange();
      emitGlobalChange(store);

      resolvedValue.then((value) => {
        selectorNode.value = value;
        selectorNode.currentlyLoadingCount -= 1;
        selectorNode.isLoading = selectorNode.currentlyLoadingCount !== 0;

        selectorNode.emitChange();
        emitGlobalChange(store);
      });

      return;
    }

    selectorNode.value = resolvedValue;
    selectorNode.isLoading = false;

    selectorNode.emitChange();
  });
};

const subscribeStore = (store: InternalStore, onChange: () => void): SubscribeCleanup => {
  store._global_subscribers.add(onChange);
  return () => store._global_subscribers.delete(onChange);
};

export {
  getNode,
  getSelectorNode,
  emitGlobalChange,
  emitSelectorChange,
  registerNode,
  registerSelectorNode,
  subscribeStore,
};
