"use client";

import {
  addStoreNode,
  addStoreSelectorNode,
  StoreRoot,
  useStoreNode,
  useStoreSelectorNode,
} from "@custardcream/very-simple-store";
import React from "react";
import { useRenderBlink } from "./useRenderBlink";

import style from "./Sample.module.scss";
import { StoreViewer } from "./StoreViewer";

export function AsyncSample() {
  return (
    <StoreRoot>
      <StoreViewer />
      <div className={style.wrapper}>
        <div className={style.title}>Sample (버튼을 눌러보세요)</div>
        <div className={style.sampleWrapper}>
          <Children1 />
          <Children2 />
        </div>
      </div>
    </StoreRoot>
  );
}

const storeNode = addStoreNode({
  initialState: 0,
  key: "storeNode",
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const asyncSelectorNode = addStoreSelectorNode({
  key: "asyncSelectorNode",
  selector: async ({ get }) => {
    const testState = get(storeNode);

    await wait(2000);

    return testState + 1;
  },
});

const Children1 = () => {
  const [value, setValue] = useStoreNode(storeNode);
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
      <div>Children1</div>
      <button type="button" className={style.sampleButton} onClick={() => setValue((prev) => prev + 1)}>
        Increment Button
      </button>
      <div>storeNode: {value}</div>
    </div>
  );
};

const Children2 = () => {
  const { value, isLoading, currentlyLoadingCount } = useStoreSelectorNode(asyncSelectorNode);
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
        currentlyLoadingCount: {currentlyLoadingCount}
      </div>
      <div
        style={{
          marginTop: "10px",
        }}
      >
        isLoading: {JSON.stringify(isLoading)}
      </div>
      <div
        style={{
          marginTop: "10px",
        }}
      >
        asyncSelectorNode: {value}
      </div>
    </div>
  );
};
