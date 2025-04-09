import { Request } from "@/types/request.interface";
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  IntrinsicException,
  Logger,
} from "@nestjs/common";
import { AbstractHttpAdapter, BaseExceptionFilter } from "@nestjs/core";
import { TypeORMError } from "typeorm";
import { EntityNotFoundException } from "./exceptions/entity-not-found.exception";
import { UnexpectedServerException } from "./exceptions/unexpected-server.exception";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }

  handleUnknownError(
    exception: unknown,
    host: ArgumentsHost,
    applicationRef: AbstractHttpAdapter | HttpServer,
  ) {
    const req = host.switchToHttp().getRequest<Request>();
    const res = host.getArgByIndex(1);

    const { error, cause } = this.processException(exception);

    if (!applicationRef.isHeadersSent(res)) {
      applicationRef.reply(res, error.getResponse(), error.getStatus());
    } else {
      applicationRef.end(res);
    }

    if (cause) {
      this.logger.error(Object.assign(cause, { requestId: req.requestId }));
    }
  }

  private processException(exception: unknown): {
    error: HttpException;
    cause?: unknown;
  } {
    if (exception instanceof TypeORMError) {
      return this.handlePostgresError(exception);
    }

    const cause =
      exception instanceof IntrinsicException ? exception : undefined;

    if (this.isHttpError(exception)) {
      return {
        error: new HttpException(exception.message, exception.statusCode),
        cause,
      };
    }

    return {
      error: new UnexpectedServerException(),
      cause,
    };
  }

  private handlePostgresError(
    exception: TypeORMError,
  ): ReturnType<typeof this.processException> {
    switch (exception.name) {
      case "EntityNotFoundError":
        return {
          error: new EntityNotFoundException(),
        };

      default:
        return {
          error: new UnexpectedServerException(),
          cause: exception,
        };
    }
  }
}
