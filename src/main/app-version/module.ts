import { RgModule } from "@devisfuture/electron-modular";
import { AppVersionIpc } from "./ipc.js";

@RgModule({
  ipc: [AppVersionIpc],
})
export class AppVersionModule {}
