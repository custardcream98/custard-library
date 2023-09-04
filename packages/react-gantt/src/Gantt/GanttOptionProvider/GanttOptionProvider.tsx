import type { GanttOptions } from "../../_types";

import React from "react";

const GanttOptionContext = React.createContext<GanttOptions>({
  columnWidth: 32,
  viewMode: "week",
});

export function useGanttOptions() {
  return React.useContext(GanttOptionContext);
}

export function GanttOptionProvider({ children, options }: { children: React.ReactNode; options: GanttOptions }) {
  return <GanttOptionContext.Provider value={options}>{children}</GanttOptionContext.Provider>;
}
