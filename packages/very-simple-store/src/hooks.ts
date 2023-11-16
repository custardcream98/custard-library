import { StoreRefContext } from "./StoreRoot";
import type { SelectorNode, Store, StoreNode, StoreNodeKey } from "./types";

import React, { useCallback } from "react";

const useForceUpdate = () => {
  // eslint-disable-next-line react/hook-use-state
  const [, setState] = React.useState({});
  return useCallback(() => setState({}), []);
};

const useStoreNodeInitialize_INTERNAL_USE_ONLY = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    if (!store._nodes.has(node.key)) {
      store._nodes.set(node.key, node);
    }
  }, [node, storeRef]);
};

const useStoreNodeAddSubscribe_INTERNAL_USE_ONLY = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);
  const forceUpdate = useForceUpdate();

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    store._nodes.get(node.key)?.subscribers.add(forceUpdate);

    return () => {
      store._nodes.get(node.key)?.subscribers.delete(forceUpdate);
    };
  }, [forceUpdate, node, storeRef]);
};

export const useStoreNodeValue = <T>(node: StoreNode<T>): T => {
  const storeRef = React.useContext(StoreRefContext);

  useStoreNodeInitialize_INTERNAL_USE_ONLY(node);
  useStoreNodeAddSubscribe_INTERNAL_USE_ONLY(node);

  return (storeRef.current._nodes.get(node.key)?.value as T) ?? node.value;
};

const isReducer = <T>(value: T | ((prev: T) => T)): value is (prev: T) => T => {
  return typeof value === "function";
};

const getResolvedValue = <T>(value: T | ((prev: T) => T), prevValue: T): T => {
  return isReducer(value) ? value(prevValue) : value;
};

const selectorGetter = <T>(store: Store, node: StoreNode<T>) => {
  const actualNode = store._nodes.get(node.key);
  if (actualNode) {
    return actualNode.value as T;
  }

  store._nodes.set(node.key, node);
  return node.value;
};

const resolveSelectors = <T>(store: Store, updatedNode: StoreNode<T>) => {
  store._selectors.forEach((selectorNode) => {
    if (!selectorNode.dependencies.has(updatedNode.key)) {
      return;
    }

    const resolvedValue = selectorNode.selector({
      get: (node) => {
        return selectorGetter(store, node);
      },
    });

    selectorNode.value = resolvedValue;

    selectorNode.subscribers.forEach((callback) => callback());
  });
};

export const useStoreNodeSetter = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);
  useStoreNodeInitialize_INTERNAL_USE_ONLY(node);

  return React.useCallback(
    (value: T | ((prev: T) => T)) => {
      if (!node) {
        return;
      }

      const store = storeRef.current;

      if (!store._nodes.has(node.key)) {
        store._nodes.set(node.key, node);
      }

      const isFirstUpdate = !store._nodes.has(node.key);
      if (isFirstUpdate) {
        const resolvedValue = getResolvedValue(value, node.value);
        const newNode = {
          ...node,
          value: resolvedValue,
        };
        store._nodes.set(node.key, newNode);
      } else {
        const prevNode = store._nodes.get(node.key) as StoreNode<T>;
        const resolvedValue = getResolvedValue(value, prevNode.value);

        if (prevNode.value !== resolvedValue) {
          // update only if value is changed
          const newNode = {
            ...node,
            value: resolvedValue,
          };
          store._nodes.set(node.key, newNode);
          prevNode.subscribers.forEach((callback) => callback());

          resolveSelectors(store, newNode);
        }
      }
    },
    [node, storeRef],
  );
};

export const useStoreNode = <T = unknown>(node: StoreNode<T>): [T, ReturnType<typeof useStoreNodeSetter<T>>] => [
  useStoreNodeValue<T>(node),
  useStoreNodeSetter<T>(node),
];

const useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY = <T>(selectorNode: SelectorNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    if (!store._selectors.has(selectorNode.key)) {
      const dependencies = new Set<StoreNodeKey>();
      selectorNode.value = selectorNode.selector({
        get: (node) => {
          dependencies.add(node.key);

          return selectorGetter(store, node);
        },
      });
      selectorNode.dependencies = dependencies;

      store._selectors.set(selectorNode.key, selectorNode);
    }
  }, [selectorNode, storeRef]);
};

const useStoreSelectorNodeAddSubscibe_INTERNAL_USE_ONLY = <T>(selectorNode: SelectorNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);
  const forceUpdate = useForceUpdate();

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    store._selectors.get(selectorNode.key)?.subscribers.add(forceUpdate);

    return () => {
      store._selectors.get(selectorNode.key)?.subscribers.delete(forceUpdate);
    };
  }, [forceUpdate, selectorNode, storeRef]);
};

export const useStoreSelectorNode = <T>(selectorNode: SelectorNode<T>): T => {
  const storeRef = React.useContext(StoreRefContext);

  useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY(selectorNode);
  useStoreSelectorNodeAddSubscibe_INTERNAL_USE_ONLY(selectorNode);

  return (
    (storeRef.current._selectors.get(selectorNode.key)?.value as T) ??
    selectorNode.selector({
      get: (node) => {
        return selectorGetter(storeRef.current, node);
      },
    })
  );
};
