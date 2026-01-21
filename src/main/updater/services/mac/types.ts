type TEventCallBack = (
  data: Pick<
    TUpdateData,
    "status" | "version" | "downloadedPercent" | "updateFile"
  >,
) => void;

export type TOptionsUpdater = {
  eventCallBack: TEventCallBack;
};

export type TPromiseCreateFolder = {
  ok?: boolean;
  message?: string;
};

export type TPromiseOpenFolder = TPromiseCreateFolder;
