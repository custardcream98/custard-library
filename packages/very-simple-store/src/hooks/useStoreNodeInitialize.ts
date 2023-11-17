import type { StoreNode } from "../types";

import { useStoreRef } from "./useStoreRef";

import React from "react";

export const useStoreNodeInitialize_INTERNAL_USE_ONLY = <T>(node: StoreNode<T>) => {
  const storeRef = useStoreRef();

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    if (!store._nodes.has(node.key)) {
      store._nodes.set(node.key, node);
    }
  }, [node, storeRef]);
};
