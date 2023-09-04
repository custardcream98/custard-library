import type { GanttOptions, Task } from "../_types";

import { GanttOptionProvider } from "./GanttOptionProvider";
import {
  setupDatesInRange,
  setupGanttHeaderFirstRowLabels,
  setupGanttHeaderSecondRowLabels,
  setupOptions,
  setupTasks,
} from "./setup";

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

  const headerFirstRowLabels = useMemo(
    () => setupGanttHeaderFirstRowLabels(datsInRange, resolvedOptions.viewMode, resolvedOptions.columnWidth),
    [resolvedOptions.viewMode, resolvedOptions.columnWidth, datsInRange],
  );
  const headerSecondRowLabels = useMemo(
    () => setupGanttHeaderSecondRowLabels(datsInRange, resolvedOptions.viewMode),
    [resolvedOptions.viewMode, datsInRange],
  );

  const chartWidth = resolvedOptions.columnWidth * headerSecondRowLabels.length;

  return (
    <GanttOptionProvider options={resolvedOptions}>
      <div className={style.outerWrapper}>
        <div
          style={{
            width: chartWidth,
          }}
        >
          <div>
            {headerFirstRowLabels.map(({ label, width }) => {
              return (
                <div
                  key={label}
                  className={style.headerFirstRowLabelWrapper}
                  style={{
                    width,
                  }}
                >
                  <span className={style.headerFirstRowLabel}>{label}</span>
                </div>
              );
            })}
          </div>
          <div>
            {headerSecondRowLabels.map((label) => {
              return (
                <div
                  key={label}
                  className={style.headerSecondRowLabel}
                  style={{
                    width: resolvedOptions.columnWidth,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GanttOptionProvider>
  );
}
