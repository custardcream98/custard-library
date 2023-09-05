import type { GanttOptions, Task } from "../_types";

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
    <GanttOptionProvider options={resolvedOptions}>
      <div className={style.outerWrapper}>
        <div
          style={{
            width: chartWidth,
          }}
        >
          <GanttHeader datsInRange={datsInRange} />
        </div>
      </div>
    </GanttOptionProvider>
  );
}
