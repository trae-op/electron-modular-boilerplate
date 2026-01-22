import { Injectable } from "@devisfuture/electron-modular";
import { access } from "fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";

@Injectable()
export class VerifyService {
  constructor() {}

  async isVerify(folder: string, fileName: string): Promise<boolean> {
    const filePath = join(folder, fileName);
    try {
      await access(filePath, constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
}
