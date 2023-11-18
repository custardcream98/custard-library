"use client";

import {
  addStoreNode,
  addStoreSelectorNode,
  StoreRoot,
  useStoreNode,
  useStoreNodeGetter,
  useStoreSelectorNode,
} from "@custardcream/very-simple-store";
import React from "react";
import { useRenderBlink } from "./useRenderBlink";

import style from "./Sample.module.scss";
import { StoreViewer } from "./StoreViewer";

export function Sample() {
  return (
    <StoreRoot>
      <StoreViewer />
      <div className={style.wrapper}>
        <div className={style.title}>Sample (버튼을 눌러보세요)</div>
        <div className={style.sampleWrapper}>
          <Children1 />
          <Children3 />
          <Children4 />
          <SelectorDisplay />
        </div>
      </div>
    </StoreRoot>
  );
}

const testCounter1Node = addStoreNode({
  initialState: 0,
  key: "testCounter1",
});

const testCounter2Node = addStoreNode({
  initialState: 10,
  key: "testCounter2",
});

const sumSelectorNode = addStoreSelectorNode({
  key: "testCounterSum",
  selector: ({ get }) => {
    const testCounter = get(testCounter1Node);
    const testCounter2 = get(testCounter2Node);
    return testCounter + testCounter2;
  },
});

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
  const value = useStoreNodeGetter(testCounter1Node);
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
      <div
        style={{
          marginTop: "10px",
        }}
      >
        testCounter1: {value}
      </div>
    </div>
  );
};

const Children3 = () => {
  const [value, setValue] = useStoreNode(testCounter1Node);
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
      <button type="button" className={style.sampleButton} onClick={() => setValue((prev) => prev + 1)}>
        Increment Button
      </button>
      <div>testCounter1: {value}</div>
    </div>
  );
};

const Children4 = () => {
  const [value, setValue] = useStoreNode(testCounter2Node);
  const ref = React.useRef<HTMLDivElement>(null);
  useRenderBlink(ref);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: "lightcoral",
        padding: "10px",
      }}
    >
      <div>Children4</div>
      <button type="button" className={style.sampleButton} onClick={() => setValue((prev) => prev + 1)}>
        Increment Button
      </button>
      <div>testCounter2: {value}</div>
    </div>
  );
};

const SelectorDisplay = () => {
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
      <div
        style={{
          marginBottom: "10px",
        }}
      >
        SelectorDisplay
      </div>
      selectorValue: {sum}
    </div>
  );
};
