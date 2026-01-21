import type { PropsWithChildren } from "react";

export type TPopupProps = PropsWithChildren<{
  ariaDescribedBy?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  backdropClassName?: string;
  className?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  container?: HTMLElement | null;
  lockScroll?: boolean;
  onClose: () => void;
  open: boolean;
  "data-testid"?: string;
}>;
