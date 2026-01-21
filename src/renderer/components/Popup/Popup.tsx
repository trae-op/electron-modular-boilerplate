import { type MouseEvent, memo, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

import { cn } from "@utils/classes";

import type { TPopupProps } from "./types";

const overlayBaseClassName =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4";

const contentBaseClassName =
  "relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-900";

export const Popup = memo((props: TPopupProps) => {
  const {
    ariaDescribedBy,
    ariaLabel,
    ariaLabelledBy,
    backdropClassName = "",
    children,
    className = "",
    closeOnBackdrop = true,
    closeOnEsc = true,
    container,
    lockScroll = true,
    onClose,
    open,
    "data-testid": dataTestId,
  } = props;

  const mergedOverlayClassName = useMemo(() => {
    return cn(overlayBaseClassName, backdropClassName);
  }, [backdropClassName]);

  const mergedContentClassName = useMemo(() => {
    return cn(contentBaseClassName, className);
  }, [className]);

  useEffect(() => {
    if (!open || !closeOnEsc) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEsc, onClose, open]);

  useEffect(() => {
    if (!open || !lockScroll) {
      return undefined;
    }

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    return () => {
      style.overflow = previousOverflow;
    };
  }, [lockScroll, open]);

  const handleBackdropMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!closeOnBackdrop) {
        return;
      }

      if (event.target !== event.currentTarget) {
        return;
      }

      onClose();
    },
    [closeOnBackdrop, onClose],
  );

  if (!open) {
    return null;
  }

  const content = (
    <div
      aria-hidden={!open}
      className={mergedOverlayClassName}
      onMouseDown={handleBackdropMouseDown}
      role="presentation"
      data-testid={dataTestId}
    >
      <div
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-modal="true"
        className={mergedContentClassName}
        role="dialog"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(content, container ?? document.body);
});

Popup.displayName = "Popup";
