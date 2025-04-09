import type { Request } from "express";

export function hasContentTypeHeader(
  headers: Request["headers"],
): headers is Request["headers"] & { "content-type": string } {
  return "content-type" in headers && !!headers["content-type"];
}
