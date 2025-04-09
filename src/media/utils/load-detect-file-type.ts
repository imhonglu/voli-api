import { FileTypeResult } from "../types/file-type-result.interface";

let cached: (buffer: Buffer) => Promise<FileTypeResult | undefined>;

export async function loadDetectFileType() {
  if (!cached) {
    cached = (await import("file-type")).fileTypeFromBuffer;
  }

  return cached;
}
