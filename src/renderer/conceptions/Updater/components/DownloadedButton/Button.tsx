import { Button } from "@components/Button";
import { cn } from "@utils/classes";

import {
  useStatusSelector,
  useVersionSelector,
} from "../../context/useSelectors";
import { useUpdateDownloaded } from "../../hooks";
import type { TDownloadedButtonProps } from "./types";

export const DownloadedButton = ({
  children,
  className = "",
  ...otherProps
}: TDownloadedButtonProps) => {
  const version = useVersionSelector();
  const status = useStatusSelector();
  const { handleUpdate } = useUpdateDownloaded();

  if (status !== "update-downloaded" && version === undefined) {
    return null;
  }

  return (
    <Button
      type="button"
      onClick={handleUpdate}
      className={cn("w-full", className)}
      {...otherProps}
    >
      <span className="flex justify-between items-center">
        <span>{children}</span>
        {version ? <strong className="ml-2 text-xs">v{version}</strong> : null}
      </span>
    </Button>
  );
};
