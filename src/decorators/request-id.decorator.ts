import { Request } from "@/types/request.interface";
import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RequestId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  return request.requestId;
});
