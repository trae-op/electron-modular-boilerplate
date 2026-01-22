import { Button } from "@components/Button";
import { cn } from "@utils/classes";
import { memo } from "react";

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
