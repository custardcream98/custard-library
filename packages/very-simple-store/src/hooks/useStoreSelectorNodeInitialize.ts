import type { SelectorNode, StoreNodeKey } from "../types";
import { getNodeValue } from "../utils/value";

import { useStoreRef } from "./useStoreRef";

import React from "react";

export const useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY = <T>(selectorNode: SelectorNode<T>) => {
  const storeRef = useStoreRef();

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    if (!store._selectors.has(selectorNode.key)) {
      const dependencies = new Set<StoreNodeKey>();
      selectorNode.value = selectorNode.selector({
        get: (node) => {
          dependencies.add(node.key);

          return getNodeValue(store, node);
        },
      });
      selectorNode.dependencies = dependencies;

      store._selectors.set(selectorNode.key, selectorNode);
    }
  }, [selectorNode, storeRef]);
};
