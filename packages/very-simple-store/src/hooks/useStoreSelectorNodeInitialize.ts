import type { SelectorNode } from "../types";

import { useStoreRef } from "./useStoreRef";

import React from "react";

export const useStoreSelectorNodeInitialize_INTERNAL_USE_ONLY = <T>(selectorNode: SelectorNode<T>) => {
  const storeRef = useStoreRef();

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    store._registerSelectorNode(selectorNode);
  }, [selectorNode, storeRef]);
};
