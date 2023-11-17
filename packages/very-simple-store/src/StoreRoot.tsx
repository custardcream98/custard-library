import type { Store, StoreRef } from "./types";

import React from "react";

const DEFAULT_STORE: Store = {
  _global_subscribers: new Set(),
  _nodes: new Map(),
  _selectors: new Map(),
};

export const StoreRefContext = React.createContext<StoreRef>({
  current: DEFAULT_STORE,
});

export function StoreRoot({ children }: React.PropsWithChildren) {
  const storeRef = React.useRef<Store>(DEFAULT_STORE);

  return <StoreRefContext.Provider value={storeRef}>{children}</StoreRefContext.Provider>;
}
