import { MouseEvent, useMemo, useState } from "react";

import type { THookControl } from "./types";

export const useControl = (): THookControl => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const id = useMemo<THookControl["id"]>(
    () => (isOpen ? "profile-popover" : undefined),
    [isOpen],
  );

  return useMemo(
    () => ({
      id,
      isOpen,
      anchorEl,
      handleClick,
      handleClose,
    }),
    [id, isOpen, anchorEl, handleClick, handleClose],
  );
};
