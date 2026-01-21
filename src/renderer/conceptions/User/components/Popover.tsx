import { type MouseEvent, useCallback } from "react";

import { Avatar } from "@components/Avatar";
import { AvatarButton } from "@components/AvatarButton";
import { IconButton } from "@components/IconButton";
import { List } from "@components/List";
import { Popover } from "@components/Popover";

import { useUserSelector } from "../context/useSelectors";
import { useIpc } from "../hooks";
import { useControl } from "../hooks/useControl";
import { TUserPopoverProps } from "./types";

export const UserPopover = ({
  navItems,
  isNewVersionApp,
}: TUserPopoverProps) => {
  useIpc();
  const user = useUserSelector();
  const displayName = user?.displayName;
  const displayEmail = user?.email;
  const picture = user?.picture;
  const { anchorEl, handleClick, handleClose, id, isOpen } = useControl();

  const handleButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (isOpen) {
        handleClose();
        return;
      }

      handleClick(event);
    },
    [handleClick, handleClose, isOpen],
  );

  return (
    <>
      <AvatarButton
        id={id}
        iconButton={IconButton}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        onClick={handleButtonClick}
        hasNotification={isNewVersionApp}
        name={displayName}
        email={displayEmail}
        src={picture}
        size={40}
        avatarSize={32}
      />

      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl ?? null}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        className="w-1/12"
      >
        <div className="flex flex-col items-center gap-2 pb-3 border-gray-200 dark:border-gray-700 border-b text-center">
          <Avatar
            alt={displayName ?? displayEmail ?? "profile"}
            email={displayEmail}
            name={displayName}
            size={80}
            src={picture}
            className="text-xl"
          />
          {displayName ? (
            <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
              {displayName}
            </p>
          ) : null}
          {displayEmail ? (
            <p className="text-gray-600 dark:text-gray-300 text-xs">
              {displayEmail}
            </p>
          ) : null}
        </div>
        <List
          as="nav"
          aria-label="profile actions"
          onClick={handleClose}
          items={navItems}
        />
      </Popover>
    </>
  );
};
