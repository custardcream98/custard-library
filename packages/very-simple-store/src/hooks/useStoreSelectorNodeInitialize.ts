import type { SelectorNode } from "../types";

import { useForceUpdate } from "./useForceUpdate";
import { useStoreRef } from "./useStoreRef";

import React from "react";

const isServer = typeof window === "undefined";

export const useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY = <T>(selectorNode: SelectorNode<T>) => {
  const storeRef = useStoreRef();
  const forceUpdate = useForceUpdate();

  React.useLayoutEffect(() => {
    if (isServer) {
      return;
    }

    const store = storeRef.current;

    store._registerSelectorNode(selectorNode, forceUpdate);
  }, [forceUpdate, selectorNode, storeRef]);
};
