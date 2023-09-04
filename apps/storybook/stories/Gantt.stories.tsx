import { Gantt, Task } from "@custardcream/react-gantt";
import type { Meta, StoryObj } from "@storybook/react";

const TASKS: Task[] = [
  {
    endDate: new Date("2021-01-05"),
    id: "1",
    name: "Task 1",
    startDate: new Date("2021-01-01"),
  },
  {
    endDate: new Date("2021-01-10"),
    id: "2",
    name: "Task 2",
    startDate: new Date("2021-01-04"),
  },
  {
    endDate: new Date("2021-01-15"),
    id: "3",
    name: "Task 3",
    startDate: new Date("2021-01-08"),
  },
  {
    endDate: new Date("2021-01-20"),
    id: "4",
    name: "Task 4",
    startDate: new Date("2021-01-12"),
  },
  {
    endDate: new Date("2021-02-05"),
    id: "5",
    name: "Task 5",
    startDate: new Date("2021-01-25"),
  },
];

const meta: Meta<typeof Gantt> = {
  component: Gantt,
};

export default meta;
type Story = StoryObj<typeof Gantt>;

export const Primary: Story = {
  args: {
    tasks: TASKS,
  },
};
