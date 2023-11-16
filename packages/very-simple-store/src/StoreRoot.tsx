import type { Store, StoreRef } from "./types";

import React from "react";

const DEFAULT_STORE: Store = {
  _nodes: new Map(),
  _selectors: new Set(),
};

export const StoreRefContext = React.createContext<StoreRef>({
  current: DEFAULT_STORE,
});

export function StoreRoot({ children }: React.PropsWithChildren) {
  const storeRef = React.useRef<Store>(DEFAULT_STORE);

  return <StoreRefContext.Provider value={storeRef}>{children}</StoreRefContext.Provider>;
}
