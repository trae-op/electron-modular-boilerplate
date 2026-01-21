import type { ChangeEvent, InputHTMLAttributes } from "react";

type TRadioItem = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type TRadioGroupProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "checked" | "defaultChecked"
> & {
  className?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  items: TRadioItem[];
  isError?: boolean;
  textError?: string;
  containerClassName?: string;
  dataTestId?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type { TRadioItem };
