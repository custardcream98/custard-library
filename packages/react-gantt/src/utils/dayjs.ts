import type { ViewMode } from "../_types";

import type { ManipulateType } from "dayjs";

export const getManipulateUnitFromViewMode = (viewMode: ViewMode): ManipulateType => {
  return viewMode === "year" ? "month" : "day";
};
