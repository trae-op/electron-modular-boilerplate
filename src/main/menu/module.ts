import { RgModule } from "@devisfuture/electron-modular";
import { MenuService } from "./service.js";

@RgModule({
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
