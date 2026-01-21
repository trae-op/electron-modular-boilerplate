import { RgModule } from "@devisfuture/electron-modular";
import { TrayService } from "./service.js";

@RgModule({
  providers: [TrayService],
  exports: [TrayService],
})
export class TrayModule {}
