import { cn } from "@utils/classes";
import { memo } from "react";

import logo from "../../../../assets/72x72.png";
import { useInvoke } from "../hooks";
import type { TPropsContainer } from "./types";

export const Container = memo(
  ({ className = "", ...other }: TPropsContainer) => {
    const { version } = useInvoke();

    if (version === "") {
      return null;
    }

    const containerClassName = cn(
      "inline-flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200 text-sm",
      className,
    );

    return (
      <div className={containerClassName} {...other}>
        <img
          src={logo}
          alt="Application logo"
          className="rounded w-7 h-7"
          loading="lazy"
        />
        <span className="text-xs">v{version}</span>
      </div>
    );
  },
);
