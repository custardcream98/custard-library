import React from "react";

export const useRenderBlink = (ref: React.RefObject<HTMLElement>) => {
  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.outline = "2px solid orange";
    }

    setTimeout(() => {
      if (ref.current) {
        ref.current.style.outline = "none";
      }
    }, 500);
  });
};
