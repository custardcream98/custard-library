import { useVirtual } from "@custardcream/react-virtual";
import type { Meta, StoryObj } from "@storybook/react";

const DATA = Array.from({ length: 1000 }, (_, i) => ({
  content: `Item ${i}`,
  id: i,
}));

function App() {
  const { virtualItems, containerProps, wrapperProps } = useVirtual({
    containerHeight: 500,
    data: DATA,
    itemHeight: 100,
    overscan: 5,
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
}

const meta: Meta<typeof App> = {
  component: App,
};

export default meta;
type Story = StoryObj<typeof App>;

export const Primary: Story = {};
