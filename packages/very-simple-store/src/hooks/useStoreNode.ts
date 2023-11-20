import type { StoreNode } from "../types";
import { getReducerValue } from "../utils/value";

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

export const useStoreNodeSetter = <T>(node: StoreNode<T>) => {
  const storeRef = useStoreRef();
  useStoreNodeInitialize_INTERNAL_USE_ONLY(node);

  return React.useCallback(
    (value: T | ((prev: T) => T)) => {
      if (!node) {
        return;
      }

      const store = storeRef.current;
      store.registerNode(node);

      const storeNode = store.getNode<T>(node.key);

      if (!storeNode) {
        throw new Error(`Node ${JSON.stringify(node.key)} is not registered in store`);
      }

      const resolvedValue = getReducerValue(value, storeNode.value);

      if (resolvedValue === storeNode.value) {
        // update only if value is changed
        return;
      }

      storeNode.value = resolvedValue;
      storeNode.emitChange();

      store.emitSelectorChange(node.key);
      store.emitChange();
    },
    [node, storeRef],
  );
};

export const useStoreNode = <T = unknown>(node: StoreNode<T>): [T, ReturnType<typeof useStoreNodeSetter<T>>] => [
  useStoreNodeGetter<T>(node),
  useStoreNodeSetter<T>(node),
];
