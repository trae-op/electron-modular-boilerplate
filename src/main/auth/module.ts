import { RgModule } from "@devisfuture/electron-modular";

import { AuthIpc } from "./ipc.js";
import { AuthService } from "./service.js";
import { AuthWindow } from "./window.js";

@RgModule({
  providers: [AuthService],
  ipc: [AuthIpc],
  windows: [AuthWindow],
})
export class AuthModule {}
