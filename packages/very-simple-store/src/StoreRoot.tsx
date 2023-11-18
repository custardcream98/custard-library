import { DEFAULT_STORE } from "./store";
import type { Store, StoreRef } from "./types";

import React from "react";

export const StoreRefContext = React.createContext<StoreRef>({
  current: DEFAULT_STORE,
});

export function StoreRoot({ children }: React.PropsWithChildren) {
  const storeRef = React.useRef<Store>(DEFAULT_STORE);

  return <StoreRefContext.Provider value={storeRef}>{children}</StoreRefContext.Provider>;
}
