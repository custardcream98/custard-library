import { useGanttOptions } from "../GanttOptionProvider";
import { setupGanttHeaderFirstRowLabels, setupGanttHeaderSecondRowLabels } from "../setup";

import style from "./GanttHeader.module.scss";

import cn from "classnames";
import { type Dayjs } from "dayjs";
import React, { useMemo } from "react";

export function GanttHeader({ datsInRange }: { datsInRange: Dayjs[] }) {
  const { viewMode, columnWidth } = useGanttOptions();
  const isWeekView = viewMode === "week";

  const headerFirstRowLabels = useMemo(
    () => setupGanttHeaderFirstRowLabels(datsInRange, viewMode, columnWidth),
    [viewMode, columnWidth, datsInRange],
  );
  const headerSecondRowLabels = useMemo(
    () => setupGanttHeaderSecondRowLabels(datsInRange, viewMode),
    [viewMode, datsInRange],
  );

  return (
    <div>
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
        {headerSecondRowLabels.map((label, index) => {
          const date = datsInRange[index];
          const day = date.day();
          const isWeekend = day === 0 || day === 6;

          return (
            <div
              key={label}
              className={cn(style.headerSecondRowLabel, {
                [style["headerSecondRowLabel--weekend"]]: isWeekView && isWeekend,
              })}
              style={{
                width: columnWidth,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
