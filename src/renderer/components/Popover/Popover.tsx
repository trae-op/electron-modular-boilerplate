import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@utils/classes";

import type { TPopoverPosition, TPopoverProps } from "./types";

const baseClassName =
  "absolute z-50 min-w-[12rem] rounded-lg border border-gray-200 bg-white p-4 shadow-lg ring-1 ring-black/5 transition-opacity duration-150 dark:border-gray-700 dark:bg-gray-800";

const defaultOrigin = {
  horizontal: "left" as const,
  vertical: "bottom" as const,
};

export const Popover = memo((props: TPopoverProps) => {
  const {
    anchorEl,
    anchorOrigin = defaultOrigin,
    children,
    className = "",
    container,
    disablePortal = false,
    id,
    keepMounted = false,
    offset = 8,
    onClose,
    open,
    style,
    "data-testid": dataTestId,
  } = props;

  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<TPopoverPosition>({
    left: 0,
    top: 0,
  });

  const mergedClassName = useMemo(() => {
    return cn(baseClassName, className);
  }, [className]);

  const updatePosition = useCallback(() => {
    if (!anchorEl || !popoverRef.current) {
      return;
    }

    const anchorRect = anchorEl.getBoundingClientRect();
    const popRect = popoverRef.current.getBoundingClientRect();

    const topByVertical: Record<typeof anchorOrigin.vertical, number> = {
      top: anchorRect.top - popRect.height - offset,
      center: anchorRect.top + anchorRect.height / 2 - popRect.height / 2,
      bottom: anchorRect.bottom + offset,
    };

    const leftByHorizontal: Record<typeof anchorOrigin.horizontal, number> = {
      left: anchorRect.left,
      center: anchorRect.left + anchorRect.width / 2 - popRect.width / 2,
      right: anchorRect.right - popRect.width,
    };

    setPosition({
      left: leftByHorizontal[anchorOrigin.horizontal] + window.scrollX,
      top: topByVertical[anchorOrigin.vertical] + window.scrollY,
    });
  }, [anchorEl, anchorOrigin.horizontal, anchorOrigin.vertical, offset]);

  useLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!popoverRef.current) {
        return;
      }

      const target = event.target as Node;
      if (popoverRef.current.contains(target)) {
        return;
      }

      if (anchorEl && anchorEl.contains(target)) {
        return;
      }

      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [anchorEl, onClose, open]);

  const inlineStyle = useMemo(() => {
    return {
      left: position.left,
      top: position.top,
      visibility: open ? "visible" : "hidden",
      opacity: open ? 1 : 0,
      ...style,
    } as const;
  }, [open, position.left, position.top, style]);

  if (!open && !keepMounted) {
    return null;
  }

  const content = (
    <div
      aria-hidden={!open}
      className={mergedClassName}
      id={id}
      ref={popoverRef}
      role="presentation"
      style={inlineStyle}
      tabIndex={-1}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );

  if (disablePortal) {
    return content;
  }

  return createPortal(content, container ?? document.body);
});

Popover.displayName = "Popover";
