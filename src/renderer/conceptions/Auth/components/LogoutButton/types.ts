import type { TButtonProps } from "@components/Button";
import type { ReactNode } from "react";

export type TPropsLogoutButton = TButtonProps & {
  className?: string;
  children?: ReactNode;
};
