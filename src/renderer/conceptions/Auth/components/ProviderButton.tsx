import { memo } from "react";

import { cn } from "@utils/classes";

import { Button } from "@components/Button";

import { useControl } from "../hooks";
import type { TPropsButtonProvider } from "./types";

export const ProviderButton = memo(
  ({ text, className = "", color: _color, ...other }: TPropsButtonProvider) => {
    const { handleProvider } = useControl();

    return (
      <Button
        type="button"
        className={cn("w-full", className)}
        onClick={handleProvider}
        {...other}
      >
        {text}
      </Button>
    );
  },
);
