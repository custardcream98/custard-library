import React, { useMemo, useState } from "react";

interface VirtualProps<T> {
  data: T[];
  itemHeight: number;
  containerHeight: number;
  overscan: number;
}

interface VirtualReturn<T> {
  virtualItems: T[];
  containerProps: React.HTMLProps<HTMLDivElement>;
  wrapperProps: React.HTMLProps<HTMLDivElement>;
}

export const useVirtual = <T>({ data, itemHeight, containerHeight, overscan }: VirtualProps<T>): VirtualReturn<T> => {
  const [scroll, setScroll] = useState(0);

  const totalHeight = data.length * itemHeight;
  const itemCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;

  const virtualItems = useMemo(() => {
    const startIndex = Math.max(Math.floor(scroll / itemHeight) - overscan, 0);
    const endIndex = Math.min(startIndex + itemCount, data.length);
    return data.slice(startIndex, endIndex);
  }, [data, itemCount, scroll, itemHeight, overscan]);

  const containerProps: React.HTMLProps<HTMLDivElement> = {
    onScroll: (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = event.currentTarget;
      setScroll(scrollTop);
    },
    style: {
      height: `${containerHeight}px`,
      overflowY: "auto",
    },
  };

  const wrapperProps: React.HTMLProps<HTMLDivElement> = {
    style: {
      height: `${totalHeight}px`,
      transform: `translate3d(0, ${scroll}px, 0)`,
    },
  };

  return { containerProps, virtualItems, wrapperProps };
};
