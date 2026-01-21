import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type TListItem = {
  id: string;
  content: ReactNode;
};

export type TListProps<T extends ElementType = "div"> = {
  as?: T;
  items: TListItem[];
  className?: string;
  itemClassName?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export type TListItemComponentProps = ComponentPropsWithoutRef<"div">;
