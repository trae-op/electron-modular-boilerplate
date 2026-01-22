type TEventCallBack = (
  data: Pick<
    TUpdateData,
    "status" | "version" | "downloadedPercent" | "updateFile"
  >,
) => void;

export type TOptionsUpdater = {
  eventCallBack: TEventCallBack;
};

type ProgressCallback = (percent: number) => void;

export type TOptionsDownloadFile = {
  name: string;
  assetId: string;
  size: number;
  onDownloadProgress: ProgressCallback;
};

export type TPromiseCreateFolder = {
  ok?: boolean;
  message?: string;
};

export type TPromiseOpenFolder = TPromiseCreateFolder;
