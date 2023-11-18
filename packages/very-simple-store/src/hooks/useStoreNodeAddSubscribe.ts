import type { StoreNode } from "../types";

import { useForceUpdate } from "./useForceUpdate";
import { useStoreRef } from "./useStoreRef";

import React from "react";

export const useStoreNodeAddSubscribe_INTERNAL_USE_ONLY = <T>(node: StoreNode<T>) => {
  const storeRef = useStoreRef();
  const forceUpdate = useForceUpdate();

  React.useLayoutEffect(() => {
    const store = storeRef.current;
    const storeNode = store._getNode(node.key);

    if (!storeNode) {
      return;
    }

    const cleanup = storeNode.onChange(forceUpdate);

    return cleanup;
  }, [forceUpdate, node, storeRef]);
};
