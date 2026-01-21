import isEqual from "lodash/isEqual";
import { memo, useCallback } from "react";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { List, type RowComponentProps } from "react-window";

import type { TProps, TRowRenderProps } from "./types";

type TRowProps = { itemData?: TProps["itemData"] };

function arePropsEqual(oldProps: TProps, newProps: TProps): boolean {
  return (
    isEqual(oldProps.itemCount, newProps.itemCount) &&
    isEqual(oldProps.heightContainer, newProps.heightContainer) &&
    isEqual(oldProps.widthContainer, newProps.widthContainer) &&
    isEqual(oldProps.isLoading, newProps.isLoading) &&
    isEqual(oldProps.isRefresh, newProps.isRefresh) &&
    isEqual(oldProps.children, newProps.children) &&
    isEqual(oldProps.itemData, newProps.itemData) &&
    isEqual(oldProps.renderMessageNotFound, newProps.renderMessageNotFound) &&
    isEqual(oldProps.heightItemComponent, newProps.heightItemComponent) &&
    isEqual(oldProps.classNameContainer, newProps.classNameContainer)
  );
}

function buildRowRenderer(
  rowRenderer: (data: TRowRenderProps) => ReturnType<TProps["children"]>,
  fallbackItemData?: TProps["itemData"],
) {
  return ({ index, style, itemData }: RowComponentProps<TRowProps>) => {
    return rowRenderer({
      index,
      style,
      itemData: itemData ?? fallbackItemData,
    });
  };
}

export const LazyRender = memo((props: TProps) => {
  const {
    itemCount,
    children,
    heightContainer,
    widthContainer,
    heightItemComponent,
    isLoading = false,
    renderMessageNotFound,
    itemData,
    classNameContainer,
  } = props;

  const rowComponent = useCallback(buildRowRenderer(children, itemData), [
    children,
    itemData,
  ]);

  if (!isLoading && !itemCount && renderMessageNotFound) {
    return renderMessageNotFound;
  }

  return (
    <AutoSizer
      renderProp={({ height, width }) => (
        <List
          rowComponent={rowComponent}
          rowCount={itemCount}
          rowHeight={heightItemComponent}
          rowProps={{ itemData }}
          overscanCount={5}
          className={classNameContainer || ""}
          style={{
            height: heightContainer ?? height ?? 0,
            width: widthContainer ?? width ?? "100%",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        />
      )}
    />
  );
}, arePropsEqual);

LazyRender.displayName = "LazyRender";
