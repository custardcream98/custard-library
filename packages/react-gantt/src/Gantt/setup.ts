import type { GanttOptions, Task, TaskInternal, TaskInternalDateResolved, ViewMode } from "../_types";
import { getManipulateUnitFromViewMode } from "../utils/dayjs";

import dayjs, { Dayjs, ManipulateType } from "dayjs";

const DEFAULT_WIDTH: Record<ViewMode, number> = {
  month: 58,
  week: 64,
  year: 52,
};
const DEFAULT_VIEWMODE: ViewMode = "month";
const DEFAULT_OPTIONS: GanttOptions = {
  columnWidth: DEFAULT_WIDTH[DEFAULT_VIEWMODE],
  viewMode: DEFAULT_VIEWMODE,
};
export const setupOptions = (options: Partial<GanttOptions>): GanttOptions => {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
  };
};

const DEFAULT_TASK = {
  name: "task",
  progress: 0,
};
const setupTask = ({ startDate, endDate, id, ...task }: Partial<Task>): TaskInternalDateResolved => {
  if (!id) {
    throw new Error("Task must have an id");
  }

  return {
    ...DEFAULT_TASK,
    ...task,
    endDate: dayjs(endDate),
    id,
    startDate: dayjs(startDate),
  };
};
const setupTaskDependencies = (tasks: TaskInternalDateResolved[], task: TaskInternalDateResolved): TaskInternal => {
  if (!task.dependencies) {
    return { ...task, dependencies: [] };
  }

  if (!Array.isArray(task.dependencies)) {
    throw new Error(`Task ${task.id} has a dependencies property that is not an array`);
  }

  if (task.id in task.dependencies) {
    throw new Error(`Task ${task.id} has a dependency on itself`);
  }

  const dependencies = task.dependencies.map((dependencyId) => {
    const dependency = tasks.find((task) => task.id === dependencyId);
    if (!dependency) {
      throw new Error(`Task ${task.id} has a dependency on ${dependencyId} but it does not exist`);
    }

    return dependency as unknown as TaskInternal;
  });

  return {
    ...task,
    dependencies,
  };
};
const setupTasksDependencies = (tasks: TaskInternalDateResolved[]): TaskInternal[] => {
  return tasks.map((task) => setupTaskDependencies(tasks, task));
};
export const setupTasks = (tasks: Partial<Task>[]): TaskInternal[] => {
  const tasksWithDates = tasks.map(setupTask);
  const tasksWithDependencies = setupTasksDependencies(tasksWithDates);
  return tasksWithDependencies;
};

const findFirstStartTaskIndex = (tasks: TaskInternal[]) => {
  const firstStartTaskIndex = tasks.findIndex((task) => {
    return tasks.every((otherTask) => {
      if (task.id === otherTask.id) {
        return true;
      }

      return task.startDate.isBefore(otherTask.startDate);
    });
  });

  return firstStartTaskIndex;
};
const findLastEndTaskIndex = (tasks: TaskInternal[]) => {
  const lastEndTaskIndex = tasks.findIndex((task) => {
    return tasks.every((otherTask) => {
      if (task.id === otherTask.id) {
        return true;
      }

      return task.endDate.isAfter(otherTask.endDate);
    });
  });

  return lastEndTaskIndex;
};
const getDates = (startDate: Dayjs, endDate: Dayjs, unit: ManipulateType) => {
  const dates = [];
  let currentDate = startDate;
  while (currentDate.isBefore(endDate)) {
    dates.push(currentDate);
    currentDate = currentDate.add(1, unit);
  }

  return dates;
};
export const setupDatesInRange = (tasks: TaskInternal[], viewMode: ViewMode) => {
  const firstStartTaskIndex = findFirstStartTaskIndex(tasks);
  const lastEndTaskIndex = findLastEndTaskIndex(tasks);

  if (firstStartTaskIndex === -1 || lastEndTaskIndex === -1) {
    return [];
  }

  const firstStartDate = tasks[firstStartTaskIndex].startDate;
  const lastEndDate = tasks[lastEndTaskIndex].endDate;

  const manipulateUnit = getManipulateUnitFromViewMode(viewMode);

  const dates = getDates(firstStartDate, lastEndDate, manipulateUnit);

  return dates;
};

export const setupGanttHeaderSecondRowLabels = (datesInRange: Dayjs[], viewMode: ViewMode) => {
  return datesInRange.map((date) => {
    if (viewMode === "year") {
      return date.format("M");
    } else if (viewMode === "month") {
      return date.format("D");
    } else {
      return date.format("d D");
    }
  });
};

const FIRST_ROW_FORMAT: Record<ViewMode, string> = {
  month: "YYYY MMM",
  week: "MMM D",
  year: "YYYY",
};
const groupByViewMode = (datesInRange: Dayjs[], viewMode: ViewMode) => {
  return datesInRange.reduce<{ labels: string[]; count: number[] }>(
    (acc, date) => {
      const label = date.format(FIRST_ROW_FORMAT[viewMode]);
      const labelIndex = acc.labels.findIndex((l) => l === label);

      if (labelIndex === -1) {
        return {
          count: [...acc.count, 1],
          labels: [...acc.labels, label],
        };
      }

      return {
        count: [...acc.count.slice(0, labelIndex), acc.count[labelIndex] + 1, ...acc.count.slice(labelIndex + 1)],
        labels: acc.labels,
      };
    },
    {
      count: [],
      labels: [],
    },
  );
};
export const setupGanttHeaderFirstRowLabels = (
  datesInRange: Dayjs[],
  viewMode: ViewMode,
  columnWidth: GanttOptions["columnWidth"],
) => {
  const { labels, count } = groupByViewMode(datesInRange, viewMode);

  return labels.map((label, index) => {
    return {
      label,
      width: count[index] * columnWidth,
    };
  });
};
