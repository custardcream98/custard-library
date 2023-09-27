import React from "react";

type GanttBarLayoutProps = React.PropsWithChildren<{
  layoutWidth: number;
}>;
export function GanttBarLayout({ layoutWidth, children }: GanttBarLayoutProps) {
  return (
    <div
      style={{
        width: layoutWidth,
      }}
    >
      {children}
    </div>
  );
}
