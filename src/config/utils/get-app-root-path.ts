import { existsSync } from "node:fs";
import { join } from "node:path";

export function getAppRootPath(): string {
  let currentDir = __dirname;

  while (!existsSync(join(currentDir, "package.json"))) {
    currentDir = join(currentDir, "..");
  }

  return join(currentDir, "..");
}
