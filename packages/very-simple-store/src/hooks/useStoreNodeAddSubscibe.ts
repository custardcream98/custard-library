import type { StoreNode } from "../types";

import { useForceUpdate } from "./useForceUpdate";
import { useStoreRef } from "./useStoreRef";

import React from "react";

export const useStoreNodeAddSubscribe_INTERNAL_USE_ONLY = <T>(node: StoreNode<T>) => {
  const storeRef = useStoreRef();
  const forceUpdate = useForceUpdate();

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    store._nodes.get(node.key)?.subscribers.add(forceUpdate);

    return () => {
      store._nodes.get(node.key)?.subscribers.delete(forceUpdate);
    };
  }, [forceUpdate, node, storeRef]);
};
