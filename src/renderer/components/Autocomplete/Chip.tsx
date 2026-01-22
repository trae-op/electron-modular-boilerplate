import { cn } from "@utils/classes";
import { X } from "lucide-react";
import { memo, useMemo } from "react";

import type { TChipProps } from "./types";

const baseChipClassName =
  "inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-100";

const iconBtnBase =
  "inline-flex items-center justify-center rounded-full text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700";

const IconBtn = (props: any) => {
  const {
    children,
    className = "",
    size,
    style,
    type = "button",
    ...rest
  } = props;
  const mergedClassName = cn(iconBtnBase, className);

  const mergedStyle = size
    ? { width: size, height: size, minWidth: size, minHeight: size, ...style }
    : style;

  return (
    <button
      type={type}
      className={mergedClassName}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </button>
  );
};

export const Chip = memo((props: TChipProps) => {
  const { dataTestId, disabled = false, label, optionValue } = props;

  const mergedClassName = useMemo(() => {
    return cn(
      baseChipClassName,
      disabled ? "opacity-60 cursor-not-allowed" : "",
    );
  }, [disabled]);

  return (
    <span className={mergedClassName} data-testid={dataTestId}>
      <span className="whitespace-nowrap">{label}</span>
      <IconBtn
        aria-label={`Remove ${label}`}
        disabled={disabled}
        data-chip-delete="true"
        data-chip-value={optionValue}
        size={20}
        className="p-1"
        type="button"
      >
        <X />
      </IconBtn>
    </span>
  );
});

Chip.displayName = "Chip";
