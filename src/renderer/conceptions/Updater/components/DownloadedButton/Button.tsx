import { cn } from "@utils/classes";

import { Button } from "@components/Button";

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
        {version ? (
          <span className="ml-2 text-gray-500 text-xs">v{version}</span>
        ) : null}
      </span>
    </Button>
  );
};
