import { memo, useId, useMemo } from "react";

import { cn } from "@utils/classes";

import type { TSelectProps } from "./types";

const baseSelectClassName =
  "block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-gray-100";

const normalStateClassName =
  "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:focus:border-blue-400 dark:focus:ring-blue-400";

const errorStateClassName =
  "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400";

export const Select = memo((props: TSelectProps) => {
  const {
    className = "",
    containerClassName = "",
    dataTestId,
    helperText,
    id,
    isError = false,
    items,
    label,
    textError,
    ...selectProps
  } = props;

  const generatedId = useId();
  const selectId = id ?? generatedId;

  const mergedClassName = useMemo(() => {
    return cn(
      baseSelectClassName,
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
          htmlFor={selectId}
        >
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        data-testid={dataTestId}
        aria-invalid={isError}
        className={mergedClassName}
        {...selectProps}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </select>

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

Select.displayName = "Select";
