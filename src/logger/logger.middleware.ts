import { Request } from "@/types/request.interface";
import { NextFunction, Response } from "express";
import { generateRequestId } from "./utils/generate-request-id";

export function logger(req: Request, res: Response, next: NextFunction) {
  req.requestId = generateRequestId();

  next();
}
