import type { SelectorNode } from "../types";
import { getNodeValue } from "../utils/value";

import { useStoreRef } from "./useStoreRef";
import { useStoreSelectorNodeAddSubscibe_INTERNAL_USE_ONLY } from "./useStoreSelectorNodeAddSubscibe";
import { useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY } from "./useStoreSelectorNodeInitialize";

export const useStoreSelectorNode = <T>(selectorNode: SelectorNode<T>): T => {
  const storeRef = useStoreRef();

  useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY(selectorNode);
  useStoreSelectorNodeAddSubscibe_INTERNAL_USE_ONLY(selectorNode);

  return (
    (storeRef.current._selectors.get(selectorNode.key)?.value as T) ??
    selectorNode.selector({
      get: (node) => {
        return getNodeValue(storeRef.current, node);
      },
    })
  );
};