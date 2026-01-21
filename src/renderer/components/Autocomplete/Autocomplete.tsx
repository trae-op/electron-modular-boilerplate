import { memo, useCallback } from "react";

import { AutocompleteInput } from "./AutocompleteInput";
import type {
  TAutocompleteOption,
  TAutocompleteProps,
  TAutocompleteRenderInputParams,
  TAutocompleteRenderOptionProps,
} from "./types";
import { useAutocompleteState } from "./useAutocompleteState";

const defaultInputClassName =
  "flex-1 bg-transparent border-0 p-0 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:border-transparent focus:ring-0 dark:bg-transparent dark:text-gray-100 dark:placeholder:text-gray-500";

const defaultGetOptionLabel = (option: TAutocompleteOption): string => {
  return option.label;
};

export const Autocomplete = memo((props: TAutocompleteProps) => {
  const {
    className = "",
    disableCloseOnSelect = false,
    disabled = false,
    getOptionLabel = defaultGetOptionLabel,
    helperText,
    isError = false,
    label,
    multiple = false,
    noOptionsText = "No options",
    onChange,
    options,
    placeholder,
    renderInput,
    renderOption,
    renderOptions,
    style,
    textError,
    value,
    dataTestId,
  } = props;

  const {
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
  } = useAutocompleteState({
    className,
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
  });

  const inputParams: TAutocompleteRenderInputParams = {
    ref: inputRef,
    value: inputValue,
    onChange: handleInputChange,
    onFocus: handleInputFocus,
    onKeyDown: handleKeyDown,
    placeholder,
    disabled,
    autoComplete: "off",
    className: defaultInputClassName,
    inputClassName: defaultInputClassName,
  };
  const { inputClassName: _inputClassName, ...nativeInputProps } = inputParams;

  const inputElement = renderInput ? (
    renderInput(inputParams)
  ) : (
    <input {...nativeInputProps} />
  );

  const defaultRenderOption = useCallback(
    (
      optionProps: TAutocompleteRenderOptionProps,
      option: TAutocompleteOption,
      state: { selected: boolean },
    ) => {
      return (
        <li {...optionProps}>
          <span className="flex-1 text-left">{getOptionLabel(option)}</span>
          {state.selected ? <span className="text-blue-600">✓</span> : null}
        </li>
      );
    },
    [getOptionLabel],
  );

  const renderOptionContent = renderOption ?? defaultRenderOption;

  const optionsListProps = {
    anchorEl: anchorRef.current,
    closeList,
    disabled,
    filteredOptions,
    isSelected,
    noOptionsText,
    open,
    renderOptionContent,
    handleSelectOption,
    dataTestId: dataTestId ? `${dataTestId}-list` : undefined,
  };

  return (
    <div className="flex flex-col gap-1" style={style} data-testid={dataTestId}>
      <AutocompleteInput
        anchorRef={anchorRef}
        label={label}
        mergedControlClassName={mergedControlClassName}
        onControlClick={handleControlClick}
        multiple={multiple}
        selectedOptions={selectedOptions}
        getOptionLabel={getOptionLabel}
        onRemoveChip={handleRemoveChip}
        disabled={disabled}
        inputElement={inputElement}
        helperMessage={helperMessage}
        isError={isError}
        dataTestId={dataTestId ? `${dataTestId}-input` : undefined}
      />

      {renderOptions(optionsListProps)}
    </div>
  );
});

Autocomplete.displayName = "Autocomplete";
