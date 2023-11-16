import { StoreRefContext } from "./StoreRoot";
import type { Store, StoreNode } from "./types";

import React, { useCallback } from "react";

const useForceUpdate = () => {
  // eslint-disable-next-line react/hook-use-state
  const [, setState] = React.useState({});
  return useCallback(() => setState({}), []);
};

const useStoreNodeInitializeInternal = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);

  React.useEffect(() => {
    const store = storeRef.current;

    if (!store._nodes.has(node.key)) {
      store._nodes.set(node.key, node);
    }
  }, [node, storeRef]);
};

const useStoreNodeAddSubscribeInternal = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    const store = storeRef.current;

    store._nodes.get(node.key)?.subscribers.add(forceUpdate);

    return () => {
      store._nodes.get(node.key)?.subscribers.delete(forceUpdate);
    };
  }, [forceUpdate, node, storeRef]);
};

export const useStoreNodeValue = <T>(node: StoreNode<T>): T => {
  const storeRef = React.useContext(StoreRefContext);

  useStoreNodeInitializeInternal(node);
  useStoreNodeAddSubscribeInternal(node);

  return (storeRef.current._nodes.get(node.key)?.value as T) ?? node.value;
};

const isReducer = <T>(value: T | ((prev: T) => T)): value is (prev: T) => T => {
  return typeof value === "function";
};

const getResolvedValue = <T>(value: T | ((prev: T) => T), prevValue: T): T => {
  return isReducer(value) ? value(prevValue) : value;
};

export const useStoreNodeSetter = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);
  useStoreNodeInitializeInternal(node);

  return React.useCallback(
    (value: T | ((prev: T) => T)) => {
      if (!node) {
        return;
      }

      const store = storeRef.current;

      if (!store._nodes.has(node.key)) {
        store._nodes.set(node.key, node);
      }

      // const resolveSelectors = (store: Store) => {
      //   store._selectors.forEach((selectorNode) => {
      //     if (selectorNode.dependencies.has(node.key)) {
      //       selectorNode.dependenciesPrevValues.get(node.key);
      //     }
      //   });
      // };

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
