import type { SelectHTMLAttributes } from "react";

type TSelectItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type TSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  items: TSelectItem[];
  label?: string;
  helperText?: string;
  isError?: boolean;
  textError?: string;
  containerClassName?: string;
  dataTestId?: string;
};

export type { TSelectItem };
