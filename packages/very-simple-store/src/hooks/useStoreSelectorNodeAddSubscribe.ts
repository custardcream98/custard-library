import type { SelectorNode } from "../types";

import { useForceUpdate } from "./useForceUpdate";
import { useStoreRef } from "./useStoreRef";

import React from "react";

export const useStoreSelectorNodeAddSubscribe_INTERNAL_USE_ONLY = <T>(selectorNode: SelectorNode<T>) => {
  const storeRef = useStoreRef();
  const forceUpdate = useForceUpdate();

  React.useLayoutEffect(() => {
    const store = storeRef.current;
    const storeNode = store._getNode(selectorNode.key);

    if (!storeNode) {
      return;
    }

    const cleanup = storeNode.onChange(forceUpdate);

    return cleanup;
  }, [forceUpdate, selectorNode, storeRef]);
};
