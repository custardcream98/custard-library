import { Test } from "./Test";

export default function Home() {
  return (
    <section>
      <h2>@custardcream/very-simple-store</h2>
      <p>매우 간단한 형태의 리액트 전역상태관리 라이브러리입니다.</p>
      <section>
        <h3>샘플 코드</h3>
        <pre>
          <code>
            {`import {
  addStoreNode,
  addStoreSelectorNode,
  StoreRoot,
  useStoreNode,
  useStoreNodeValue,
  useStoreSelectorNode,
} from "@custardcream/very-simple-store";

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

  return (
    <div
      style={{
        backgroundColor: "ivory",
        padding: "10px",
      }}
    >
      selectorValue: {sum}
    </div>
  );
};

`}
          </code>
        </pre>
      </section>
      <section>
        <h3>실행결과</h3>
        <p>버튼을 클릭하면 위의 숫자가 증가합니다.</p>
        <p>
          렌더링 확인을 위해 렌더된 컴포넌트에는{" "}
          <span
            style={{
              color: "orange",
            }}
          >
            주황색 outline
          </span>{" "}
          깜빡임이 추가됩니다.
        </p>
        <Test />
      </section>
    </section>
  );
}
