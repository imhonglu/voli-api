import type { Request } from "@/types/request.interface";

export function hasContentTypeHeader(
  headers: Request["headers"],
): headers is Request["headers"] & { "content-type": string } {
  return "content-type" in headers && !!headers["content-type"];
}
