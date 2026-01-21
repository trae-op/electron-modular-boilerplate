import { type ReactNode } from "react";

import type { TListItem } from "@components/List";

export type TProviderProps = {
  children: ReactNode;
};

export type TProviderProfileProps = {
  children: ReactNode;
};

export type TUserPopoverProps = {
  navItems: TListItem[];
  isNewVersionApp?: boolean;
};
