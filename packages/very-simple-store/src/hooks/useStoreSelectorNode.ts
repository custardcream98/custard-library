import type { SelectorNode } from "../types";

import { useStoreRef } from "./useStoreRef";
import { useStoreSelectorNodeAddSubscribe_INTERNAL_USE_ONLY } from "./useStoreSelectorNodeAddSubscribe";
import { useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY } from "./useStoreSelectorNodeInitialize";

export const useStoreSelectorNode = <T>(selectorNode: SelectorNode<T>): T | undefined => {
  const storeRef = useStoreRef();

  useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY(selectorNode);
  useStoreSelectorNodeAddSubscribe_INTERNAL_USE_ONLY(selectorNode);

  const currentNode = storeRef.current._getSelectorNode<T>(selectorNode.key);

  if (currentNode) {
    return currentNode.value;
  }
};
