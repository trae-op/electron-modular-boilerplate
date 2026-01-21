import { dialog } from "electron";

import { logger } from "../logger.js";

type TParams = {
  title: string;
  body: string;
  isDialog?: boolean;
};

export function showErrorMessages({ title, body, isDialog = true }: TParams) {
  logger.error(title, body);

  if (isDialog) {
    dialog.showMessageBox({
      title,
      message: body,
    });
  }
}
