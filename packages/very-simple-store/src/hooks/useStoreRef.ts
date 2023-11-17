import { StoreRefContext } from "../StoreRoot";

import React from "react";

export const useStoreRef = () => {
  const storeRef = React.useContext(StoreRefContext);

  return storeRef;
};
