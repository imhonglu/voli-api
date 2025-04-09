import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  IntrinsicException,
} from "@nestjs/common";
import { AbstractHttpAdapter, BaseExceptionFilter } from "@nestjs/core";
import { TypeORMError } from "typeorm";
import { EntityNotFoundException } from "./exceptions/entity-not-found.exception";
import { UnexpectedServerException } from "./exceptions/unexpected-server.exception";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }

  handleUnknownError(
    exception: unknown,
    host: ArgumentsHost,
    applicationRef: AbstractHttpAdapter | HttpServer,
  ) {
    const { error, cause } = this.processException(exception);
    const httpResponse = host.getArgByIndex(1);

    if (!applicationRef.isHeadersSent(httpResponse)) {
      applicationRef.reply(
        httpResponse,
        error.getResponse(),
        error.getStatus(),
      );
    } else {
      applicationRef.end(httpResponse);
    }

    if (cause) {
      // @ts-expect-error
      AllExceptionsFilter.logger.error(cause);
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
