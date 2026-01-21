import { memo, useCallback } from "react";
import type { MouseEvent } from "react";

import { cn } from "@utils/classes";

import { Chip } from "./Chip";
import type { TAutocompleteInputProps } from "./types";

const labelClassName = "font-medium text-gray-700 dark:text-gray-200 text-sm";
const helperTextClassName = "text-xs";

export const AutocompleteInput = memo((props: TAutocompleteInputProps) => {
  const {
    anchorRef,
    dataTestId,
    disabled,
    getOptionLabel,
    helperMessage,
    inputElement,
    isError = false,
    label,
    mergedControlClassName,
    multiple,
    onControlClick,
    onRemoveChip,
    selectedOptions,
    style,
  } = props;

  const handleControlAreaClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      const target = event.target as HTMLElement;
      const deleteTrigger = target.closest<HTMLElement>(
        "[data-chip-delete='true']",
      );

      if (deleteTrigger) {
        const optionValue = deleteTrigger.getAttribute("data-chip-value");

        if (optionValue) {
          event.preventDefault();
          event.stopPropagation();
          onRemoveChip(optionValue);
        }

        return;
      }

      onControlClick();
    },
    [disabled, onControlClick, onRemoveChip],
  );

  return (
    <div className="flex flex-col gap-1" data-testid={dataTestId} style={style}>
      {Boolean(label) && (
        <label
          className={labelClassName}
          data-testid={dataTestId ? `${dataTestId}-label` : undefined}
        >
          {label}
        </label>
      )}

      <div
        className={mergedControlClassName}
        onClick={handleControlAreaClick}
        ref={anchorRef}
        role="presentation"
        data-testid={dataTestId ? `${dataTestId}-control` : undefined}
      >
        {multiple && selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((selected) => (
              <Chip
                key={selected.value}
                label={getOptionLabel(selected)}
                optionValue={selected.value}
                disabled={disabled}
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-chip-${selected.value}`
                    : undefined
                }
              />
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-2 w-full">{inputElement}</div>
      </div>

      {helperMessage ? (
        <p
          className={cn(
            helperTextClassName,
            isError
              ? "text-red-600 dark:text-red-400"
              : "text-gray-500 dark:text-gray-400",
          )}
          data-testid={dataTestId ? `${dataTestId}-helper` : undefined}
        >
          {helperMessage}
        </p>
      ) : null}
    </div>
  );
});

AutocompleteInput.displayName = "AutocompleteInput";
