import type { CSSProperties, PropsWithChildren } from "react";

type TPopoverHorizontalOrigin = "left" | "center" | "right";
type TPopoverVerticalOrigin = "top" | "center" | "bottom";

export type TPopoverAnchorOrigin = {
  horizontal: TPopoverHorizontalOrigin;
  vertical: TPopoverVerticalOrigin;
};

export type TPopoverProps = PropsWithChildren<{
  anchorEl?: HTMLElement | null;
  anchorOrigin?: TPopoverAnchorOrigin;
  className?: string;
  container?: HTMLElement | null;
  disablePortal?: boolean;
  id?: string;
  keepMounted?: boolean;
  offset?: number;
  onClose: () => void;
  open: boolean;
  style?: CSSProperties;
  "data-testid"?: string;
}>;

export type TPopoverPosition = {
  left: number;
  top: number;
};
