import { memo, useMemo } from "react";

import { LogoutButton } from "@conceptions/Auth";
import { DownloadedButton, useStatusSelector } from "@conceptions/Updater";
import { UserPopover } from "@conceptions/User";

import { Container as ContainerAppVersion } from "@composites/AppVersion";
import { Toggle as LightDarkModeToggle } from "@composites/LightDarkMode";

import { TopPanel } from "@layouts/TopPanel";

//shadow-none rounded-none border-0
const ContainerPopover = memo(() => {
  const status = useStatusSelector();
  // const buttonClassName = "shadow-none rounded-none border-0";

  const navItems = useMemo(
    () => [
      ...(status === "update-downloaded"
        ? [
            {
              id: "update-action",
              content: (
                <DownloadedButton className="rounded-none" variant="text">
                  Update
                </DownloadedButton>
              ),
            },
          ]
        : []),

      {
        id: "logout-action",
        content: (
          <LogoutButton className="rounded-none" variant="text">
            Logout
          </LogoutButton>
        ),
      },
    ],
    [status],
  );

  return (
    <UserPopover
      isNewVersionApp={status === "update-downloaded"}
      navItems={navItems}
    />
  );
});

const ContainerTopPanel = () => {
  return (
    <TopPanel className="top-0 left-0 z-10 fixed bg-gray-100 dark:bg-gray-900 px-4 py-2 border-gray-200 dark:border-gray-800 border-b w-full">
      <ContainerAppVersion className="text-gray-600 dark:text-gray-300 text-xs" />
      <div className="flex items-center gap-2 ml-auto">
        <LightDarkModeToggle />
        <ContainerPopover />
      </div>
    </TopPanel>
  );
};

export default ContainerTopPanel;
