import { cn } from "@utils/classes";
import { memo, useId, useMemo } from "react";

import type { TTextFieldProps } from "./types";

const baseInputClassName =
  "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500";

const normalStateClassName =
  "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:focus:border-blue-400 dark:focus:ring-blue-400";

const errorStateClassName =
  "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400";

export const TextField = memo((props: TTextFieldProps) => {
  const {
    className = "",
    containerClassName = "",
    dataTestId,
    helperText,
    id,
    isError = false,
    label,
    textError,
    type = "text",
    ...inputProps
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;

  const mergedClassName = useMemo(() => {
    return cn(
      baseInputClassName,
      isError ? errorStateClassName : normalStateClassName,
      className,
    );
  }, [className, isError]);

  const helperMessage = isError ? textError : helperText;

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      {label ? (
        <label
          className="font-medium text-gray-700 dark:text-gray-200 text-sm"
          htmlFor={inputId}
        >
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        aria-invalid={isError}
        className={mergedClassName}
        data-testid={dataTestId}
        type={type}
        {...inputProps}
      />

      {helperMessage ? (
        <p
          className={cn(
            "text-xs",
            isError
              ? "text-red-600 dark:text-red-400"
              : "text-gray-500 dark:text-gray-400",
          )}
        >
          {helperMessage}
        </p>
      ) : null}
    </div>
  );
});

TextField.displayName = "TextField";
