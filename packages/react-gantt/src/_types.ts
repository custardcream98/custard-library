import { type Dayjs } from "dayjs";

export type ViewMode = "week" | "month" | "year";
export interface GanttOptions {
  columnWidth: number;
  viewMode: ViewMode;
}

export type Task = {
  id: string;
  name: string;
  startDate: Dayjs | Date | string | number;
  endDate: Dayjs | Date | string | number;
  progress?: number;
  dependencies?: string[];
};
export type TaskInternalDateResolved = Omit<Task, "startDate" | "endDate"> & {
  startDate: Dayjs;
  endDate: Dayjs;
};
export type TaskInternal = Omit<TaskInternalDateResolved, "dependencies"> & {
  dependencies: TaskInternal[];
};
