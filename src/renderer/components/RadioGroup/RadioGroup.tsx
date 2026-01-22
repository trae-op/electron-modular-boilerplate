import { cn } from "@utils/classes";
import { memo, useId } from "react";

import type { TRadioGroupProps, TRadioItem } from "./types";

const radioBaseClassName =
  "h-4 w-4 border border-gray-300 text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:checked:bg-blue-500 dark:focus:ring-blue-400";

const radioErrorClassName =
  "border-red-500 text-red-500 focus:ring-red-500 dark:border-red-400 dark:checked:bg-red-500 dark:focus:ring-red-400";

const labelClassName =
  "flex items-start gap-2 rounded-md border border-transparent px-2 py-1 hover:border-gray-200 dark:hover:border-gray-700";

const labelDisabledClassName =
  "cursor-not-allowed opacity-60 hover:border-transparent dark:hover:border-transparent";

export const RadioGroup = memo((props: TRadioGroupProps) => {
  const {
    className = "",
    containerClassName = "",
    dataTestId,
    defaultValue,
    id,
    isError = false,
    items,
    name,
    onChange,
    textError,
    value,
    ...inputProps
  } = props;

  const generatedName = useId();
  const groupName = name ?? generatedName;
  const groupIdPrefix = id ?? groupName;

  const resolveChecked = (item: TRadioItem) => {
    if (value !== undefined) {
      return value === item.value;
    }

    if (defaultValue !== undefined) {
      return defaultValue === item.value;
    }

    return false;
  };

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isChecked = resolveChecked(item);
          const isDisabled = inputProps.disabled ?? item.disabled;
          const inputId = `${groupIdPrefix}-${item.value}`;

          return (
            <label
              key={item.value}
              className={cn(
                labelClassName,
                isDisabled ? labelDisabledClassName : "cursor-pointer",
              )}
              htmlFor={inputId}
            >
              <input
                type="radio"
                name={groupName}
                value={item.value}
                id={inputId}
                data-testid={
                  dataTestId ? `${dataTestId}-${item.value}` : undefined
                }
                aria-invalid={isError}
                className={cn(
                  radioBaseClassName,
                  isError ? radioErrorClassName : "",
                  className,
                )}
                checked={value !== undefined ? isChecked : undefined}
                defaultChecked={value === undefined ? isChecked : undefined}
                disabled={isDisabled}
                onChange={onChange}
                {...inputProps}
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                  {item.label}
                </span>
                {item.description ? (
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {item.description}
                  </span>
                ) : null}
              </div>
            </label>
          );
        })}
      </div>

      {textError && isError ? (
        <p className="text-red-600 dark:text-red-400 text-xs">{textError}</p>
      ) : null}
    </div>
  );
});

RadioGroup.displayName = "RadioGroup";
