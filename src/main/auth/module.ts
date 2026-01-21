import { RgModule } from "@devisfuture/electron-modular";
import { AuthService } from "./service.js";
import { AuthIpc } from "./ipc.js";
import { AuthWindow } from "./window.js";


@RgModule({
  providers: [AuthService],
  ipc: [AuthIpc],
  windows: [AuthWindow],
})
export class AuthModule {}
