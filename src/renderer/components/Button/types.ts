import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type TButtonVariant = "text" | "contained" | "outlined";
export type TButtonColor = "primary" | "secondary" | "success" | "error";

export type TButtonProps = PropsWithChildren<
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">
> & {
  variant?: TButtonVariant;
  color?: TButtonColor;
};
