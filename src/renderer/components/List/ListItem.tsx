import { memo, useMemo } from "react";

import { cn } from "@utils/classes";

import type { TListItemComponentProps } from "./types";

const baseItemClassName = "flex flex-col justify-center";

export const ListItem = memo((props: TListItemComponentProps) => {
  const { children, className = "", ...restProps } = props;

  const mergedClassName = useMemo(() => {
    return cn(baseItemClassName, className);
  }, [className]);

  return (
    <div className={mergedClassName} {...restProps}>
      {children}
    </div>
  );
});

ListItem.displayName = "ListItem";
