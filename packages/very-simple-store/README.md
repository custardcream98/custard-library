# @custardcream/very-simple-store

간단한 방법으로 구현한 React 전역 상태 관리 라이브러리입니다.

```tsx
import { addStoreNode, StoreRoot, useStoreNode, useStoreNodeValue } from "@custardcream/very-simple-store";

const node = addStoreNode({
  initialState: 0,
  key: "testCounter",
});

export function Test() {
  return (
    <StoreRoot>
      <Children1></Children1>
      <Children3 />
    </StoreRoot>
  );
}

const Children1 = () => {
  return (
    <div
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
  const value = useStoreNodeValue(node);

  return (
    <div
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

  return (
    <div
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
```
