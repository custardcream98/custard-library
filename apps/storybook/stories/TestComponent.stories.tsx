import { TestComponent } from "@custardcream/react-gantt";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TestComponent> = {
  component: TestComponent,
};

export default meta;
type Story = StoryObj<typeof TestComponent>;

export const Primary: Story = {};
