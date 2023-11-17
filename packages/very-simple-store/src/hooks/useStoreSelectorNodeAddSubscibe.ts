import type { SelectorNode } from "../types";

import { useForceUpdate } from "./useForceUpdate";
import { useStoreRef } from "./useStoreRef";

import React from "react";

export const useStoreSelectorNodeAddSubscibe_INTERNAL_USE_ONLY = <T>(selectorNode: SelectorNode<T>) => {
  const storeRef = useStoreRef();
  const forceUpdate = useForceUpdate();

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    store._selectors.get(selectorNode.key)?.subscribers.add(forceUpdate);

    return () => {
      store._selectors.get(selectorNode.key)?.subscribers.delete(forceUpdate);
    };
  }, [forceUpdate, selectorNode, storeRef]);
};
