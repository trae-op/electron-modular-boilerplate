import { cn } from "@utils/classes";
import { memo, useMemo } from "react";
import type { CSSProperties } from "react";

import type { TIconButtonProps } from "./types";

const baseClassName =
  "inline-flex items-center justify-center rounded-full p-2 text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700";

export const IconButton = memo((props: TIconButtonProps) => {
  const {
    children,
    className = "",
    size,
    style,
    type = "button",
    ...restProps
  } = props;

  const mergedClassName = useMemo(() => {
    return cn(baseClassName, className);
  }, [className]);

  const mergedStyle = useMemo((): CSSProperties | undefined => {
    if (size === undefined) {
      return style;
    }

    return {
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      ...style,
    } as CSSProperties;
  }, [size, style]);

  return (
    <button
      type={type}
      className={mergedClassName}
      style={mergedStyle}
      {...restProps}
    >
      {children}
    </button>
  );
});

IconButton.displayName = "IconButton";
