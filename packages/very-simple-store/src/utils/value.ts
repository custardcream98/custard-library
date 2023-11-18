import type { Store, StoreNode } from "../types";

import { isReducer } from "./typeHelpers";

export const getReducerValue = <T>(value: T | ((prev: T) => T), prevValue: T): T => {
  return isReducer(value) ? value(prevValue) : value;
};

export const getNodeValue = <T>(store: Store, node: StoreNode<T>): T => {
  const storeNode = store._getNode(node.key);

  if (storeNode) {
    return storeNode.value as T;
  }

  store._registerNode(node);

  return node.value;
};
