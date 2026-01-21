import type { ReactNode } from "react";

import type { TButtonProps } from "@components/Button";

export type TPropsLogoutButton = TButtonProps & {
  className?: string;
  children?: ReactNode;
};
