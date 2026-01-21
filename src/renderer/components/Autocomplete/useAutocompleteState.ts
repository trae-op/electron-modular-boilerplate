import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

import type {
  TAutocompleteOption,
  TUseAutocompleteStateParams,
  TUseAutocompleteStateResult,
} from "./types";

const controlBaseClassName =
  "flex w-full flex-col gap-2 rounded-lg border bg-white p-3 text-sm text-gray-900 transition-colors duration-200 focus-within:ring-2 dark:bg-gray-900 dark:text-gray-100";

const controlNormalStateClassName =
  "border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500 dark:border-gray-700 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400";

const controlErrorStateClassName =
  "border-red-500 focus-within:border-red-500 focus-within:ring-red-500 dark:border-red-400";

const controlDisabledClassName = "cursor-not-allowed opacity-60";

export const useAutocompleteState = (
  params: TUseAutocompleteStateParams,
): TUseAutocompleteStateResult => {
  const {
    className = "",
    disableCloseOnSelect,
    disabled,
    getOptionLabel,
    helperText,
    isError,
    multiple,
    onChange,
    options,
    textError,
    value,
  } = params;

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedOptions = useMemo(() => {
    if (!value) {
      return [] as TAutocompleteOption[];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [value];
  }, [value]);

  useEffect(() => {
    if (multiple) {
      return;
    }

    const selectedValue = Array.isArray(value) ? value[0] : value;

    if (selectedValue) {
      setInputValue(getOptionLabel(selectedValue));
      return;
    }

    setInputValue("");
  }, [getOptionLabel, multiple, value]);

  const mergedControlClassName = useMemo(() => {
    return [
      controlBaseClassName,
      isError ? controlErrorStateClassName : controlNormalStateClassName,
      disabled ? controlDisabledClassName : "cursor-text",
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }, [className, disabled, isError]);

  const helperMessage = useMemo(() => {
    return isError ? textError : helperText;
  }, [helperText, isError, textError]);

  const isSelected = useCallback(
    (option: TAutocompleteOption): boolean => {
      return selectedOptions.some((item) => item.value === option.value);
    },
    [selectedOptions],
  );

  const filteredOptions = useMemo(() => {
    const trimmed = inputValue.trim().toLowerCase();

    if (!trimmed) {
      return options;
    }

    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(trimmed),
    );
  }, [getOptionLabel, inputValue, options]);

  const closeList = useCallback(() => {
    setOpen(false);
  }, []);

  const focusInput = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus();
  }, []);

  const handleSelectOption = useCallback(
    (option: TAutocompleteOption) => {
      if (disabled || option.disabled) {
        return;
      }

      if (multiple) {
        const exists = isSelected(option);
        const newValue = exists
          ? selectedOptions.filter((item) => item.value !== option.value)
          : [...selectedOptions, option];

        onChange(newValue);

        if (!disableCloseOnSelect) {
          closeList();
        }

        setInputValue("");
        return;
      }

      onChange(option);
      setInputValue(getOptionLabel(option));
      closeList();
    },
    [
      closeList,
      disabled,
      disableCloseOnSelect,
      getOptionLabel,
      isSelected,
      multiple,
      onChange,
      selectedOptions,
    ],
  );

  const handleRemoveChip = useCallback(
    (optionValue: string) => {
      if (disabled) {
        return;
      }

      if (!multiple) {
        onChange(null);
        setInputValue("");
        return;
      }

      const newValue = selectedOptions.filter(
        (item) => item.value !== optionValue,
      );
      onChange(newValue);
    },
    [disabled, multiple, onChange, selectedOptions],
  );

  const handleControlClick = useCallback(() => {
    if (disabled) {
      return;
    }

    setOpen(true);
    focusInput();
  }, [disabled, focusInput]);

  const handleInputFocus = useCallback(() => {
    if (disabled) {
      return;
    }

    setOpen(true);
  }, [disabled]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);

      if (!open && !disabled) {
        setOpen(true);
      }
    },
    [disabled, open],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && multiple && inputValue.length === 0) {
        const lastSelected = selectedOptions[selectedOptions.length - 1];

        if (lastSelected) {
          event.preventDefault();
          handleRemoveChip(lastSelected.value);
        }
      }

      if (event.key === "Enter") {
        const firstOption = filteredOptions[0];

        if (firstOption) {
          event.preventDefault();
          handleSelectOption(firstOption);
        }
      }

      if (event.key === "ArrowDown") {
        setOpen(true);
      }
    },
    [
      filteredOptions,
      handleRemoveChip,
      handleSelectOption,
      inputValue.length,
      multiple,
      selectedOptions,
    ],
  );

  return {
    anchorRef,
    inputRef,
    open,
    inputValue,
    selectedOptions,
    filteredOptions,
    helperMessage,
    mergedControlClassName,
    isSelected,
    closeList,
    handleSelectOption,
    handleRemoveChip,
    handleControlClick,
    handleInputFocus,
    handleInputChange,
    handleKeyDown,
  };
};
