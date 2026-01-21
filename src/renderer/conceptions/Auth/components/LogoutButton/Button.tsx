import { memo } from "react";

import { cn } from "@utils/classes";

import { Button } from "@components/Button";

import { useControl } from "../../hooks";
import type { TPropsLogoutButton } from "./types";

export const LogoutButton = memo(
  ({ children, className = "", ...otherProps }: TPropsLogoutButton) => {
    const { handleLogout } = useControl();

    return (
      <Button
        type="button"
        onClick={handleLogout}
        className={cn(className)}
        {...otherProps}
      >
        {children}
      </Button>
    );
  },
);
