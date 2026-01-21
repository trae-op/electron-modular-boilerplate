import type { CSSProperties, ReactElement } from "react";

export type TItemData = Record<string, unknown>;

export type TRowRenderProps = {
  index: number;
  style: CSSProperties;
  itemData?: TItemData;
};

export type TProps = {
  itemCount: number;
  classNameContainer?: string;
  children: (data: TRowRenderProps) => ReactElement;
  renderMessageNotFound?: ReactElement;
  heightContainer?: number;
  widthContainer?: number;
  heightItemComponent: number;
  isLoading?: boolean;
  isRefresh?: boolean;
  itemData?: TItemData;
};
