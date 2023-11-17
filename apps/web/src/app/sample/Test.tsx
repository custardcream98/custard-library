"use client";

import {
  addStoreNode,
  addStoreSelectorNode,
  StoreRoot,
  useCurrentStoreState_ONLY_FOR_DEVELOPMENT,
  useStoreNode,
  useStoreNodeGetter,
  useStoreSelectorNode,
} from "@custardcream/very-simple-store";
import React from "react";

const useRenderBlink = (ref: React.RefObject<HTMLElement>) => {
  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.outline = "2px solid orange";
    }

    setTimeout(() => {
      if (ref.current) {
        ref.current.style.outline = "none";
      }
    }, 500);
  });
};

const node = addStoreNode({
  initialState: 0,
  key: "testCounter",
});

export function Test() {
  return (
    <StoreRoot>
      <StoreViewer />
      <Children1></Children1>
      <Children3 />
      <NodeSum />
    </StoreRoot>
  );
}

function StoreViewer() {
  const store = useCurrentStoreState_ONLY_FOR_DEVELOPMENT();

  return (
    <div
      style={{
        backgroundColor: "lightyellow",
        margin: "20px 0",
        padding: "10px",
      }}
    >
      <div>Store의 현재 상태</div>
      <div>{JSON.stringify(store)}</div>
    </div>
  );
}

const Children1 = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  useRenderBlink(ref);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "lightblue",
        padding: "10px",
      }}
    >
      Children1
      <Children2 />
    </div>
  );
};

const Children2 = () => {
  const value = useStoreNodeGetter(node);
  const ref = React.useRef<HTMLDivElement>(null);
  useRenderBlink(ref);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "lightpink",
        padding: "10px",
      }}
    >
      Children2
      <div>value: {value}</div>
    </div>
  );
};

const Children3 = () => {
  const [value, setValue] = useStoreNode(node);
  const ref = React.useRef<HTMLDivElement>(null);
  useRenderBlink(ref);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "lightgreen",
        padding: "10px",
      }}
    >
      <div>Children3</div>
      <button onClick={() => setValue((prev) => prev + 1)}>Increment</button>
      <div>value: {value}</div>
    </div>
  );
};

const node2 = addStoreNode({
  initialState: 10,
  key: "testCounter2",
});
const sumSelectorNode = addStoreSelectorNode({
  key: "testCounterSum",
  selector: ({ get }) => {
    const testCounter = get(node);
    const testCounter2 = get(node2);
    return testCounter + testCounter2;
  },
});
const NodeSum = () => {
  const sum = useStoreSelectorNode(sumSelectorNode);
  const ref = React.useRef<HTMLDivElement>(null);
  useRenderBlink(ref);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "ivory",
        padding: "10px",
      }}
    >
      selectorValue: {sum}
    </div>
  );
};
