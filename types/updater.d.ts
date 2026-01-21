type TStatusesUpdate =
  | "checking-for-update"
  | "update-not-available"
  | "update-available"
  | "download-progress"
  | "update-downloaded"
  | "error";

type TOpenUpdateApp = {
  isOpen: boolean;
};

type TUpdateData = {
  downloadedPercent?: string;
  message?: string;
  version?: string;
  platform?: string;
  updateFile?: string;
  status: TStatusesUpdate;
};
