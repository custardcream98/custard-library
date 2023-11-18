import { createStore } from "./store";
import type { Store, StoreRef } from "./types";

import React from "react";

export const StoreRefContext = React.createContext<StoreRef>({
  current: createStore(),
});

export function StoreRoot({ children }: React.PropsWithChildren) {
  const storeRef = React.useRef<Store>(createStore());

  return <StoreRefContext.Provider value={storeRef}>{children}</StoreRefContext.Provider>;
}
