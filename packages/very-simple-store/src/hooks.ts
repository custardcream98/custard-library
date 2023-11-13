import type { StoreNode } from "./node";
import { StoreRefContext } from "./StoreRoot";

import React, { useCallback, useRef } from "react";

const useForceUpdate = () => {
  // eslint-disable-next-line react/hook-use-state
  const [, setState] = React.useState({});
  return useCallback(() => setState({}), []);
};

const useStoreNodeInitializeInternal = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);

  React.useEffect(() => {
    const store = storeRef.current;

    if (!store.has(node.key)) {
      store.set(node.key, node);
    }
  }, [node, storeRef]);
};

const useStoreNodeAddSubscribeInternal = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    const store = storeRef.current;

    store.get(node.key)?.subscribers.add(forceUpdate);

    return () => {
      store.get(node.key)?.subscribers.delete(forceUpdate);
    };
  }, [forceUpdate, node, storeRef]);
};

export const useStoreNodeValue = <T>(node: StoreNode<T>): T => {
  const storeRef = React.useContext(StoreRefContext);

  useStoreNodeInitializeInternal(node);
  useStoreNodeAddSubscribeInternal(node);

  return (storeRef.current.get(node.key)?.value as T) ?? node.value;
};

const isReducer = <T>(value: T | ((prev: T) => T)): value is (prev: T) => T => {
  return typeof value === "function";
};

export const useStoreNodeSetter = <T>(node: StoreNode<T>) => {
  const storeRef = React.useContext(StoreRefContext);
  useStoreNodeInitializeInternal(node);

  return React.useCallback(
    (value: T | ((prev: T) => T)) => {
      if (!node) {
        return;
      }

      const store = storeRef.current;
      const storedNode = store.get(node.key) as StoreNode<T>;
      const resolvedValue: T = isReducer(value) ? value(storedNode.value) : value;

      if (!storedNode) {
        store.set(node.key, {
          ...node,
          value: resolvedValue,
        });
      } else {
        storedNode.value = resolvedValue;
        storedNode.subscribers.forEach((callback) => callback());
        storedNode.selectors.forEach((callback) => callback(resolvedValue));
      }
    },
    [node, storeRef],
  );
};

export const useStoreNode = <T = unknown>(node: StoreNode<T>): [T, ReturnType<typeof useStoreNodeSetter<T>>] => [
  useStoreNodeValue<T>(node),
  useStoreNodeSetter<T>(node),
];

const useStoreNodeSelectorInternal = <T, R>(node: StoreNode<T>, selector: (value: T) => R) => {
  const storeRef = React.useContext(StoreRefContext);
  const forceUpdate = useForceUpdate();
  const prevValueRef = useRef(selector(node.value));

  React.useEffect(() => {
    const store = storeRef.current;

    const checkIfChanged = (newValue: T) => {
      const newSelectedValue = selector(newValue);
      if (newSelectedValue !== prevValueRef.current) {
        prevValueRef.current = newSelectedValue;
        forceUpdate();
      }
    };

    store.get(node.key)?.selectors.add(checkIfChanged);

    return () => {
      store.get(node.key)?.selectors.delete(checkIfChanged);
    };
  }, [forceUpdate, selector, node, storeRef]);

  return prevValueRef.current;
};

export const useStoreSelector = <T, R>(node: StoreNode<T>, selector: (value: T) => R): R => {
  return useStoreNodeSelectorInternal(node, selector);
};
