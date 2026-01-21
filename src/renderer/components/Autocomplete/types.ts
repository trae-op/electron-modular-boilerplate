import type {
  CSSProperties,
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
  RefObject,
} from "react";

export type TAutocompleteOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type TAutocompleteChangeValue =
  | TAutocompleteOption
  | TAutocompleteOption[]
  | null;

export type TAutocompleteRenderOptionProps = {
  key: string;
  role: "option";
  "aria-selected": boolean;
  className: string;
  style?: CSSProperties;
  "data-option-value": string;
  "data-option-disabled"?: "true";
};

export type TAutocompleteRenderOptionState = {
  selected: boolean;
};

export type TAutocompleteRenderInputParams =
  InputHTMLAttributes<HTMLInputElement> & {
    ref: Ref<HTMLInputElement>;
    inputClassName: string;
  };

export type TAutocompleteProps = {
  options: TAutocompleteOption[];
  value: TAutocompleteChangeValue;
  onChange: (value: TAutocompleteChangeValue) => void;
  multiple?: boolean;
  disableCloseOnSelect?: boolean;
  getOptionLabel?: (option: TAutocompleteOption) => string;
  renderOption?: (
    props: TAutocompleteRenderOptionProps,
    option: TAutocompleteOption,
    state: TAutocompleteRenderOptionState,
  ) => ReactNode;
  renderOptions: (params: TAutocompleteOptionsListProps) => ReactNode;
  renderInput?: (params: TAutocompleteRenderInputParams) => ReactNode;
  placeholder?: string;
  label?: string;
  helperText?: string;
  textError?: string;
  isError?: boolean;
  className?: string;
  style?: CSSProperties;
  dataTestId?: string;
  noOptionsText?: string;
  disabled?: boolean;
};

export type TUseAutocompleteStateParams = {
  className?: string;
  disableCloseOnSelect: boolean;
  disabled: boolean;
  getOptionLabel: (option: TAutocompleteOption) => string;
  helperText?: string;
  isError: boolean;
  multiple: boolean;
  onChange: (value: TAutocompleteChangeValue) => void;
  options: TAutocompleteOption[];
  textError?: string;
  value: TAutocompleteChangeValue;
};

export type TUseAutocompleteStateResult = {
  anchorRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  open: boolean;
  inputValue: string;
  selectedOptions: TAutocompleteOption[];
  filteredOptions: TAutocompleteOption[];
  helperMessage?: string;
  mergedControlClassName: string;
  isSelected: (option: TAutocompleteOption) => boolean;
  closeList: () => void;
  handleSelectOption: (option: TAutocompleteOption) => void;
  handleRemoveChip: (optionValue: string) => void;
  handleControlClick: () => void;
  handleInputFocus: () => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export type TAutocompleteInputProps = {
  anchorRef: RefObject<HTMLDivElement | null>;
  label?: string;
  mergedControlClassName: string;
  onControlClick: () => void;
  multiple: boolean;
  selectedOptions: TAutocompleteOption[];
  getOptionLabel: (option: TAutocompleteOption) => string;
  onRemoveChip: (optionValue: string) => void;
  disabled: boolean;
  inputElement: ReactNode;
  helperMessage?: string;
  isError?: boolean;
  style?: CSSProperties;
  dataTestId?: string;
};

export type TAutocompleteOptionsListProps = {
  anchorEl: HTMLDivElement | null;
  closeList: () => void;
  disabled: boolean;
  filteredOptions: TAutocompleteOption[];
  isSelected: (option: TAutocompleteOption) => boolean;
  noOptionsText: string;
  open: boolean;
  renderOptionContent: (
    props: TAutocompleteRenderOptionProps,
    option: TAutocompleteOption,
    state: TAutocompleteRenderOptionState,
  ) => ReactNode;
  handleSelectOption: (option: TAutocompleteOption) => void;
  dataTestId?: string;
};

export type TChipProps = {
  label: string;
  optionValue: string;
  disabled?: boolean;
  dataTestId?: string;
};
