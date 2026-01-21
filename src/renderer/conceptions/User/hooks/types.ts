import { MouseEvent } from "react";

export type THookControl = {
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  id?: "profile-popover";
  isOpen: boolean;
  anchorEl?: HTMLButtonElement | null;
};
