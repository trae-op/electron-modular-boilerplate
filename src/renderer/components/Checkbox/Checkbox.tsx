import { cn } from "@utils/classes";
import { memo, useId } from "react";

import type { TCheckboxProps } from "./types";

const checkboxBaseClassName =
  "h-4 w-4 rounded border border-gray-300 text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:checked:bg-blue-500 dark:focus:ring-blue-400";

const checkboxErrorClassName =
  "border-red-500 text-red-500 focus:ring-red-500 dark:border-red-400 dark:checked:bg-red-500 dark:focus:ring-red-400";

export const Checkbox = memo((props: TCheckboxProps) => {
  const {
    className = "",
    containerClassName = "",
    dataTestId,
    id,
    isError = false,
    label,
    textError,
    ...inputProps
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <label
        className="flex items-start gap-2 font-medium text-gray-800 dark:text-gray-100 text-sm"
        htmlFor={inputId}
      >
        <input
          id={inputId}
          type="checkbox"
          data-testid={dataTestId}
          aria-invalid={isError}
          className={cn(
            checkboxBaseClassName,
            isError ? checkboxErrorClassName : "",
            className,
          )}
          {...inputProps}
        />
        {label ? <span className="leading-5">{label}</span> : null}
      </label>

      {textError && isError ? (
        <p className="text-red-600 dark:text-red-400 text-xs">{textError}</p>
      ) : null}
    </div>
  );
});

Checkbox.displayName = "Checkbox";
