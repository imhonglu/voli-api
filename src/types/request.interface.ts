import type { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
  requestId: string;
}
