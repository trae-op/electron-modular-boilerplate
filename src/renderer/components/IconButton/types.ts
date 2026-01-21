import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export type TIconButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> & {
  size?: number;
};
