import { RgModule } from "@devisfuture/electron-modular";

import { ConfirmIpc } from "./ipc.js";
import { ConfirmService } from "./service.js";
import { ConfirmWindow } from "./window.js";

@RgModule({
  providers: [ConfirmService],
  ipc: [ConfirmIpc],
  windows: [ConfirmWindow],
})
export class ConfirmModule {}
