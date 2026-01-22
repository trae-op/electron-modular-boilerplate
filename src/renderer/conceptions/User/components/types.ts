import type { TListItem } from "@components/List";
import { type ReactNode } from "react";

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
