import type { StoreNode } from "./node";

import React from "react";

type Store = Map<string, StoreNode<any>>;
type StoreRef = {
  current: Store;
};

export const StoreRefContext = React.createContext<StoreRef>({
  current: new Map(),
});

export function StoreRoot({ children }: React.PropsWithChildren) {
  const storeRef = React.useRef<Store>(new Map());

  return <StoreRefContext.Provider value={storeRef}>{children}</StoreRefContext.Provider>;
}
