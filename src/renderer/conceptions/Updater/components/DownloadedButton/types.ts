import type { PropsWithChildren } from "react";

import type { TButtonProps } from "@components/Button";

export type TDownloadedButtonProps = PropsWithChildren<
  Omit<TButtonProps, "children">
>;
