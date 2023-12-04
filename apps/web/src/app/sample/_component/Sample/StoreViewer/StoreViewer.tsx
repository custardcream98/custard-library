import { PrettyPrintJSON } from "../../PrettyPrintJSON";

import style from "./StoreViewer.module.scss";

import { useCurrentStoreState_ONLY_FOR_DEVELOPMENT } from "@custardcream/very-simple-store";
import React from "react";

const plainObjectFilter = (filters: string[], object: Record<any, any>) =>
  Object.entries(object).reduce<Record<any, any>>((acc, [key, value]) => {
    if (filters.includes(key)) return acc;
    acc[key] = value;
    return acc;
  }, {});

export function StoreViewer() {
  const store = useCurrentStoreState_ONLY_FOR_DEVELOPMENT();

  const normalizedStore = React.useMemo(() => {
    return {
      selectors: Object.entries(store.selectors).reduce<Record<any, any>>((acc, [key, value]) => {
        acc[key] = plainObjectFilter(["_dependencies", "_subscribers"], value);
        return acc;
      }, {}),
      state: Object.entries(store.state).reduce<Record<any, any>>((acc, [key, value]) => {
        acc[key] = plainObjectFilter(["_dependencies", "_subscribers"], value);
        return acc;
      }, {}),
    };
  }, [store]);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Store의 현재 상태</div>
      <div className={style.prettyPrintJsonWrapper}>
        <PrettyPrintJSON json={normalizedStore} />
      </div>
    </div>
  );
}
