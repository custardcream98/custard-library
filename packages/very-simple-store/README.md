# @custardcream/react-virtual

React로 Virtual Scroll을 구현하도록 도와주는 라이브러리

```tsx
const DATA = [
  {
    id: 1,
    content: "react",
  },
  {
    id: 2,
    content: "virtual",
  },
];

const App = () => {
  const { virtualItems, containerProps, wrapperProps } = useVirtual({
    data: DATA,
    itemHeight: 100, // 각 아이템의 높이, px
    containerHeight: 500, // 컨테이너의 높이, px
    overscan: 5, // 미리 렌더링할 아이템의 개수
  });

  return (
    <div {...containerProps}>
      <div {...wrapperProps}>
        {virtualItems.map((item) => (
          <div key={item.id} style={{ height: 100 }}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};
```
