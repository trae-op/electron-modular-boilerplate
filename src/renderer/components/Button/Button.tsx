import { cn } from "@utils/classes";
import { memo, useMemo } from "react";

import type { TButtonColor, TButtonProps, TButtonVariant } from "./types";

const baseButtonClassName =
  "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-900";

const focusRingByColor: Record<TButtonColor, string> = {
  primary: "focus:ring-blue-500",
  secondary: "focus:ring-purple-500",
  success: "focus:ring-green-500",
  error: "focus:ring-red-500",
};

const containedByColor: Record<TButtonColor, string> = {
  primary:
    "border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:border-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 dark:hover:border-blue-400",
  secondary:
    "border-purple-600 bg-purple-600 text-white shadow-sm hover:bg-purple-700 hover:border-purple-700 dark:border-purple-500 dark:bg-purple-500 dark:text-white dark:hover:bg-purple-400 dark:hover:border-purple-400",
  success:
    "border-green-600 bg-green-600 text-white shadow-sm hover:bg-green-700 hover:border-green-700 dark:border-green-500 dark:bg-green-500 dark:text-white dark:hover:bg-green-400 dark:hover:border-green-400",
  error:
    "border-red-600 bg-red-600 text-white shadow-sm hover:bg-red-700 hover:border-red-700 dark:border-red-500 dark:bg-red-500 dark:text-white dark:hover:bg-red-400 dark:hover:border-red-400",
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
