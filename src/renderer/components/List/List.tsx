import { type ElementType, memo, useMemo } from "react";

import { cn } from "@utils/classes";

import { ListItem } from "./ListItem";
import type { TListProps } from "./types";

const baseListClassName =
  "flex flex-col divide-y divide-gray-200 dark:divide-gray-700";

export const List = memo(
  <T extends ElementType = "div">(props: TListProps<T>) => {
    const {
      as,
      items,
      className = "",
      itemClassName = "",
      ...restProps
    } = props;
    const Component = (as ?? "div") as ElementType;

    const mergedListClassName = useMemo(() => {
      return cn(baseListClassName, className);
    }, [className]);

    const mergedItemClassName = useMemo(() => {
      return cn(itemClassName);
    }, [itemClassName]);

    return (
      <Component className={mergedListClassName} {...restProps}>
        {items.map((item) => (
          <ListItem key={item.id} className={mergedItemClassName}>
            {item.content}
          </ListItem>
        ))}
      </Component>
    );
  },
);

List.displayName = "List";
