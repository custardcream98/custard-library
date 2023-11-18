import { useForceUpdate } from "./hooks/useForceUpdate";
import { useStoreRef } from "./hooks";

import React from "react";

export const useCurrentStoreState_ONLY_FOR_DEVELOPMENT = () => {
  const storeRef = useStoreRef();
  const forceUpdate = useForceUpdate();

  React.useLayoutEffect(() => {
    const store = storeRef.current;

    const cleanup = store.onChange(forceUpdate);

    return cleanup;
  }, [storeRef, forceUpdate]);

  const store = {
    selectors: Object.fromEntries(storeRef.current._selectors.entries()),
    state: Object.fromEntries(storeRef.current._nodes.entries()),
  };

  return store;
};
