import type { GanttOptions, Task } from "../_types";

import { GanttBarLayout } from "./GanttLayout/GanttBarLayout";
import { GanttHeader } from "./GanttHeader";
import { GanttOptionProvider } from "./GanttOptionProvider";
import { setupDatesInRange, setupOptions, setupTasks } from "./setup";

import style from "./Gantt.module.scss";

import React, { useMemo } from "react";

type GanttProps = Partial<GanttOptions> & {
  tasks?: Partial<Task>[];
};
export function Gantt({ tasks = [], ...options }: GanttProps) {
  const resolvedOptions = useMemo(() => setupOptions(options), [options]);

  const resolvedTasks = useMemo(() => setupTasks(tasks), [tasks]);

  const datsInRange = useMemo(
    () => setupDatesInRange(resolvedTasks, resolvedOptions.viewMode),
    [resolvedOptions.viewMode, resolvedTasks],
  );

  const chartWidth = resolvedOptions.columnWidth * datsInRange.length;

  return (
    <div className={style.outerWrapper}>
      <GanttOptionProvider options={resolvedOptions}>
        <GanttBarLayout layoutWidth={chartWidth}>
          <GanttHeader datsInRange={datsInRange} />
        </GanttBarLayout>
      </GanttOptionProvider>
    </div>
  );
}
