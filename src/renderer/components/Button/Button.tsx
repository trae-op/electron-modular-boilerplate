import { cn } from "@utils/classes";
import { memo, useMemo } from "react";

import type { TButtonColor, TButtonProps, TButtonVariant } from "./types";

const baseButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 will-change-transform";

const focusRingByColor: Record<TButtonColor, string> = {
  primary: "focus-visible:ring-2 focus-visible:ring-blue-500",
  secondary: "focus-visible:ring-2 focus-visible:ring-purple-500",
  success: "focus-visible:ring-2 focus-visible:ring-green-500",
  error: "focus-visible:ring-2 focus-visible:ring-red-500",
};

const containedByColor: Record<TButtonColor, string> = {
  primary:
    "border-transparent bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600",
  secondary:
    "border-transparent bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 dark:bg-purple-500 dark:hover:bg-purple-600",
  success:
    "border-transparent bg-green-600 text-white hover:bg-green-700 active:bg-green-800 dark:bg-green-500 dark:hover:bg-green-600",
  error:
    "border-transparent bg-red-600 text-white hover:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600",
};

const outlinedByColor: Record<TButtonColor, string> = {
  primary:
    "border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50 dark:border-blue-400 dark:text-blue-200 dark:hover:bg-blue-900/40",
  secondary:
    "border-purple-600 text-purple-600 bg-transparent hover:bg-purple-50 dark:border-purple-400 dark:text-purple-200 dark:hover:bg-purple-900/40",
  success:
    "border-green-600 text-green-600 bg-transparent hover:bg-green-50 dark:border-green-400 dark:text-green-200 dark:hover:bg-green-900/40",
  error:
    "border-red-600 text-red-600 bg-transparent hover:bg-red-50 dark:border-red-400 dark:text-red-200 dark:hover:bg-red-900/40",
};

const textByColor: Record<TButtonColor, string> = {
  primary:
    "border-transparent bg-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-200 dark:hover:bg-blue-900/40",
  secondary:
    "border-transparent bg-transparent text-purple-600 hover:bg-purple-50 dark:text-purple-200 dark:hover:bg-purple-900/40",
  success:
    "border-transparent bg-transparent text-green-600 hover:bg-green-50 dark:text-green-200 dark:hover:bg-green-900/40",
  error:
    "border-transparent bg-transparent text-red-600 hover:bg-red-50 dark:text-red-200 dark:hover:bg-red-900/40",
};

const variantStyles: Record<TButtonVariant, Record<TButtonColor, string>> = {
  contained: containedByColor,
  outlined: outlinedByColor,
  text: textByColor,
};

export const Button = memo((props: TButtonProps) => {
  const {
    children,
    className = "",
    color = "primary",
    type = "button",
    variant = "contained",
    ...restProps
  } = props;

  const mergedClassName = useMemo(() => {
    return cn(
      baseButtonClassName,
      focusRingByColor[color],
      variantStyles[variant][color],
      className,
    );
  }, [className, color, variant]);

  return (
    <button type={type} className={mergedClassName} {...restProps}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
