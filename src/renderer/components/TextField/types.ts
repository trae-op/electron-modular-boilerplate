import type { InputHTMLAttributes } from "react";

export type TTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  isError?: boolean;
  textError?: string;
  containerClassName?: string;
  dataTestId?: string;
};
