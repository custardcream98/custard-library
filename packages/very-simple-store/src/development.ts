import { StoreRefContext } from "./StoreRoot";

import React, { useCallback } from "react";

export const useCurrentStoreState_ONLY_FOR_DEVELOPMENT = () => {
  const storeRef = React.useContext(StoreRefContext);

  return useCallback(() => {
    return storeRef.current;
  }, [storeRef]);
};
