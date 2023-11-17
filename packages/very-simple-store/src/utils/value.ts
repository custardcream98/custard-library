import type { Store, StoreNode } from "../types";

import { isReducer } from "./typeHelpers";

export const getReducerValue = <T>(value: T | ((prev: T) => T), prevValue: T): T => {
  return isReducer(value) ? value(prevValue) : value;
};

export const getNodeValue = <T>(store: Store, node: StoreNode<T>): T => {
  const existingNode = store._nodes.get(node.key);

  if (existingNode) {
    return existingNode.value as T;
  }

  store._nodes.set(node.key, node);
  return node.value;
};
