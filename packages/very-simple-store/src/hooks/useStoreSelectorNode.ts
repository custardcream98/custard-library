import type { SelectorNode } from "../types";

import { useStoreRef } from "./useStoreRef";
import { useStoreSelectorNodeAddSubscribe_INTERNAL_USE_ONLY } from "./useStoreSelectorNodeAddSubscribe";
import { useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY } from "./useStoreSelectorNodeInitialize";

export const useStoreSelectorNode = <T>(selectorNode: SelectorNode<T>) => {
  const storeRef = useStoreRef();

  useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY(selectorNode);
  useStoreSelectorNodeAddSubscribe_INTERNAL_USE_ONLY(selectorNode);

  const currentNode = storeRef.current.getSelectorNode<T>(selectorNode.key);

  if (currentNode) {
    return {
      currentlyLoadingCount: currentNode.currentlyLoadingCount,
      isLoading: currentNode.isLoading,
      value: currentNode.value,
    };
  }

  return { currentlyLoadingCount: 0, isLoading: true, value: undefined };
};
