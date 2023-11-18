import type { Store, StoreNode } from "../types";
import { getNodeValue, getReducerValue } from "../utils/value";

import { useStoreNodeAddSubscribe_INTERNAL_USE_ONLY } from "./useStoreNodeAddSubscribe";
import { useStoreNodeInitialize_INTERNAL_USE_ONLY } from "./useStoreNodeInitialize";
import { useStoreRef } from "./useStoreRef";

import React from "react";

export const useStoreNodeGetter = <T>(node: StoreNode<T>): T => {
  const storeRef = useStoreRef();

  useStoreNodeInitialize_INTERNAL_USE_ONLY(node);
  useStoreNodeAddSubscribe_INTERNAL_USE_ONLY(node);

  return (storeRef.current._nodes.get(node.key)?.value as T) ?? node.value;
};

const resolveSelectors = <T>(store: Store, updatedNode: StoreNode<T>) => {
  store._selectors.forEach((selectorNode) => {
    if (!selectorNode._dependencies.has(updatedNode.key)) {
      return;
    }

    const resolvedValue = selectorNode.selector({
      get: (node) => {
        return getNodeValue(store, node);
      },
    });

    selectorNode.value = resolvedValue;

    selectorNode.emitChange();
  });
};

export const useStoreNodeSetter = <T>(node: StoreNode<T>) => {
  const storeRef = useStoreRef();
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
        const resolvedValue = getReducerValue(value, node.value);
        const newNode = {
          ...node,
          value: resolvedValue,
        };
        store._nodes.set(node.key, newNode);
      } else {
        const prevNode = store._nodes.get(node.key) as StoreNode<T>;
        const resolvedValue = getReducerValue(value, prevNode.value);

        if (prevNode.value !== resolvedValue) {
          // update only if value is changed
          const newNode = {
            ...node,
            value: resolvedValue,
          };
          store._nodes.set(node.key, newNode);
          prevNode.emitChange();

          resolveSelectors(store, newNode);
          store.emitChange();
        }
      }
    },
    [node, storeRef],
  );
};

export const useStoreNode = <T = unknown>(node: StoreNode<T>): [T, ReturnType<typeof useStoreNodeSetter<T>>] => [
  useStoreNodeGetter<T>(node),
  useStoreNodeSetter<T>(node),
];
