import type { InputHTMLAttributes } from "react";

export type TCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className"
> & {
  className?: string;
  containerClassName?: string;
  label?: string;
  isError?: boolean;
  textError?: string;
  dataTestId?: string;
};
