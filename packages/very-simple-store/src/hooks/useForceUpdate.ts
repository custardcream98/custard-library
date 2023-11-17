import React from "react";

export const useForceUpdate = () => {
  // eslint-disable-next-line react/hook-use-state
  const [, setState] = React.useState({});
  return React.useCallback(() => setState({}), []);
};
