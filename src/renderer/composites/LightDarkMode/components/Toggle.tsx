import { IconButton } from "@components/IconButton";
import { cn } from "@utils/classes";
import { Moon, Sun } from "lucide-react";
import { type MouseEvent, memo, useCallback } from "react";

import { usePaletteModeSelector, useTogglePaletteMode } from "../hooks";
import type { TPropsToggle } from "./types";

export const Toggle = memo(
  ({ onClick, className = "", ...other }: TPropsToggle) => {
    const mode = usePaletteModeSelector();
    const toggleMode = useTogglePaletteMode();
    const isDark = mode === "dark";

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        toggleMode();
      },
      [onClick, toggleMode],
    );

    const label = isDark ? "Enable light mode" : "Enable dark mode";
    const buttonClassName = cn(className);

    return (
      <IconButton
        {...other}
        type="button"
        aria-label={label}
        data-testid="light-dark-mode:toggle"
        title={label}
        className={buttonClassName}
        onClick={handleClick}
      >
        <span aria-hidden="true">{isDark ? <Sun /> : <Moon />}</span>
      </IconButton>
    );
  },
);

Toggle.displayName = "LightDarkModeToggle";
