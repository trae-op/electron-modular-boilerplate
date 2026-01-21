type ProgressCallback = (percent: number) => void;

export type TOptionsDownloadFile = {
  name: string;
  assetId: string;
  size: number;
  onDownloadProgress: ProgressCallback;
};

export type TUpdateProcess = "update-process";
