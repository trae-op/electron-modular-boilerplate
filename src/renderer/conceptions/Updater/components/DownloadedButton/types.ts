import type { TButtonProps } from "@components/Button";
import type { PropsWithChildren } from "react";

export type TDownloadedButtonProps = PropsWithChildren<
  Omit<TButtonProps, "children">
>;
